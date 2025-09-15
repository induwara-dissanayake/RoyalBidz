using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Data;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;

namespace RoyalBidz.Server.Repositories.Implementations
{
    public class AuctionRepository : GenericRepository<Auction>, IAuctionRepository
    {
        public AuctionRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Auction>> GetActiveAuctionsAsync()
        {
            return await _dbSet
                .Include(a => a.JewelryItem)
                .ThenInclude(j => j.Images)
                .Include(a => a.Seller)
                .Where(a => a.Status == AuctionStatus.Active)
                .OrderBy(a => a.EndTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<Auction>> GetAuctionsBySellerAsync(int sellerId)
        {
            return await _dbSet
                .Include(a => a.JewelryItem)
                .ThenInclude(j => j.Images)
                .Where(a => a.SellerId == sellerId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Auction>> GetEndingSoonAsync(TimeSpan timeSpan)
        {
            var endTime = DateTime.UtcNow.Add(timeSpan);
            return await _dbSet
                .Include(a => a.JewelryItem)
                .ThenInclude(j => j.Images)
                .Include(a => a.Seller)
                .Where(a => a.Status == AuctionStatus.Active && a.EndTime <= endTime)
                .OrderBy(a => a.EndTime)
                .ToListAsync();
        }

        public async Task<Auction?> GetWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(a => a.JewelryItem)
                .ThenInclude(j => j.Images.OrderBy(i => i.DisplayOrder))
                .Include(a => a.Seller)
                .Include(a => a.WinningBidder)
                .Include(a => a.Bids.OrderByDescending(b => b.BidTime))
                .ThenInclude(b => b.Bidder)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Auction>> SearchAuctionsAsync(string? search, JewelryType? type,
            JewelryMaterial? material, decimal? minPrice, decimal? maxPrice,
            AuctionStatus? status, int page, int pageSize, string sortBy, bool sortDescending)
        {
            var query = _dbSet
                .Include(a => a.JewelryItem)
                .ThenInclude(j => j.Images)
                .Include(a => a.Seller)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a => a.Title.Contains(search) ||
                                        a.JewelryItem.Name.Contains(search) ||
                                        (a.Description != null && a.Description.Contains(search)));
            }

            if (type.HasValue)
                query = query.Where(a => a.JewelryItem.Type == type.Value);

            if (material.HasValue)
                query = query.Where(a => a.JewelryItem.PrimaryMaterial == material.Value);

            if (minPrice.HasValue)
                query = query.Where(a => a.CurrentBid >= minPrice.Value || a.StartingBid >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(a => a.CurrentBid <= maxPrice.Value || a.StartingBid <= maxPrice.Value);

            if (status.HasValue)
                query = query.Where(a => a.Status == status.Value);

            // Apply sorting
            query = sortBy.ToLower() switch
            {
                "title" => sortDescending ? query.OrderByDescending(a => a.Title) : query.OrderBy(a => a.Title),
                "currentbid" => sortDescending ? query.OrderByDescending(a => a.CurrentBid) : query.OrderBy(a => a.CurrentBid),
                "starttime" => sortDescending ? query.OrderByDescending(a => a.StartTime) : query.OrderBy(a => a.StartTime),
                "createdat" => sortDescending ? query.OrderByDescending(a => a.CreatedAt) : query.OrderBy(a => a.CreatedAt),
                _ => sortDescending ? query.OrderByDescending(a => a.EndTime) : query.OrderBy(a => a.EndTime)
            };

            return await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetSearchCountAsync(string? search, JewelryType? type,
            JewelryMaterial? material, decimal? minPrice, decimal? maxPrice, AuctionStatus? status)
        {
            var query = _dbSet.AsQueryable();

            // Apply same filters as SearchAuctionsAsync
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a => a.Title.Contains(search) ||
                                        a.JewelryItem.Name.Contains(search) ||
                                        (a.Description != null && a.Description.Contains(search)));
            }

            if (type.HasValue)
                query = query.Where(a => a.JewelryItem.Type == type.Value);

            if (material.HasValue)
                query = query.Where(a => a.JewelryItem.PrimaryMaterial == material.Value);

            if (minPrice.HasValue)
                query = query.Where(a => a.CurrentBid >= minPrice.Value || a.StartingBid >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(a => a.CurrentBid <= maxPrice.Value || a.StartingBid <= maxPrice.Value);

            if (status.HasValue)
                query = query.Where(a => a.Status == status.Value);

            return await query.CountAsync();
        }

        public async Task UpdateCurrentBidAsync(int auctionId, decimal currentBid, int? winnerId)
        {
            var auction = await _dbSet.FindAsync(auctionId);
            if (auction != null)
            {
                auction.CurrentBid = currentBid;
                auction.WinningBidderId = winnerId;
                auction.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
    }
}