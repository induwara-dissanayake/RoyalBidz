using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public class SocialShare
    {
        public int Id { get; set; }
        
        public int? UserId { get; set; }
        
        public int? AuctionId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Platform { get; set; } = string.Empty; // whatsapp, facebook, twitter, instagram
        
        [Required]
        [StringLength(20)]
        public string ShareType { get; set; } = string.Empty; // auction, win
        
        [Required]
        [StringLength(500)]
        public string SharedUrl { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? UserAgent { get; set; }
        
        [StringLength(50)]
        public string? IpAddress { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User? User { get; set; }
        public Auction? Auction { get; set; }
    }
}
