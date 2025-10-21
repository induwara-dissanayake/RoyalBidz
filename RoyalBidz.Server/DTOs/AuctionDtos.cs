using RoyalBidz.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.DTOs
{
    public class AuctionDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int JewelryItemId { get; set; }
        public int SellerId { get; set; }
        public decimal StartingBid { get; set; }
        public decimal? ReservePrice { get; set; }
        public decimal BidIncrement { get; set; }
        public decimal? BuyNowPrice { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public AuctionStatus Status { get; set; }
        public decimal CurrentBid { get; set; }
        public int? WinningBidderId { get; set; }
        public int? LeadingBidderId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Related data
        public JewelryItemDto? JewelryItem { get; set; }
        public UserDto? Seller { get; set; }
        public UserDto? WinningBidder { get; set; }
        public UserDto? LeadingBidder { get; set; }
        public List<BidDto> Bids { get; set; } = new();
        public int TotalBids { get; set; }
        public TimeSpan? TimeRemaining { get; set; }
    }

    public class CreateAuctionDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public int JewelryItemId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal StartingBid { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? ReservePrice { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal BidIncrement { get; set; } = 1.00m;

        [Range(0, double.MaxValue)]
        public decimal? BuyNowPrice { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }

    public class UpdateAuctionDto
    {
        [StringLength(200)]
        public string? Title { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? StartingBid { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? ReservePrice { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? BidIncrement { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? BuyNowPrice { get; set; }

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public AuctionStatus? Status { get; set; }
    }

    public class AuctionSearchDto
    {
        public string? Search { get; set; }
        public JewelryType? Type { get; set; }
        public JewelryMaterial? Material { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public AuctionStatus? Status { get; set; }
        public string? SortBy { get; set; } = "EndTime";
        public bool SortDescending { get; set; } = false;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
}