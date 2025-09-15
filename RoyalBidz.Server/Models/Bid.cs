using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public enum BidStatus
    {
        Active,
        Outbid,
        Winning,
        Won,
        Lost
    }

    public class Bid
    {
        public int Id { get; set; }
        
        public int AuctionId { get; set; }
        
        public int BidderId { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }
        
        public BidStatus Status { get; set; } = BidStatus.Active;
        
        public DateTime BidTime { get; set; } = DateTime.UtcNow;
        
        public bool IsAutomaticBid { get; set; } = false;
        
        [Range(0, double.MaxValue)]
        public decimal? MaxAutoBidAmount { get; set; }
        
        // Navigation properties
        public virtual Auction Auction { get; set; } = null!;
        public virtual User Bidder { get; set; } = null!;
    }
}