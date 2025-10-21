using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Services.Interfaces
{
    public interface IAuctionService
    {
        Task<AuctionDto?> GetAuctionByIdAsync(int id);
        Task<AuctionDto?> GetAuctionWithDetailsAsync(int id);
        Task<AuctionDetailDto?> GetAuctionDetailAsync(int id, int? userId = null);
        Task<PagedResultDto<AuctionDto>> SearchAuctionsAsync(AuctionSearchDto searchDto);
        Task<IEnumerable<AuctionDto>> GetActiveAuctionsAsync();
        Task<IEnumerable<AuctionDto>> GetAuctionsBySellerAsync(int sellerId);
        Task<IEnumerable<AuctionDto>> GetEndingSoonAuctionsAsync(int hours = 24);
        Task<AuctionDto> CreateAuctionAsync(int sellerId, CreateAuctionDto createAuctionDto);
        Task<AuctionDto?> UpdateAuctionAsync(int id, UpdateAuctionDto updateAuctionDto);
        Task<bool> DeleteAuctionAsync(int id);
        Task<bool> StartAuctionAsync(int id);
        Task<bool> EndAuctionAsync(int id);
        Task<bool> CancelAuctionAsync(int id);
        Task ProcessEndedAuctionsAsync();
    Task AssignWinningBidderAsync(int auctionId, int winnerId);
    }

    public interface IBidService
    {
        Task<BidDto?> GetBidByIdAsync(int id);
        Task<IEnumerable<BidDto>> GetBidsByAuctionAsync(int auctionId);
        Task<IEnumerable<BidDto>> GetBidsByUserAsync(int userId);
        Task<BidDto?> GetHighestBidAsync(int auctionId);
        Task<IEnumerable<BidDto>> GetWinningBidsAsync(int userId);
        Task<BidDto> PlaceBidAsync(int userId, CreateBidDto createBidDto);
        Task<bool> ValidateBidAsync(int auctionId, decimal amount);
        Task ProcessAutomaticBidsAsync(int auctionId, decimal newBidAmount);
        Task<List<BidHistoryDto>> GetBidHistoryAsync(int auctionId);
    }


    public interface INotificationService
    {
        Task SendBidNotificationAsync(int auctionId, decimal bidAmount, string bidderName);
        Task SendAuctionEndNotificationAsync(int auctionId);
        Task SendPaymentReminderAsync(int paymentId);
        Task SendWelcomeEmailAsync(string email, string name);
        Task SendPasswordResetEmailAsync(string email, string resetToken);
        Task SendEmailVerificationCodeAsync(string email, string name, string verificationCode);
        Task SendEmailVerificationSuccessAsync(string email, string name);
    }

    public interface IReportService
    {
        Task<object> GetAuctionReportAsync(DateTime fromDate, DateTime toDate);
        Task<object> GetBidderActivityReportAsync(DateTime fromDate, DateTime toDate);
        Task<object> GetRevenueReportAsync(DateTime fromDate, DateTime toDate);
        Task<object> GetPopularItemsReportAsync(int topCount = 10);
    }
}