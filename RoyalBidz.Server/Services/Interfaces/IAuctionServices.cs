using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Services.Interfaces
{
    public interface IAuctionService
    {
        Task<AuctionDto?> GetAuctionByIdAsync(int id);
        Task<AuctionDto?> GetAuctionWithDetailsAsync(int id);
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
        Task<BidHistoryDto> GetBidHistoryAsync(int auctionId);
    }

    public interface IPaymentService
    {
        Task<PaymentDto?> GetPaymentByIdAsync(int id);
        Task<IEnumerable<PaymentDto>> GetPaymentsByUserAsync(int userId);
        Task<PaymentDto?> GetPaymentByAuctionAsync(int auctionId);
        Task<IEnumerable<PaymentDto>> GetPendingPaymentsAsync();
        Task<PaymentDto> CreatePaymentAsync(int userId, CreatePaymentDto createPaymentDto);
        Task<PaymentDto?> UpdatePaymentStatusAsync(int id, UpdatePaymentDto updatePaymentDto);
        Task<bool> ProcessPaymentAsync(int paymentId);
        Task<decimal> GetTotalRevenueAsync(DateTime? fromDate = null, DateTime? toDate = null);
        Task<PaymentDto> InitiateAuctionPaymentAsync(int userId, int auctionId);
    }

    public interface INotificationService
    {
        Task SendBidNotificationAsync(int auctionId, decimal bidAmount, string bidderName);
        Task SendAuctionEndNotificationAsync(int auctionId);
        Task SendPaymentReminderAsync(int paymentId);
        Task SendWelcomeEmailAsync(string email, string name);
        Task SendPasswordResetEmailAsync(string email, string resetToken);
    }

    public interface IReportService
    {
        Task<object> GetAuctionReportAsync(DateTime fromDate, DateTime toDate);
        Task<object> GetBidderActivityReportAsync(DateTime fromDate, DateTime toDate);
        Task<object> GetRevenueReportAsync(DateTime fromDate, DateTime toDate);
        Task<object> GetPopularItemsReportAsync(int topCount = 10);
    }
}