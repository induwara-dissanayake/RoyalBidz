using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Data;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly RoyalBidzDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUserNotificationService _notificationService;
        private readonly IEmailNotificationService _emailService;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(
            RoyalBidzDbContext context,
            IMapper mapper,
            IUserNotificationService notificationService,
            IEmailNotificationService emailService,
            ILogger<PaymentService> logger)
        {
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<PaymentDto?> GetPaymentByIdAsync(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.Payer)
                .Include(p => p.Auction)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null) return null;

            var paymentDto = _mapper.Map<PaymentDto>(payment);
            paymentDto.AuctionTitle = payment.Auction.Title;
            return paymentDto;
        }

        public async Task<IEnumerable<PaymentDto>> GetPaymentsByUserAsync(int userId)
        {
            var payments = await _context.Payments
                .Include(p => p.Payer)
                .Include(p => p.Auction)
                .Where(p => p.PayerId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return payments.Select(p =>
            {
                var dto = _mapper.Map<PaymentDto>(p);
                dto.AuctionTitle = p.Auction.Title;
                return dto;
            });
        }

        public async Task<PaymentDto?> GetPaymentByAuctionAsync(int auctionId)
        {
            var payment = await _context.Payments
                .Include(p => p.Payer)
                .Include(p => p.Auction)
                .FirstOrDefaultAsync(p => p.AuctionId == auctionId);

            if (payment == null) return null;

            var paymentDto = _mapper.Map<PaymentDto>(payment);
            paymentDto.AuctionTitle = payment.Auction.Title;
            return paymentDto;
        }

        public async Task<PaymentDto> CreatePaymentAsync(int userId, CreatePaymentDto createPaymentDto)
        {
            var auction = await _context.Auctions.FindAsync(createPaymentDto.AuctionId);
            if (auction == null)
                throw new InvalidOperationException("Auction not found");

            var payment = new Payment
            {
                AuctionId = createPaymentDto.AuctionId,
                PayerId = userId,
                Amount = createPaymentDto.Amount,
                ProcessingFee = createPaymentDto.Amount * 0.03m, // 3% processing fee
                TotalAmount = createPaymentDto.Amount * 1.03m,
                Method = createPaymentDto.Method,
                Status = PaymentStatus.Pending,
                TransactionId = createPaymentDto.TransactionId,
                PaymentDeadline = DateTime.UtcNow.AddHours(48) // 48 hour deadline
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return await GetPaymentByIdAsync(payment.Id) ?? throw new InvalidOperationException("Failed to retrieve created payment");
        }

        public async Task<PaymentDto> InitiateAuctionPaymentAsync(int userId, int auctionId)
        {
            var auction = await _context.Auctions
                .FirstOrDefaultAsync(a => a.Id == auctionId);

            if (auction == null)
                throw new InvalidOperationException("Auction not found");

            if (auction.WinningBidderId != userId)
                throw new InvalidOperationException("You are not the winner of this auction");

            if (auction.Status != AuctionStatus.Ended)
                throw new InvalidOperationException("Auction has not ended yet");

            // Check if payment already exists and clean up any duplicates
            var existingPayments = await _context.Payments
                .Where(p => p.AuctionId == auctionId && p.PayerId == userId)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();

            if (existingPayments.Count > 0)
            {
                // Use the first payment and remove any duplicates
                var paymentToKeep = existingPayments.First();
                if (existingPayments.Count > 1)
                {
                    var duplicatesToRemove = existingPayments.Skip(1).ToList();
                    _context.Payments.RemoveRange(duplicatesToRemove);
                    await _context.SaveChangesAsync();
                    _logger.LogWarning("Removed {Count} duplicate payments during initiation for auction {AuctionId} and user {UserId}", 
                        duplicatesToRemove.Count, auctionId, userId);
                }
                return await GetPaymentByIdAsync(paymentToKeep.Id) ?? throw new InvalidOperationException("Payment retrieval failed");
            }

            var winningBid = await _context.Bids
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.Amount)
                .FirstOrDefaultAsync();

            if (winningBid == null)
                throw new InvalidOperationException("No winning bid found");

            var payment = new Payment
            {
                AuctionId = auctionId,
                PayerId = userId,
                BidId = winningBid.Id,
                Amount = winningBid.Amount,
                ProcessingFee = winningBid.Amount * 0.03m,
                TotalAmount = winningBid.Amount * 1.03m,
                Method = PaymentType.CreditCard, // Default method
                Status = PaymentStatus.Pending,
                PaymentDeadline = DateTime.UtcNow.AddHours(48)
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return await GetPaymentByIdAsync(payment.Id) ?? throw new InvalidOperationException("Failed to retrieve created payment");
        }

        public async Task<PaymentDto> ProcessAuctionPaymentAsync(int userId, ProcessPaymentDto processPaymentDto)
        {
            var auction = await _context.Auctions
                .FirstOrDefaultAsync(a => a.Id == processPaymentDto.AuctionId);

            if (auction == null)
                throw new InvalidOperationException("Auction not found");

            if (auction.WinningBidderId != userId)
                throw new InvalidOperationException("You are not the winner of this auction");

            // Find existing payment (should already exist from auction initiation)
            var payments = await _context.Payments
                .Where(p => p.AuctionId == processPaymentDto.AuctionId && p.PayerId == userId)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();

            if (payments.Count == 0)
                throw new InvalidOperationException("No payment found for this auction. Payment must be initiated first.");

            // If there are duplicate payments (due to previous bug), use the first pending one or the first one created
            var payment = payments.FirstOrDefault(p => p.Status == PaymentStatus.Pending) ?? payments.First();
            
            // Clean up any duplicate payments (keep only the one we're processing)
            if (payments.Count > 1)
            {
                var duplicatesToRemove = payments.Where(p => p.Id != payment.Id).ToList();
                _context.Payments.RemoveRange(duplicatesToRemove);
                _logger.LogWarning("Removed {Count} duplicate payments for auction {AuctionId} and user {UserId}", 
                    duplicatesToRemove.Count, processPaymentDto.AuctionId, userId);
            }

            // Validate card details for credit/debit cards
            if ((processPaymentDto.PaymentMethod == PaymentType.CreditCard || 
                 processPaymentDto.PaymentMethod == PaymentType.DebitCard) &&
                processPaymentDto.CardDetails != null)
            {
                if (!IsValidCard(processPaymentDto.CardDetails.CardNumber))
                    throw new InvalidOperationException("Invalid card number");
            }

            // Process the payment (mock processing)
            payment.Method = processPaymentDto.PaymentMethod;
            payment.Status = PaymentStatus.Processing;
            payment.TransactionId = GenerateTransactionId();
            payment.PaymentGatewayResponse = "Mock Payment Gateway - Approved";
            
            await _context.SaveChangesAsync();

            // Simulate processing delay and then complete
            await Task.Delay(1000);

            payment.Status = PaymentStatus.Completed;
            payment.ProcessedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Send payment success notification
            await _notificationService.CreatePaymentSuccessNotificationAsync(
                userId,
                auction.Title,
                payment.TotalAmount
            );

            // Send payment success email
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                await _emailService.SendPaymentSuccessEmailAsync(
                    user.Email,
                    user.Username,
                    auction.Title,
                    payment.TotalAmount,
                    payment.TransactionId ?? "N/A"
                );
            }

            _logger.LogInformation("Payment {PaymentId} processed successfully for auction {AuctionId}", 
                payment.Id, auction.Id);

            return await GetPaymentByIdAsync(payment.Id) ?? throw new InvalidOperationException("Failed to retrieve processed payment");
        }

        public async Task<bool> ProcessPaymentAsync(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return false;

            payment.Status = PaymentStatus.Completed;
            payment.ProcessedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PaymentDto?> UpdatePaymentStatusAsync(int id, UpdatePaymentDto updatePaymentDto)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return null;

            if (updatePaymentDto.Status.HasValue)
                payment.Status = updatePaymentDto.Status.Value;

            if (!string.IsNullOrEmpty(updatePaymentDto.TransactionId))
                payment.TransactionId = updatePaymentDto.TransactionId;

            if (!string.IsNullOrEmpty(updatePaymentDto.PaymentGatewayResponse))
                payment.PaymentGatewayResponse = updatePaymentDto.PaymentGatewayResponse;

            if (updatePaymentDto.ProcessedAt.HasValue)
                payment.ProcessedAt = updatePaymentDto.ProcessedAt;

            await _context.SaveChangesAsync();
            return await GetPaymentByIdAsync(id);
        }

        public async Task<IEnumerable<PaymentDto>> GetPendingPaymentsAsync()
        {
            var payments = await _context.Payments
                .Include(p => p.Payer)
                .Include(p => p.Auction)
                .Where(p => p.Status == PaymentStatus.Pending)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();

            return payments.Select(p =>
            {
                var dto = _mapper.Map<PaymentDto>(p);
                dto.AuctionTitle = p.Auction.Title;
                return dto;
            });
        }

        public async Task<decimal> GetTotalRevenueAsync(DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.Payments
                .Where(p => p.Status == PaymentStatus.Completed);

            if (fromDate.HasValue)
                query = query.Where(p => p.ProcessedAt >= fromDate);

            if (toDate.HasValue)
                query = query.Where(p => p.ProcessedAt <= toDate);

            return await query.SumAsync(p => p.ProcessingFee ?? 0);
        }

        private bool IsValidCard(string cardNumber)
        {
            var cleanNumber = cardNumber.Replace(" ", "").Replace("-", "");
            
            // Test cards that are always valid
            var testCards = new[] { 
                "4242424242424242", // Visa
                "5555555555554444", // Mastercard
                "378282246310005",  // American Express
                "6011111111111117"  // Discover
            };

            if (testCards.Contains(cleanNumber))
                return true;

            // Basic Luhn algorithm check
            return IsValidLuhn(cleanNumber);
        }

        private bool IsValidLuhn(string cardNumber)
        {
            if (string.IsNullOrEmpty(cardNumber) || !cardNumber.All(char.IsDigit))
                return false;

            int sum = 0;
            bool isEven = false;

            for (int i = cardNumber.Length - 1; i >= 0; i--)
            {
                int digit = int.Parse(cardNumber[i].ToString());

                if (isEven)
                {
                    digit *= 2;
                    if (digit > 9)
                        digit -= 9;
                }

                sum += digit;
                isEven = !isEven;
            }

            return sum % 10 == 0;
        }

        private string GenerateTransactionId()
        {
            return $"TXN{DateTime.UtcNow:yyyyMMddHHmmss}{Random.Shared.Next(1000, 9999)}";
        }
    }
}
