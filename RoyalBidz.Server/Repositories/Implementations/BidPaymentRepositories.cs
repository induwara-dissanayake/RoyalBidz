using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Data;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;

namespace RoyalBidz.Server.Repositories.Implementations
{
    public class BidRepository : GenericRepository<Bid>, IBidRepository
    {
        public BidRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Bid>> GetBidsByAuctionAsync(int auctionId)
        {
            return await _dbSet
                .Include(b => b.Bidder)
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.BidTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<Bid>> GetBidsByUserAsync(int userId)
        {
            return await _dbSet
                .Include(b => b.Auction)
                .ThenInclude(a => a.JewelryItem)
                .Where(b => b.BidderId == userId)
                .OrderByDescending(b => b.BidTime)
                .ToListAsync();
        }

        public async Task<Bid?> GetHighestBidAsync(int auctionId)
        {
            return await _dbSet
                .Include(b => b.Bidder)
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.Amount)
                .ThenByDescending(b => b.BidTime)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Bid>> GetWinningBidsAsync(int userId)
        {
            return await _dbSet
                .Include(b => b.Auction)
                .ThenInclude(a => a.JewelryItem)
                .Where(b => b.BidderId == userId && b.Status == BidStatus.Won)
                .OrderByDescending(b => b.BidTime)
                .ToListAsync();
        }

        public async Task UpdateBidStatusesAsync(int auctionId, int winningBidId)
        {
            var bids = await _dbSet.Where(b => b.AuctionId == auctionId).ToListAsync();
            
            foreach (var bid in bids)
            {
                if (bid.Id == winningBidId)
                {
                    bid.Status = BidStatus.Won;
                }
                else if (bid.Status == BidStatus.Winning || bid.Status == BidStatus.Active)
                {
                    bid.Status = BidStatus.Lost;
                }
            }

            await _context.SaveChangesAsync();
        }
    }

    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        public PaymentRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Payment>> GetPaymentsByUserAsync(int userId)
        {
            return await _dbSet
                .Include(p => p.Auction)
                .ThenInclude(a => a.JewelryItem)
                .Where(p => p.PayerId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Payment?> GetPaymentByAuctionAsync(int auctionId)
        {
            return await _dbSet
                .Include(p => p.Payer)
                .Include(p => p.Auction)
                .FirstOrDefaultAsync(p => p.AuctionId == auctionId);
        }

        public async Task<IEnumerable<Payment>> GetPendingPaymentsAsync()
        {
            return await _dbSet
                .Include(p => p.Payer)
                .Include(p => p.Auction)
                .ThenInclude(a => a.JewelryItem)
                .Where(p => p.Status == PaymentStatus.Pending || p.Status == PaymentStatus.Processing)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalRevenueAsync(DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _dbSet.Where(p => p.Status == PaymentStatus.Completed);

            if (fromDate.HasValue)
                query = query.Where(p => p.ProcessedAt >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(p => p.ProcessedAt <= toDate.Value);

            return await query.SumAsync(p => p.AuctioneerFee ?? 0);
        }
    }
}