using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public class JewelryImage
    {
        public int Id { get; set; }
        
        public int JewelryItemId { get; set; }
        
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? AltText { get; set; }
        
        public bool IsPrimary { get; set; } = false;
        
        public int DisplayOrder { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual JewelryItem JewelryItem { get; set; } = null!;
    }
}