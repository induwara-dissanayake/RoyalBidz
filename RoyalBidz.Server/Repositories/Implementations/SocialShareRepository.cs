using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Data;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;

namespace RoyalBidz.Server.Repositories.Implementations
{
    public class SocialShareRepository : GenericRepository<SocialShare>, ISocialShareRepository
    {
        public SocialShareRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<SocialShare>> GetSharesByUserAsync(int userId)
        {
            return await _context.SocialShares
                .Include(s => s.User)
                .Include(s => s.Auction)
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<SocialShare>> GetSharesByAuctionAsync(int auctionId)
        {
            return await _context.SocialShares
                .Include(s => s.User)
                .Include(s => s.Auction)
                .Where(s => s.AuctionId == auctionId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<SocialShare>> GetSharesByPlatformAsync(string platform)
        {
            return await _context.SocialShares
                .Include(s => s.User)
                .Include(s => s.Auction)
                .Where(s => s.Platform == platform)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<Dictionary<string, int>> GetShareStatsByPlatformAsync()
        {
            return await _context.SocialShares
                .GroupBy(s => s.Platform)
                .ToDictionaryAsync(g => g.Key, g => g.Count());
        }

        public async Task<int> GetTotalSharesAsync()
        {
            return await _context.SocialShares.CountAsync();
        }

        public async Task<int> GetSharesCountByDateRangeAsync(DateTime fromDate, DateTime toDate)
        {
            return await _context.SocialShares
                .Where(s => s.CreatedAt >= fromDate && s.CreatedAt <= toDate)
                .CountAsync();
        }
    }
}
