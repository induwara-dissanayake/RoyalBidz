using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Hubs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class BidService : IBidService
    {
        private readonly IBidRepository _bidRepository;
        private readonly IAuctionRepository _auctionRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<AuctionHub> _hubContext;
        private readonly ILogger<BidService> _logger;

        public BidService(IBidRepository bidRepository, IAuctionRepository auctionRepository,
            IMapper mapper, IHubContext<AuctionHub> hubContext, ILogger<BidService> logger)
        {
            _bidRepository = bidRepository;
            _auctionRepository = auctionRepository;
            _mapper = mapper;
            _hubContext = hubContext;
            _logger = logger;
        }

        public async Task<BidDto?> GetBidByIdAsync(int id)
        {
            var bid = await _bidRepository.GetByIdAsync(id);
            return bid == null ? null : _mapper.Map<BidDto>(bid);
        }

        public async Task<IEnumerable<BidDto>> GetBidsByAuctionAsync(int auctionId)
        {
            var bids = await _bidRepository.GetBidsByAuctionAsync(auctionId);
            return _mapper.Map<IEnumerable<BidDto>>(bids);
        }

        public async Task<IEnumerable<BidDto>> GetBidsByUserAsync(int userId)
        {
            var bids = await _bidRepository.GetBidsByUserAsync(userId);
            return _mapper.Map<IEnumerable<BidDto>>(bids);
        }

        public async Task<BidDto?> GetHighestBidAsync(int auctionId)
        {
            var bid = await _bidRepository.GetHighestBidAsync(auctionId);
            return bid == null ? null : _mapper.Map<BidDto>(bid);
        }

        public async Task<IEnumerable<BidDto>> GetWinningBidsAsync(int userId)
        {
            var bids = await _bidRepository.GetWinningBidsAsync(userId);
            return _mapper.Map<IEnumerable<BidDto>>(bids);
        }

        public async Task<BidDto> PlaceBidAsync(int userId, CreateBidDto createBidDto)
        {
            // Validate bid
            if (!await ValidateBidAsync(createBidDto.AuctionId, createBidDto.Amount))
            {
                throw new InvalidOperationException("Invalid bid amount");
            }

            var auction = await _auctionRepository.GetByIdAsync(createBidDto.AuctionId);
            if (auction == null)
            {
                throw new InvalidOperationException("Auction not found");
            }

            // Allow bidding when auction is live based on start/end times.
            // Do not rely on Auction.Status value — permit bidding if StartTime <= now < EndTime.
            var now = DateTime.UtcNow;
            // Ensure we compare UTC times — database values may be stored without UTC kind
            var startUtc = auction.StartTime.Kind == DateTimeKind.Utc ? auction.StartTime : auction.StartTime.ToUniversalTime();
            var endUtc = auction.EndTime.Kind == DateTimeKind.Utc ? auction.EndTime : auction.EndTime.ToUniversalTime();

            if (startUtc > now)
            {
                throw new InvalidOperationException("Auction is not live");
            }

            if (endUtc <= now)
            {
                throw new InvalidOperationException("Auction has ended");
            }

            // Check if bidder is not the seller
            if (auction.SellerId == userId)
            {
                throw new InvalidOperationException("Seller cannot bid on their own auction");
            }

            var bid = _mapper.Map<Bid>(createBidDto);
            bid.BidderId = userId;
            bid.BidTime = DateTime.UtcNow;
            bid.Status = BidStatus.Active;

            await _bidRepository.AddAsync(bid);

            // Update auction current bid
            await _auctionRepository.UpdateCurrentBidAsync(auction.Id, bid.Amount, userId);

            // Update previous bid statuses
            var previousBids = await _bidRepository.GetBidsByAuctionAsync(auction.Id);
            foreach (var prevBid in previousBids.Where(b => b.Id != bid.Id))
            {
                if (prevBid.Status == BidStatus.Winning || prevBid.Status == BidStatus.Active)
                {
                    var bidEntity = await _bidRepository.GetByIdAsync(prevBid.Id);
                    if (bidEntity != null)
                    {
                        bidEntity.Status = BidStatus.Outbid;
                        await _bidRepository.UpdateAsync(bidEntity);
                    }
                }
            }

            // Set current bid as winning
            bid.Status = BidStatus.Winning;
            await _bidRepository.UpdateAsync(bid);

            // Process automatic bids
            await ProcessAutomaticBidsAsync(auction.Id, bid.Amount);

            // Send real-time notification (best-effort) - use same event name as controller
            try
            {
                await _hubContext.Clients.Group($"auction_{auction.Id}")
                    .SendAsync("BidUpdate", new { 
                        AuctionId = auction.Id, 
                        Amount = bid.Amount, 
                        BidderId = userId,
                        Id = bid.Id,
                        BidTime = bid.BidTime,
                        Timestamp = DateTime.UtcNow,
                        IsAutomaticBid = bid.IsAutomaticBid
                    });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send BidUpdate SignalR notification for auction {AuctionId}", auction.Id);
            }

            return _mapper.Map<BidDto>(bid);
        }

        public async Task<bool> ValidateBidAsync(int auctionId, decimal amount)
        {
            var auction = await _auctionRepository.GetByIdAsync(auctionId);
            if (auction == null)
            {
                return false;
            }

            // Check minimum bid amount
            var minimumBid = auction.CurrentBid + auction.BidIncrement;
            return amount >= minimumBid;
        }

        public async Task ProcessAutomaticBidsAsync(int auctionId, decimal newBidAmount)
        {
            var auction = await _auctionRepository.GetWithDetailsAsync(auctionId);
            if (auction == null) return;

            var autoBids = auction.Bids
                .Where(b => b.IsAutomaticBid && b.MaxAutoBidAmount.HasValue && 
                           b.MaxAutoBidAmount > newBidAmount && b.Status != BidStatus.Lost)
                .OrderByDescending(b => b.MaxAutoBidAmount)
                .ToList();

            if (autoBids.Any())
            {
                var highestAutoBid = autoBids.First();
                var nextBidAmount = newBidAmount + auction.BidIncrement;

                if (nextBidAmount <= highestAutoBid.MaxAutoBidAmount)
                {
                    var autoBid = new Bid
                    {
                        AuctionId = auctionId,
                        BidderId = highestAutoBid.BidderId,
                        Amount = nextBidAmount,
                        BidTime = DateTime.UtcNow.AddMilliseconds(100), // Slight delay
                        IsAutomaticBid = true,
                        Status = BidStatus.Winning
                    };

                    await _bidRepository.AddAsync(autoBid);
                    await _auctionRepository.UpdateCurrentBidAsync(auctionId, nextBidAmount, highestAutoBid.BidderId);

                    // Notify clients of automatic bid
                    try
                    {
                        await _hubContext.Clients.Group($"auction_{auctionId}")
                            .SendAsync("AutoBid", new { AuctionId = auctionId, Amount = nextBidAmount, BidderId = highestAutoBid.BidderId });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to send AutoBid SignalR notification for auction {AuctionId}", auctionId);
                    }
                }
            }
        }

        public async Task<List<BidHistoryDto>> GetBidHistoryAsync(int auctionId)
        {
            var auction = await _auctionRepository.GetByIdAsync(auctionId);
            if (auction == null)
            {
                throw new InvalidOperationException("Auction not found");
            }

            var bids = await _bidRepository.GetBidsByAuctionAsync(auctionId);
            var bidDtos = _mapper.Map<List<BidDto>>(bids.OrderByDescending(b => b.BidTime));

            var bidHistoryList = bidDtos.Select(bid => new BidHistoryDto
            {
                AuctionId = auctionId,
                AuctionTitle = auction.Title,
                Bids = new List<BidDto> { bid },
                HighestBid = bid.Amount,
                TotalBids = 1
            }).ToList();

            return bidHistoryList;
        }
    }
}