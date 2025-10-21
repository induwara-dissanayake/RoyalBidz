using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Hubs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class AuctionService : IAuctionService
    {
        private readonly IAuctionRepository _auctionRepository;
        private readonly IJewelryItemRepository _jewelryRepository;
        private readonly IBidRepository _bidRepository;
        private readonly IWishlistRepository _wishlistRepository;
        private readonly IServiceProvider _serviceProvider;
        private readonly IMapper _mapper;
        private readonly ILogger<AuctionService> _logger;

        public AuctionService(IAuctionRepository auctionRepository, IJewelryItemRepository jewelryRepository,
            IBidRepository bidRepository, IWishlistRepository wishlistRepository,
            IMapper mapper, ILogger<AuctionService> logger, IServiceProvider serviceProvider)
        {
            _auctionRepository = auctionRepository;
            _jewelryRepository = jewelryRepository;
            _bidRepository = bidRepository;
            _wishlistRepository = wishlistRepository;
            _mapper = mapper;
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        // Use Colombo local times for storing and comparisons
        // Input DateTimes from client are interpreted as Colombo local time.
        // We'll store auctions with StartTime/EndTime as Colombo local times (Kind=Unspecified).
        private static DateTime ToColomboLocal(DateTime dt)
        {
            return RoyalBidz.Server.Utils.TimeZoneHelper.ToColomboLocal(dt);
        }

        public async Task<AuctionDto?> GetAuctionByIdAsync(int id)
        {
            var auction = await _auctionRepository.GetByIdAsync(id);
            return auction == null ? null : _mapper.Map<AuctionDto>(auction);
        }

        public async Task<AuctionDto?> GetAuctionWithDetailsAsync(int id)
        {
            var auction = await _auctionRepository.GetWithDetailsAsync(id);
            return auction == null ? null : _mapper.Map<AuctionDto>(auction);
        }

        public async Task<AuctionDetailDto?> GetAuctionDetailAsync(int id, int? userId = null)
        {
            var auction = await _auctionRepository.GetWithDetailsAsync(id);
            if (auction == null) return null;

            // Get bid history
            var bids = await _bidRepository.GetBidsByAuctionAsync(id);
            var bidDtos = _mapper.Map<List<BidDto>>(bids.OrderByDescending(b => b.BidTime));

            // Get current highest bid
            var highestBid = bids.OrderByDescending(b => b.Amount).FirstOrDefault();

            // Check if user is in wishlist (if user is provided)
            var isInWishlist = false;
            if (userId.HasValue)
            {
                isInWishlist = await _wishlistRepository.IsInWishlistAsync(userId.Value, auction.JewelryItemId);
            }

            // Map to AuctionDetailDto (first map to base AuctionDto, then copy to AuctionDetailDto)
            var baseAuctionDto = _mapper.Map<AuctionDto>(auction);
            var auctionDetailDto = new AuctionDetailDto
            {
                Id = baseAuctionDto.Id,
                Title = baseAuctionDto.Title,
                Description = baseAuctionDto.Description,
                StartingBid = baseAuctionDto.StartingBid,
                CurrentBid = baseAuctionDto.CurrentBid,
                BidIncrement = baseAuctionDto.BidIncrement,
                StartTime = baseAuctionDto.StartTime,
                EndTime = baseAuctionDto.EndTime,
                Status = baseAuctionDto.Status,
                SellerId = baseAuctionDto.SellerId,
                JewelryItemId = baseAuctionDto.JewelryItemId,
                JewelryItem = baseAuctionDto.JewelryItem,
                CreatedAt = baseAuctionDto.CreatedAt,
                UpdatedAt = baseAuctionDto.UpdatedAt,
                // Provide raw bid DTOs for history (frontend expects list of BidDto)
                BidHistory = bidDtos,
                HighestBidderId = highestBid?.BidderId ?? null,
                IsInWishlist = isInWishlist,
                TotalBids = bids.Count(),
                ViewCount = 0, // Set to 0 for now as Auction model doesn't have ViewCount
                Seller = baseAuctionDto.Seller,
                WinningBidder = baseAuctionDto.WinningBidder,
                LeadingBidder = baseAuctionDto.LeadingBidder
            };

            return auctionDetailDto;
        }

        public async Task<PagedResultDto<AuctionDto>> SearchAuctionsAsync(AuctionSearchDto searchDto)
        {
            var sortBy = searchDto.SortBy ?? "EndTime";
            var auctions = await _auctionRepository.SearchAuctionsAsync(
                searchDto.Search, searchDto.Type, searchDto.Material,
                searchDto.MinPrice, searchDto.MaxPrice, searchDto.Status,
                searchDto.Page, searchDto.PageSize, sortBy, searchDto.SortDescending);

            var totalCount = await _auctionRepository.GetSearchCountAsync(
                searchDto.Search, searchDto.Type, searchDto.Material,
                searchDto.MinPrice, searchDto.MaxPrice, searchDto.Status);

            var auctionDtos = _mapper.Map<List<AuctionDto>>(auctions);
            var totalPages = (int)Math.Ceiling((double)totalCount / searchDto.PageSize);

            return new PagedResultDto<AuctionDto>
            {
                Items = auctionDtos,
                TotalCount = totalCount,
                Page = searchDto.Page,
                PageSize = searchDto.PageSize,
                TotalPages = totalPages,
                HasNextPage = searchDto.Page < totalPages,
                HasPreviousPage = searchDto.Page > 1
            };
        }

        public async Task<IEnumerable<AuctionDto>> GetActiveAuctionsAsync()
        {
            var auctions = await _auctionRepository.GetActiveAuctionsAsync();
            return _mapper.Map<IEnumerable<AuctionDto>>(auctions);
        }

        public async Task<IEnumerable<AuctionDto>> GetAuctionsBySellerAsync(int sellerId)
        {
            var auctions = await _auctionRepository.GetAuctionsBySellerAsync(sellerId);
            return _mapper.Map<IEnumerable<AuctionDto>>(auctions);
        }

        public async Task<IEnumerable<AuctionDto>> GetEndingSoonAuctionsAsync(int hours = 24)
        {
            if (hours == 0)
            {
                // Find auctions whose end time has already passed but are not finalized yet
                var colomboNow = RoyalBidz.Server.Utils.TimeZoneHelper.GetColomboNow();
                var due = await _auctionRepository.FindAsync(a =>
                    a.EndTime <= colomboNow &&
                    a.Status != AuctionStatus.Ended &&
                    a.Status != AuctionStatus.Cancelled &&
                    a.Status != AuctionStatus.Completed);

                return _mapper.Map<IEnumerable<AuctionDto>>(due);
            }

            var auctions = await _auctionRepository.GetEndingSoonAsync(TimeSpan.FromHours(hours));
            return _mapper.Map<IEnumerable<AuctionDto>>(auctions);
        }

        public async Task<AuctionDto> CreateAuctionAsync(int sellerId, CreateAuctionDto createAuctionDto)
        {
            // Validate jewelry item exists
            var jewelryItem = await _jewelryRepository.GetByIdAsync(createAuctionDto.JewelryItemId);
            if (jewelryItem == null)
            {
                throw new InvalidOperationException("Jewelry item not found");
            }

            var auction = _mapper.Map<Auction>(createAuctionDto);
            // Normalize StartTime/EndTime to Colombo local time (store local values)
            auction.StartTime = ToColomboLocal(auction.StartTime);
            auction.EndTime = ToColomboLocal(auction.EndTime);
            auction.SellerId = sellerId;
            auction.CreatedAt = DateTime.UtcNow;
            auction.CurrentBid = auction.StartingBid;

            // Auto-start if start time is now or in the past
            // Compare using Colombo local time logic: auction starts when StartTime <= ColomboNow
            if (auction.StartTime <= RoyalBidz.Server.Utils.TimeZoneHelper.GetColomboNow())
            {
                auction.Status = AuctionStatus.Active;
            }
            else
            {
                auction.Status = AuctionStatus.Scheduled;
            }

            await _auctionRepository.AddAsync(auction);
            return _mapper.Map<AuctionDto>(auction);
        }

        public async Task<AuctionDto?> UpdateAuctionAsync(int id, UpdateAuctionDto updateAuctionDto)
        {
            var auction = await _auctionRepository.GetByIdAsync(id);
            if (auction == null)
            {
                return null;
            }

            // Only allow updates if auction hasn't started or is in draft
            if (auction.Status != AuctionStatus.Draft && auction.Status != AuctionStatus.Scheduled)
            {
                throw new InvalidOperationException("Cannot update auction that has already started");
            }

            // Map fields first
            _mapper.Map(updateAuctionDto, auction);
            // If StartTime/EndTime provided, normalize to UTC
            if (updateAuctionDto.StartTime.HasValue)
            {
                auction.StartTime = ToColomboLocal(updateAuctionDto.StartTime.Value);
            }
            if (updateAuctionDto.EndTime.HasValue)
            {
                auction.EndTime = ToColomboLocal(updateAuctionDto.EndTime.Value);
            }
            auction.UpdatedAt = DateTime.UtcNow;

            await _auctionRepository.UpdateAsync(auction);
            return _mapper.Map<AuctionDto>(auction);
        }

        public async Task<bool> DeleteAuctionAsync(int id)
        {
            var auction = await _auctionRepository.GetByIdAsync(id);
            if (auction == null)
            {
                return false;
            }

            // Only allow deletion if no bids placed
            if (auction.Bids.Any())
            {
                throw new InvalidOperationException("Cannot delete auction with existing bids");
            }

            await _auctionRepository.DeleteAsync(auction);
            return true;
        }

        public async Task<bool> StartAuctionAsync(int id)
        {
            var auction = await _auctionRepository.GetByIdAsync(id);
            if (auction == null || auction.Status != AuctionStatus.Scheduled)
            {
                return false;
            }

            auction.Status = AuctionStatus.Active;
            auction.UpdatedAt = DateTime.UtcNow;
            await _auctionRepository.UpdateAsync(auction);

            return true;
        }

        public async Task<bool> EndAuctionAsync(int id)
        {
            var auction = await _auctionRepository.GetByIdAsync(id);
            if (auction == null || auction.Status != AuctionStatus.Active)
            {
                return false;
            }

            auction.Status = AuctionStatus.Ended;
            auction.UpdatedAt = DateTime.UtcNow;
            await _auctionRepository.UpdateAsync(auction);

            return true;
        }

        public async Task<bool> CancelAuctionAsync(int id)
        {
            var auction = await _auctionRepository.GetByIdAsync(id);
            if (auction == null)
            {
                return false;
            }

            auction.Status = AuctionStatus.Cancelled;
            auction.UpdatedAt = DateTime.UtcNow;
            await _auctionRepository.UpdateAsync(auction);

            return true;
        }

        public async Task AssignWinningBidderAsync(int auctionId, int winnerId)
        {
            var auction = await _auctionRepository.GetByIdAsync(auctionId);
            if (auction == null) return;

            // Mark auction as ended and set winner
            auction.WinningBidderId = winnerId;
            auction.Status = AuctionStatus.Ended;
            auction.UpdatedAt = DateTime.UtcNow;
            await _auctionRepository.UpdateAsync(auction);

            // Update bid statuses: top bid = Won, others = Outbid/Lost
            var bids = (await _auctionRepository.GetWithDetailsAsync(auctionId))?.Bids
                .OrderByDescending(b => b.BidTime)
                .ToList();

            if (bids == null || !bids.Any()) return;

            // Determine winning bid (highest amount, latest time)
            var winningBid = bids.OrderByDescending(b => b.Amount).ThenByDescending(b => b.BidTime).First();

            foreach (var b in bids)
            {
                if (b.Id == winningBid.Id)
                {
                    b.Status = BidStatus.Won;
                }
                else
                {
                    // if previously marked as Winning or Active, mark as Outbid
                    if (b.Status == BidStatus.Winning || b.Status == BidStatus.Active)
                        b.Status = BidStatus.Outbid;
                    else if (b.Status == BidStatus.Won)
                        b.Status = BidStatus.Lost; // avoid multiple Wons
                }
            }

            // Persist bid status changes
            foreach (var b in bids)
            {
                await _bidRepository.UpdateAsync(b);
            }

            // Create notifications: outbid notifications for users who were outbid, and won+payment for the winner
            using var scope = _serviceProvider.CreateScope();
            var notificationService = scope.ServiceProvider.GetRequiredService<IUserNotificationService>();

            // Send outbid notifications to distinct users who are not the winner and had their bids changed to Outbid
            var outbidUsers = bids.Where(b => b.Status == BidStatus.Outbid)
                .Select(b => new { b.BidderId, b.Amount })
                .GroupBy(x => x.BidderId)
                .Select(g => g.OrderByDescending(x => x.Amount).First())
                .ToList();

            foreach (var u in outbidUsers)
            {
                try
                {
                    await notificationService.CreateBidOutbidNotificationAsync(u.BidderId, auction.Title, u.Amount);
                }
                catch { /* best-effort */ }
            }

            // Notify winner: auction won + payment action
            try
            {
                await notificationService.CreateAuctionWonWithPaymentNotificationAsync(
                    winnerId,
                    auction.Title,
                    winningBid.Amount,
                    auction.Id
                );
            }
            catch { /* best-effort */ }
        }

        public async Task ProcessEndedAuctionsAsync()
        {
            // Find auctions where EndTime (stored as Colombo local) is <= Colombo now
            var colomboNow = RoyalBidz.Server.Utils.TimeZoneHelper.GetColomboNow();
            var activeAuctions = await _auctionRepository.FindAsync(a => 
                a.Status == AuctionStatus.Active && a.EndTime <= colomboNow);

            foreach (var auction in activeAuctions)
            {
                auction.Status = AuctionStatus.Ended;
                auction.UpdatedAt = DateTime.UtcNow;
                await _auctionRepository.UpdateAsync(auction);
            }
        }
    }
}