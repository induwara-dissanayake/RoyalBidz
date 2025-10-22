using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetWithProfileAsync(int userId);
        Task<bool> EmailExistsAsync(string email);
        Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role);
        Task<IEnumerable<User>> GetActiveUsersAsync();
        Task UpdateLastLoginAsync(int userId);
    }

    public interface IUserProfileRepository : IGenericRepository<UserProfile>
    {
        Task<UserProfile?> GetByUserIdAsync(int userId);
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

    public interface IUserPreferencesRepository : IGenericRepository<UserPreferences>
    {
        Task<UserPreferences?> GetByUserIdAsync(int userId);
    }

    public interface IUserActivityRepository : IGenericRepository<UserActivity>
    {
        Task<IEnumerable<UserActivity>> GetUserActivitiesAsync(int userId, int page, int pageSize, string? activityType);
        Task<UserActivity?> GetRecentActivityAsync(int userId);
        Task<IEnumerable<UserActivity>> GetActivitiesByTypeAsync(string activityType, int page, int pageSize);
    }

    public interface IWishlistRepository : IGenericRepository<Wishlist>
    {
        Task<IEnumerable<Wishlist>> GetUserWishlistAsync(int userId);
        Task<Wishlist?> GetWishlistItemAsync(int userId, int jewelryItemId);
        Task<bool> IsInWishlistAsync(int userId, int jewelryItemId);
    }

    public interface IPaymentMethodRepository : IGenericRepository<PaymentMethod>
    {
        Task<IEnumerable<PaymentMethod>> GetUserPaymentMethodsAsync(int userId);
        Task<PaymentMethod?> GetDefaultPaymentMethodAsync(int userId);
        Task<bool> SetAsDefaultAsync(int paymentMethodId, int userId);
    }

    public interface IContactInquiryRepository : IGenericRepository<ContactInquiry>
    {
        Task<IEnumerable<ContactInquiry>> GetByStatusAsync(ContactInquiryStatus status);
        Task<IEnumerable<ContactInquiry>> GetByPriorityAsync(ContactInquiryPriority priority);
        Task<IEnumerable<ContactInquiry>> GetAssignedToUserAsync(int userId);
        Task<IEnumerable<ContactInquiry>> GetPendingInquiriesAsync();
        Task<IEnumerable<ContactInquiry>> GetRecentInquiriesAsync(int days = 30);
        Task<ContactInquiry?> GetWithAssignedUserAsync(int id);
        Task<bool> UpdateStatusAsync(int id, ContactInquiryStatus status);
        Task<bool> AssignToUserAsync(int id, int userId);
    }
}