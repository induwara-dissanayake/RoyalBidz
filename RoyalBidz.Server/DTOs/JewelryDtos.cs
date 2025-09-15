using RoyalBidz.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.DTOs
{
    public class JewelryItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public JewelryType Type { get; set; }
        public JewelryMaterial PrimaryMaterial { get; set; }
        public string? Brand { get; set; }
        public decimal? Weight { get; set; }
        public string? Dimensions { get; set; }
        public ItemCondition Condition { get; set; }
        public int? YearMade { get; set; }
        public string? Origin { get; set; }
        public string? CertificationDetails { get; set; }
        public decimal EstimatedValue { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<JewelryImageDto> Images { get; set; } = new();
    }

    public class CreateJewelryItemDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        [Required]
        public JewelryType Type { get; set; }

        [Required]
        public JewelryMaterial PrimaryMaterial { get; set; }

        [StringLength(100)]
        public string? Brand { get; set; }

        [Range(0, 50)]
        public decimal? Weight { get; set; }

        [StringLength(50)]
        public string? Dimensions { get; set; }

        [Required]
        public ItemCondition Condition { get; set; }

        [Range(1800, 2030)]
        public int? YearMade { get; set; }

        [StringLength(100)]
        public string? Origin { get; set; }

        [StringLength(500)]
        public string? CertificationDetails { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal EstimatedValue { get; set; }

        public List<CreateJewelryImageDto> Images { get; set; } = new();
    }

    public class UpdateJewelryItemDto
    {
        [StringLength(200)]
        public string? Name { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        public JewelryType? Type { get; set; }
        public JewelryMaterial? PrimaryMaterial { get; set; }

        [StringLength(100)]
        public string? Brand { get; set; }

        [Range(0, 50)]
        public decimal? Weight { get; set; }

        [StringLength(50)]
        public string? Dimensions { get; set; }

        public ItemCondition? Condition { get; set; }

        [Range(1800, 2030)]
        public int? YearMade { get; set; }

        [StringLength(100)]
        public string? Origin { get; set; }

        [StringLength(500)]
        public string? CertificationDetails { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? EstimatedValue { get; set; }
    }

    public class JewelryImageDto
    {
        public int Id { get; set; }
        public int JewelryItemId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? AltText { get; set; }
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateJewelryImageDto
    {
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(200)]
        public string? AltText { get; set; }

        public bool IsPrimary { get; set; } = false;
        public int DisplayOrder { get; set; } = 0;
    }
}