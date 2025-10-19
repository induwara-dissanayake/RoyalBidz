using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public class Notification
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Type { get; set; } = string.Empty; // bid_outbid, auction_won, payment_success, auction_ending, new_auction
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(1000)]
        public string Message { get; set; } = string.Empty;
        
        public bool IsRead { get; set; } = false;
        
        public string? EntityType { get; set; } // auction, bid, payment
        
        public int? EntityId { get; set; }
        
        public decimal? Amount { get; set; }
        
        [StringLength(500)]
        public string? ActionUrl { get; set; } // URL for notification action
        
        [StringLength(100)]
        public string? ActionLabel { get; set; } // Label for action button

    [StringLength(500)]
    public string? ActionCancelUrl { get; set; }

    [StringLength(100)]
    public string? ActionCancelLabel { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? ReadAt { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
}
