using RoyalBidz.Server.DTOs;

namespace RoyalBidz.Server.Services.Interfaces
{
    public interface ISocialShareService
    {
        Task<SocialShareDto> RecordShareAsync(int? userId, CreateSocialShareDto createSocialShareDto);
        Task<IEnumerable<SocialShareDto>> GetUserSharesAsync(int userId);
        Task<IEnumerable<SocialShareDto>> GetAuctionSharesAsync(int auctionId);
        Task<IEnumerable<SocialShareStatsDto>> GetShareStatsAsync();
        Task<int> GetTotalSharesCountAsync();
        Task<int> GetSharesCountByDateRangeAsync(DateTime fromDate, DateTime toDate);
    }
}
