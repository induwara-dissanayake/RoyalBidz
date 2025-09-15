using AutoMapper;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IAuctionRepository _auctionRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(IPaymentRepository paymentRepository, IAuctionRepository auctionRepository,
            IMapper mapper, ILogger<PaymentService> logger)
        {
            _paymentRepository = paymentRepository;
            _auctionRepository = auctionRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PaymentDto?> GetPaymentByIdAsync(int id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            return payment == null ? null : _mapper.Map<PaymentDto>(payment);
        }

        public async Task<IEnumerable<PaymentDto>> GetPaymentsByUserAsync(int userId)
        {
            var payments = await _paymentRepository.GetPaymentsByUserAsync(userId);
            return _mapper.Map<IEnumerable<PaymentDto>>(payments);
        }

        public async Task<PaymentDto?> GetPaymentByAuctionAsync(int auctionId)
        {
            var payment = await _paymentRepository.GetPaymentByAuctionAsync(auctionId);
            return payment == null ? null : _mapper.Map<PaymentDto>(payment);
        }

        public async Task<IEnumerable<PaymentDto>> GetPendingPaymentsAsync()
        {
            var payments = await _paymentRepository.GetPendingPaymentsAsync();
            return _mapper.Map<IEnumerable<PaymentDto>>(payments);
        }

        public async Task<PaymentDto> CreatePaymentAsync(int userId, CreatePaymentDto createPaymentDto)
        {
            var auction = await _auctionRepository.GetByIdAsync(createPaymentDto.AuctionId);
            if (auction == null)
            {
                throw new InvalidOperationException("Auction not found");
            }

            if (auction.WinningBidderId != userId)
            {
                throw new InvalidOperationException("You are not the winning bidder");
            }

            // Calculate fees (example: 10% auctioneer fee, 3% processing fee)
            var auctioneerFee = createPaymentDto.Amount * 0.10m;
            var processingFee = createPaymentDto.Amount * 0.03m;
            var totalAmount = createPaymentDto.Amount + auctioneerFee + processingFee;

            var payment = _mapper.Map<Payment>(createPaymentDto);
            payment.PayerId = userId;
            payment.AuctioneerFee = auctioneerFee;
            payment.ProcessingFee = processingFee;
            payment.TotalAmount = totalAmount;
            payment.CreatedAt = DateTime.UtcNow;

            await _paymentRepository.AddAsync(payment);
            return _mapper.Map<PaymentDto>(payment);
        }

        public async Task<PaymentDto?> UpdatePaymentStatusAsync(int id, UpdatePaymentDto updatePaymentDto)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null)
            {
                return null;
            }

            _mapper.Map(updatePaymentDto, payment);

            if (updatePaymentDto.Status == PaymentStatus.Completed)
            {
                payment.ProcessedAt = DateTime.UtcNow;
                
                // Update auction status to completed
                var auction = await _auctionRepository.GetByIdAsync(payment.AuctionId);
                if (auction != null)
                {
                    auction.Status = AuctionStatus.Completed;
                    await _auctionRepository.UpdateAsync(auction);
                }
            }

            await _paymentRepository.UpdateAsync(payment);
            return _mapper.Map<PaymentDto>(payment);
        }

        public async Task<bool> ProcessPaymentAsync(int paymentId)
        {
            var payment = await _paymentRepository.GetByIdAsync(paymentId);
            if (payment == null || payment.Status != PaymentStatus.Pending)
            {
                return false;
            }

            try
            {
                // Simulate payment processing (fake implementation)
                await Task.Delay(2000); // Simulate API call delay

                // Randomly succeed or fail for demo purposes
                var random = new Random();
                var success = random.Next(1, 101) <= 90; // 90% success rate

                if (success)
                {
                    payment.Status = PaymentStatus.Completed;
                    payment.ProcessedAt = DateTime.UtcNow;
                    payment.TransactionId = $"TXN_{DateTime.UtcNow:yyyyMMddHHmmss}_{paymentId}";
                    payment.PaymentGatewayResponse = "Payment successful";

                    // Update auction status
                    var auction = await _auctionRepository.GetByIdAsync(payment.AuctionId);
                    if (auction != null)
                    {
                        auction.Status = AuctionStatus.Completed;
                        await _auctionRepository.UpdateAsync(auction);
                    }
                }
                else
                {
                    payment.Status = PaymentStatus.Failed;
                    payment.PaymentGatewayResponse = "Payment failed - insufficient funds";
                }

                await _paymentRepository.UpdateAsync(payment);
                return success;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment {PaymentId}", paymentId);
                payment.Status = PaymentStatus.Failed;
                payment.PaymentGatewayResponse = "Payment processing error";
                await _paymentRepository.UpdateAsync(payment);
                return false;
            }
        }

        public async Task<decimal> GetTotalRevenueAsync(DateTime? fromDate = null, DateTime? toDate = null)
        {
            return await _paymentRepository.GetTotalRevenueAsync(fromDate, toDate);
        }

        public async Task<PaymentDto> InitiateAuctionPaymentAsync(int userId, int auctionId)
        {
            var auction = await _auctionRepository.GetWithDetailsAsync(auctionId);
            if (auction == null)
            {
                throw new InvalidOperationException("Auction not found");
            }

            if (auction.Status != AuctionStatus.Ended)
            {
                throw new InvalidOperationException("Auction has not ended");
            }

            if (auction.WinningBidderId != userId)
            {
                throw new InvalidOperationException("You are not the winning bidder");
            }

            // Check if payment already exists
            var existingPayment = await _paymentRepository.GetPaymentByAuctionAsync(auctionId);
            if (existingPayment != null)
            {
                return _mapper.Map<PaymentDto>(existingPayment);
            }

            var createPaymentDto = new CreatePaymentDto
            {
                AuctionId = auctionId,
                Amount = auction.CurrentBid,
                Method = PaymentMethod.CreditCard // Default method
            };

            return await CreatePaymentAsync(userId, createPaymentDto);
        }
    }

    public class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(ILogger<NotificationService> logger)
        {
            _logger = logger;
        }

        public async Task SendBidNotificationAsync(int auctionId, decimal bidAmount, string bidderName)
        {
            // Fake email sending - log the notification
            _logger.LogInformation("Sending bid notification: Auction {AuctionId}, Amount: {Amount}, Bidder: {Bidder}", 
                auctionId, bidAmount, bidderName);
            await Task.Delay(100); // Simulate email sending
        }

        public async Task SendAuctionEndNotificationAsync(int auctionId)
        {
            _logger.LogInformation("Sending auction end notification for auction {AuctionId}", auctionId);
            await Task.Delay(100);
        }

        public async Task SendPaymentReminderAsync(int paymentId)
        {
            _logger.LogInformation("Sending payment reminder for payment {PaymentId}", paymentId);
            await Task.Delay(100);
        }

        public async Task SendWelcomeEmailAsync(string email, string name)
        {
            _logger.LogInformation("Sending welcome email to {Email} for {Name}", email, name);
            await Task.Delay(100);
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            _logger.LogInformation("Sending password reset email to {Email}", email);
            await Task.Delay(100);
        }
    }
}