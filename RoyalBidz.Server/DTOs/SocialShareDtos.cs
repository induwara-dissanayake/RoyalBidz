using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.DTOs
{
    public class SocialShareDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? AuctionId { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string ShareType { get; set; } = string.Empty; // "auction" or "win"
        public string SharedUrl { get; set; } = string.Empty;
        public string? UserAgent { get; set; }
        public string? IpAddress { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Related data
        public UserDto? User { get; set; }
        public string? AuctionTitle { get; set; }
    }
    
    public class CreateSocialShareDto
    {
        [Required]
        [StringLength(50)]
        public string Platform { get; set; } = string.Empty; // whatsapp, facebook, twitter, instagram
        
        [Required]
        [StringLength(20)]
        public string ShareType { get; set; } = string.Empty; // auction, win
        
        [Required]
        [Url]
        public string SharedUrl { get; set; } = string.Empty;
        
        public int? AuctionId { get; set; }
        
        public string? UserAgent { get; set; }
        
        public string? IpAddress { get; set; }
    }
    
    public class SocialShareStatsDto
    {
        public string Platform { get; set; } = string.Empty;
        public int ShareCount { get; set; }
        public int AuctionShares { get; set; }
        public int WinShares { get; set; }
    }
}
