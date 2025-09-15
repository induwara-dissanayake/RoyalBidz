using RoyalBidz.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.DTOs
{
    public class BidDto
    {
        public int Id { get; set; }
        public int AuctionId { get; set; }
        public int BidderId { get; set; }
        public decimal Amount { get; set; }
        public BidStatus Status { get; set; }
        public DateTime BidTime { get; set; }
        public bool IsAutomaticBid { get; set; }
        public decimal? MaxAutoBidAmount { get; set; }

        // Related data
        public UserDto? Bidder { get; set; }
        public string AuctionTitle { get; set; } = string.Empty;
    }

    public class CreateBidDto
    {
        [Required]
        public int AuctionId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }

        public bool IsAutomaticBid { get; set; } = false;

        [Range(0, double.MaxValue)]
        public decimal? MaxAutoBidAmount { get; set; }
    }

    public class BidHistoryDto
    {
        public int AuctionId { get; set; }
        public string AuctionTitle { get; set; } = string.Empty;
        public List<BidDto> Bids { get; set; } = new();
        public decimal HighestBid { get; set; }
        public int TotalBids { get; set; }
    }

    public class PaymentDto
    {
        public int Id { get; set; }
        public int AuctionId { get; set; }
        public int PayerId { get; set; }
        public decimal Amount { get; set; }
        public decimal? AuctioneerFee { get; set; }
        public decimal? ProcessingFee { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }

        // Related data
        public UserDto? Payer { get; set; }
        public string AuctionTitle { get; set; } = string.Empty;
    }

    public class CreatePaymentDto
    {
        [Required]
        public int AuctionId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public PaymentMethod Method { get; set; }

        public string? TransactionId { get; set; }
    }

    public class UpdatePaymentDto
    {
        public PaymentStatus? Status { get; set; }
        public string? TransactionId { get; set; }
        public string? PaymentGatewayResponse { get; set; }
        public DateTime? ProcessedAt { get; set; }
    }
}