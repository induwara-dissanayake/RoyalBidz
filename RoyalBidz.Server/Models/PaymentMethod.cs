using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public class PaymentMethod
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // CreditCard, PayPal, BankTransfer
        
        [StringLength(100)]
        public string? Brand { get; set; } // Visa, MasterCard, etc.
        
        [StringLength(4)]
        public string? Last4 { get; set; }
        
        [StringLength(7)]
        public string? ExpiryDate { get; set; } // MM/YYYY
        
        [StringLength(255)]
        public string? Email { get; set; } // For PayPal
        
        [StringLength(255)]
        public string? BankName { get; set; }
        
        [StringLength(100)]
        public string? AccountNumber { get; set; }
        
        public bool IsDefault { get; set; } = false;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
}
