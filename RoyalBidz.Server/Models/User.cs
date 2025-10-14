using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public enum UserRole
    {
        Buyer,
        Seller,
        Admin
    }

    public enum UserStatus
    {
        Active,
        Suspended,
        Inactive
    }

    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Phone]
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        
        public UserRole Role { get; set; } = UserRole.Buyer;
        
        public UserStatus Status { get; set; } = UserStatus.Active;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastLogin { get; set; }
        
        // Navigation properties
        public virtual ICollection<Auction> CreatedAuctions { get; set; } = new List<Auction>();
        public virtual ICollection<Bid> Bids { get; set; } = new List<Bid>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}