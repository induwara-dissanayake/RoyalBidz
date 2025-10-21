using AutoMapper;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class SocialShareService : ISocialShareService
    {
        private readonly ISocialShareRepository _socialShareRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<SocialShareService> _logger;

        public SocialShareService(
            ISocialShareRepository socialShareRepository,
            IMapper mapper,
            ILogger<SocialShareService> logger)
        {
            _socialShareRepository = socialShareRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<SocialShareDto> RecordShareAsync(int? userId, CreateSocialShareDto createSocialShareDto)
        {
            try
            {
                var socialShare = _mapper.Map<SocialShare>(createSocialShareDto);
                socialShare.UserId = userId;
                socialShare.CreatedAt = DateTime.UtcNow;

                await _socialShareRepository.AddAsync(socialShare);
                
                _logger.LogInformation("Social share recorded: {Platform} - {ShareType} by user {UserId}", 
                    createSocialShareDto.Platform, createSocialShareDto.ShareType, userId);

                return _mapper.Map<SocialShareDto>(socialShare);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording social share for user {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<SocialShareDto>> GetUserSharesAsync(int userId)
        {
            try
            {
                var shares = await _socialShareRepository.GetSharesByUserAsync(userId);
                return _mapper.Map<IEnumerable<SocialShareDto>>(shares);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user shares for user {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<SocialShareDto>> GetAuctionSharesAsync(int auctionId)
        {
            try
            {
                var shares = await _socialShareRepository.GetSharesByAuctionAsync(auctionId);
                return _mapper.Map<IEnumerable<SocialShareDto>>(shares);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting auction shares for auction {AuctionId}", auctionId);
                throw;
            }
        }

        public async Task<IEnumerable<SocialShareStatsDto>> GetShareStatsAsync()
        {
            try
            {
                var platformStats = await _socialShareRepository.GetShareStatsByPlatformAsync();
                var stats = new List<SocialShareStatsDto>();

                foreach (var platform in platformStats)
                {
                    var shares = await _socialShareRepository.GetSharesByPlatformAsync(platform.Key);
                    var auctionShares = shares.Count(s => s.ShareType == "auction");
                    var winShares = shares.Count(s => s.ShareType == "win");

                    stats.Add(new SocialShareStatsDto
                    {
                        Platform = platform.Key,
                        ShareCount = platform.Value,
                        AuctionShares = auctionShares,
                        WinShares = winShares
                    });
                }

                return stats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting social share stats");
                throw;
            }
        }

        public async Task<int> GetTotalSharesCountAsync()
        {
            try
            {
                return await _socialShareRepository.GetTotalSharesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total shares count");
                throw;
            }
        }

        public async Task<int> GetSharesCountByDateRangeAsync(DateTime fromDate, DateTime toDate)
        {
            try
            {
                return await _socialShareRepository.GetSharesCountByDateRangeAsync(fromDate, toDate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shares count by date range");
                throw;
            }
        }
    }
}
