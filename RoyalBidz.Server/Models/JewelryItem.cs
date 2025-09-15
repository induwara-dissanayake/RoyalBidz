using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public enum JewelryType
    {
        Ring,
        Necklace,
        Earrings,
        Bracelet,
        Watch,
        Brooch,
        Pendant,
        Anklet,
        Other
    }

    public enum JewelryMaterial
    {
        Gold,
        Silver,
        Platinum,
        Diamond,
        Pearl,
        Ruby,
        Emerald,
        Sapphire,
        Other
    }

    public enum ItemCondition
    {
        New,
        Excellent,
        VeryGood,
        Good,
        Fair,
        Poor
    }

    public class JewelryItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        public JewelryType Type { get; set; }
        
        public JewelryMaterial PrimaryMaterial { get; set; }
        
        [StringLength(100)]
        public string? Brand { get; set; }
        
        [Range(0, 50)]
        public decimal? Weight { get; set; } // in grams
        
        [StringLength(50)]
        public string? Dimensions { get; set; }
        
        public ItemCondition Condition { get; set; }
        
        [Range(1800, 2030)]
        public int? YearMade { get; set; }
        
        [StringLength(100)]
        public string? Origin { get; set; }
        
        [StringLength(500)]
        public string? CertificationDetails { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal EstimatedValue { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<JewelryImage> Images { get; set; } = new List<JewelryImage>();
        public virtual ICollection<Auction> Auctions { get; set; } = new List<Auction>();
    }
}