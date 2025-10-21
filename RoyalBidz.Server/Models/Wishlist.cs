using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public class Wishlist
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        public int JewelryItemId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual JewelryItem JewelryItem { get; set; } = null!;
    }
}
