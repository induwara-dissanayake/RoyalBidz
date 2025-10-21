using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Repositories.Interfaces
{
    public interface ISocialShareRepository : IGenericRepository<SocialShare>
    {
        Task<IEnumerable<SocialShare>> GetSharesByUserAsync(int userId);
        Task<IEnumerable<SocialShare>> GetSharesByAuctionAsync(int auctionId);
        Task<IEnumerable<SocialShare>> GetSharesByPlatformAsync(string platform);
        Task<Dictionary<string, int>> GetShareStatsByPlatformAsync();
        Task<int> GetTotalSharesAsync();
        Task<int> GetSharesCountByDateRangeAsync(DateTime fromDate, DateTime toDate);
    }
}
