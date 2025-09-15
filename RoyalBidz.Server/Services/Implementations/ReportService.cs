using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class ReportService : IReportService
    {
        private readonly IAuctionRepository _auctionRepository;
        private readonly IBidRepository _bidRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly ILogger<ReportService> _logger;

        public ReportService(IAuctionRepository auctionRepository, IBidRepository bidRepository,
            IPaymentRepository paymentRepository, ILogger<ReportService> logger)
        {
            _auctionRepository = auctionRepository;
            _bidRepository = bidRepository;
            _paymentRepository = paymentRepository;
            _logger = logger;
        }

        public async Task<object> GetAuctionReportAsync(DateTime fromDate, DateTime toDate)
        {
            var auctions = await _auctionRepository.FindAsync(a => 
                a.CreatedAt >= fromDate && a.CreatedAt <= toDate);

            return new
            {
                TotalAuctions = auctions.Count(),
                ActiveAuctions = auctions.Count(a => a.Status == Models.AuctionStatus.Active),
                CompletedAuctions = auctions.Count(a => a.Status == Models.AuctionStatus.Completed),
                CancelledAuctions = auctions.Count(a => a.Status == Models.AuctionStatus.Cancelled),
                TotalValue = auctions.Sum(a => a.CurrentBid),
                AverageValue = auctions.Any() ? auctions.Average(a => a.CurrentBid) : 0
            };
        }

        public async Task<object> GetBidderActivityReportAsync(DateTime fromDate, DateTime toDate)
        {
            var bids = await _bidRepository.FindAsync(b => 
                b.BidTime >= fromDate && b.BidTime <= toDate);

            return new
            {
                TotalBids = bids.Count(),
                UniqueBidders = bids.Select(b => b.BidderId).Distinct().Count(),
                AverageBidsPerAuction = bids.Any() ? bids.GroupBy(b => b.AuctionId).Average(g => g.Count()) : 0,
                TotalBidValue = bids.Sum(b => b.Amount)
            };
        }

        public async Task<object> GetRevenueReportAsync(DateTime fromDate, DateTime toDate)
        {
            var revenue = await _paymentRepository.GetTotalRevenueAsync(fromDate, toDate);
            var payments = await _paymentRepository.FindAsync(p => 
                p.CreatedAt >= fromDate && p.CreatedAt <= toDate);

            return new
            {
                TotalRevenue = revenue,
                TotalPayments = payments.Count(),
                CompletedPayments = payments.Count(p => p.Status == Models.PaymentStatus.Completed),
                PendingPayments = payments.Count(p => p.Status == Models.PaymentStatus.Pending),
                FailedPayments = payments.Count(p => p.Status == Models.PaymentStatus.Failed),
                AverageTransactionValue = payments.Any() ? payments.Average(p => p.Amount) : 0
            };
        }

        public async Task<object> GetPopularItemsReportAsync(int topCount = 10)
        {
            var auctions = await _auctionRepository.GetAllAsync();
            
            var popularItems = auctions
                .Where(a => a.Bids.Any())
                .OrderByDescending(a => a.Bids.Count)
                .ThenByDescending(a => a.CurrentBid)
                .Take(topCount)
                .Select(a => new
                {
                    AuctionId = a.Id,
                    ItemName = a.JewelryItem?.Name ?? a.Title,
                    BidCount = a.Bids.Count,
                    CurrentBid = a.CurrentBid,
                    Status = a.Status.ToString()
                });

            return new
            {
                PopularItems = popularItems,
                GeneratedAt = DateTime.UtcNow
            };
        }
    }
}