using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Hubs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class AuctionService : IAuctionService
    {
        private readonly IAuctionRepository _auctionRepository;
        private readonly IJewelryItemRepository _jewelryRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<AuctionService> _logger;

        public AuctionService(IAuctionRepository auctionRepository, IJewelryItemRepository jewelryRepository,
            IMapper mapper, ILogger<AuctionService> logger)
        {
            _auctionRepository = auctionRepository;
            _jewelryRepository = jewelryRepository;
            _mapper = mapper;
            _logger = logger;
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

        public async Task<PagedResultDto<AuctionDto>> SearchAuctionsAsync(AuctionSearchDto searchDto)
        {
            var auctions = await _auctionRepository.SearchAuctionsAsync(
                searchDto.Search, searchDto.Type, searchDto.Material,
                searchDto.MinPrice, searchDto.MaxPrice, searchDto.Status,
                searchDto.Page, searchDto.PageSize, searchDto.SortBy, searchDto.SortDescending);

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
            auction.SellerId = sellerId;
            auction.CreatedAt = DateTime.UtcNow;
            auction.CurrentBid = auction.StartingBid;

            // Auto-start if start time is now or in the past
            if (auction.StartTime <= DateTime.UtcNow)
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

            _mapper.Map(updateAuctionDto, auction);
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

        public async Task ProcessEndedAuctionsAsync()
        {
            var activeAuctions = await _auctionRepository.FindAsync(a => 
                a.Status == AuctionStatus.Active && a.EndTime <= DateTime.UtcNow);

            foreach (var auction in activeAuctions)
            {
                auction.Status = AuctionStatus.Ended;
                auction.UpdatedAt = DateTime.UtcNow;
                await _auctionRepository.UpdateAsync(auction);
            }
        }
    }
}