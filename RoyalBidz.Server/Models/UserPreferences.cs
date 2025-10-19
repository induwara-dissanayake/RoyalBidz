using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public enum PrivacyLevel
    {
        Public,
        Private,
        FriendsOnly
    }

    public class UserPreferences
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        public bool EmailNotifications { get; set; } = true;
        
        public bool SmsNotifications { get; set; } = false;
        
        public bool PushNotifications { get; set; } = true;
        
        public bool BidNotifications { get; set; } = true;
        
        public bool AuctionEndNotifications { get; set; } = true;
        
        public bool NewsletterSubscription { get; set; } = true;
        
        public bool TwoFactorEnabled { get; set; } = false;
        
        [StringLength(10)]
        public string Currency { get; set; } = "USD";
        
        [StringLength(10)]
        public string Language { get; set; } = "en";
        
        [StringLength(50)]
        public string Timezone { get; set; } = "UTC";
        
        public PrivacyLevel PrivacyLevel { get; set; } = PrivacyLevel.Public;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
}
