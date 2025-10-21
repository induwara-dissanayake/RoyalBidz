using RoyalBidz.Server.DTOs;

namespace RoyalBidz.Server.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentDto?> GetPaymentByIdAsync(int id);
        Task<IEnumerable<PaymentDto>> GetPaymentsByUserAsync(int userId);
        Task<PaymentDto?> GetPaymentByAuctionAsync(int auctionId);
        Task<PaymentDto> CreatePaymentAsync(int userId, CreatePaymentDto createPaymentDto);
        Task<PaymentDto> InitiateAuctionPaymentAsync(int userId, int auctionId);
        Task<bool> ProcessPaymentAsync(int id);
        Task<PaymentDto> ProcessAuctionPaymentAsync(int userId, ProcessPaymentDto processPaymentDto);
        Task<PaymentDto?> UpdatePaymentStatusAsync(int id, UpdatePaymentDto updatePaymentDto);
        Task<IEnumerable<PaymentDto>> GetPendingPaymentsAsync();
        Task<decimal> GetTotalRevenueAsync(DateTime? fromDate, DateTime? toDate);
    }
}
