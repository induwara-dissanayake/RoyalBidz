using System.ComponentModel.DataAnnotations;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.DTOs
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int AuctionId { get; set; }
        public int PayerId { get; set; }
        public decimal Amount { get; set; }
        public decimal? AuctioneerFee { get; set; }
        public decimal? ProcessingFee { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentType Method { get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public DateTime? PaymentDeadline { get; set; }
        public int? BidId { get; set; }

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
        public PaymentType Method { get; set; }

        public string? TransactionId { get; set; }
    }

    public class UpdatePaymentDto
    {
        public PaymentStatus? Status { get; set; }
        public string? TransactionId { get; set; }
        public string? PaymentGatewayResponse { get; set; }
        public DateTime? ProcessedAt { get; set; }
    }

    public class ProcessPaymentDto
    {
        [Required]
        public int AuctionId { get; set; }

        [Required]
        public PaymentType PaymentMethod { get; set; }

        public CardDetailsDto? CardDetails { get; set; }

        public BillingAddressDto? BillingAddress { get; set; }
    }

    public class CardDetailsDto
    {
        [Required]
        [StringLength(19)]
        public string CardNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(2)]
        public string ExpiryMonth { get; set; } = string.Empty;

        [Required]
        [StringLength(4)]
        public string ExpiryYear { get; set; } = string.Empty;

        [Required]
        [StringLength(4)]
        public string CVV { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string CardHolderName { get; set; } = string.Empty;
    }

    public class BillingAddressDto
    {
        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string State { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string ZipCode { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Country { get; set; } = string.Empty;
    }
}
