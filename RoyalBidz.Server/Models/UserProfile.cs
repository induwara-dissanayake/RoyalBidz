using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public class UserProfile
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [StringLength(50)]
        public string? FirstName { get; set; }
        
        [StringLength(50)]
        public string? LastName { get; set; }
        
        [StringLength(500)]
        public string? Address { get; set; }
        
        [StringLength(100)]
        public string? City { get; set; }
        
        [StringLength(100)]
        public string? State { get; set; }
        
        [StringLength(20)]
        public string? ZipCode { get; set; }
        
        [StringLength(100)]
        public string? Country { get; set; }
        
        [StringLength(500)]
        public string? ProfileImageUrl { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        [StringLength(1000)]
        public string? Bio { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
}
