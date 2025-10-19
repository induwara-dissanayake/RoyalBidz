using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public enum AuctionStatus
    {
        Draft,
        Scheduled,
        Active,
        Ended,
        Cancelled,
        Completed
    }

    public class Auction
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        public int JewelryItemId { get; set; }
        
        public int SellerId { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal StartingBid { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal? ReservePrice { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal BidIncrement { get; set; } = 1.00m;
        
        [Range(0, double.MaxValue)]
        public decimal? BuyNowPrice { get; set; }
        
        public DateTime StartTime { get; set; }
        
        public DateTime EndTime { get; set; }
        
        public AuctionStatus Status { get; set; } = AuctionStatus.Draft;
        
        public decimal CurrentBid { get; set; } = 0;
        
    public int? WinningBidderId { get; set; }
    // Current leading bidder while auction is live (not final winner until auction ends)
    public int? LeadingBidderId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual JewelryItem JewelryItem { get; set; } = null!;
        public virtual User Seller { get; set; } = null!;
    public virtual User? WinningBidder { get; set; }
    public virtual User? LeadingBidder { get; set; }
        public virtual ICollection<Bid> Bids { get; set; } = new List<Bid>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}