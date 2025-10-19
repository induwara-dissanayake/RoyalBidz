using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.DTOs
{
    public class BidDto
    {
        public int Id { get; set; }
        public int AuctionId { get; set; }
        public int BidderId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime BidTime { get; set; }
        public bool IsAutomaticBid { get; set; }
        public decimal? MaxAutoBidAmount { get; set; }
        
        // Navigation properties
        public UserDto? Bidder { get; set; }
        // NOTE: intentionally omitting full Auction navigation to avoid circular serialization
        // Keep essential auction details for bid history
        public string AuctionTitle { get; set; } = string.Empty;
        public decimal AuctionCurrentBid { get; set; }
        public DateTime AuctionEndTime { get; set; }
        public string AuctionStatus { get; set; } = string.Empty;
        public int? AuctionWinningBidderId { get; set; }
    public int? AuctionLeadingBidderId { get; set; }
        
        // Jewelry item details for display
        public string JewelryItemName { get; set; } = string.Empty;
        public string JewelryItemImageUrl { get; set; } = string.Empty;
        public string JewelryItemType { get; set; } = string.Empty;
        public string JewelryItemMaterial { get; set; } = string.Empty;
        public string JewelryItemCondition { get; set; } = string.Empty;
    }

    public class CreateBidDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Auction ID is required")]
        public int AuctionId { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Bid amount must be greater than 0")]
        public decimal Amount { get; set; }
        
        public bool IsAutomaticBid { get; set; } = false;
        
        [Range(0.01, double.MaxValue)]
        public decimal? MaxAutoBidAmount { get; set; }
    }

    public class BidHistoryDto
    {
    // Represents an aggregated history entry (keeps compatibility with AuctionService)
    public int AuctionId { get; set; }
    public string AuctionTitle { get; set; } = string.Empty;
    public List<BidDto> Bids { get; set; } = new();
    public decimal HighestBid { get; set; }
    public int TotalBids { get; set; }
    }

    public class AuctionDetailDto : AuctionDto
    {
    // Expand to include fields expected elsewhere in the codebase
    public List<BidDto> BidHistory { get; set; } = new();
    public int? HighestBidderId { get; set; }
    public bool IsInWishlist { get; set; }
    public new int TotalBids { get; set; }
    public int ViewCount { get; set; }
    public new TimeSpan TimeRemaining => EndTime > DateTime.UtcNow ? EndTime - DateTime.UtcNow : TimeSpan.Zero;
    public new UserDto? Seller { get; set; }
    public new UserDto? WinningBidder { get; set; }
    public new UserDto? LeadingBidder { get; set; }
    }
}
