using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public enum PaymentStatus
    {
        Pending,
        Processing,
        Completed,
        Failed,
        Refunded,
        Cancelled
    }

    public enum PaymentType
    {
        CreditCard,
        DebitCard,
        PayPal,
        Stripe,
        BankTransfer,
        Other
    }

    public class Payment
    {
        public int Id { get; set; }
        
        public int AuctionId { get; set; }
        
        public int PayerId { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal? AuctioneerFee { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal? ProcessingFee { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }
        
        public PaymentType Method { get; set; }
        
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        
        [StringLength(100)]
        public string? TransactionId { get; set; }
        
        [StringLength(100)]
        public string? PaymentGatewayResponse { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? ProcessedAt { get; set; }
        
        public DateTime? PaymentDeadline { get; set; }
        
        public int? BidId { get; set; }
        
        // Navigation properties
        public virtual Auction Auction { get; set; } = null!;
        public virtual User Payer { get; set; } = null!;
        public virtual Bid? Bid { get; set; }
    }
}