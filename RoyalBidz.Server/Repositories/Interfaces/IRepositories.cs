using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role);
        Task<IEnumerable<User>> GetActiveUsersAsync();
        Task UpdateLastLoginAsync(int userId);
    }

    public interface IJewelryItemRepository : IGenericRepository<JewelryItem>
    {
        Task<IEnumerable<JewelryItem>> GetByTypeAsync(JewelryType type);
        Task<IEnumerable<JewelryItem>> GetByMaterialAsync(JewelryMaterial material);
        Task<IEnumerable<JewelryItem>> SearchAsync(string searchTerm);
        Task<JewelryItem?> GetWithImagesAsync(int id);
    }

    public interface IAuctionRepository : IGenericRepository<Auction>
    {
        Task<IEnumerable<Auction>> GetActiveAuctionsAsync();
        Task<IEnumerable<Auction>> GetAuctionsBySellerAsync(int sellerId);
        Task<IEnumerable<Auction>> GetEndingSoonAsync(TimeSpan timeSpan);
        Task<Auction?> GetWithDetailsAsync(int id);
        Task<IEnumerable<Auction>> SearchAuctionsAsync(string? search, JewelryType? type, 
            JewelryMaterial? material, decimal? minPrice, decimal? maxPrice, 
            AuctionStatus? status, int page, int pageSize, string sortBy, bool sortDescending);
        Task<int> GetSearchCountAsync(string? search, JewelryType? type, 
            JewelryMaterial? material, decimal? minPrice, decimal? maxPrice, AuctionStatus? status);
        Task UpdateCurrentBidAsync(int auctionId, decimal currentBid, int? winnerId);
    }

    public interface IBidRepository : IGenericRepository<Bid>
    {
        Task<IEnumerable<Bid>> GetBidsByAuctionAsync(int auctionId);
        Task<IEnumerable<Bid>> GetBidsByUserAsync(int userId);
        Task<Bid?> GetHighestBidAsync(int auctionId);
        Task<IEnumerable<Bid>> GetWinningBidsAsync(int userId);
        Task UpdateBidStatusesAsync(int auctionId, int winningBidId);
    }

    public interface IPaymentRepository : IGenericRepository<Payment>
    {
        Task<IEnumerable<Payment>> GetPaymentsByUserAsync(int userId);
        Task<Payment?> GetPaymentByAuctionAsync(int auctionId);
        Task<IEnumerable<Payment>> GetPendingPaymentsAsync();
        Task<decimal> GetTotalRevenueAsync(DateTime? fromDate = null, DateTime? toDate = null);
    }
}