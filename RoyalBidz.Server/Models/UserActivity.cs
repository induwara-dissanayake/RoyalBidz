using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public class UserActivity
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ActivityType { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string? EntityType { get; set; }
        
        public int? EntityId { get; set; }
        
        public decimal? Amount { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
}
