using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.Models
{
    public enum ContactInquiryStatus
    {
        Pending,
        InProgress,
        Resolved,
        Closed
    }

    public enum ContactInquiryPriority
    {
        Low,
        Medium,
        High,
        Urgent
    }

    public class ContactInquiry
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? MobileNumber { get; set; }
        
        [Required]
        public string Enquiry { get; set; } = string.Empty;
        
        public ContactInquiryStatus Status { get; set; } = ContactInquiryStatus.Pending;
        
        public ContactInquiryPriority Priority { get; set; } = ContactInquiryPriority.Medium;
        
        public int? AssignedToUserId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        public DateTime? RespondedAt { get; set; }
        
        public string? Notes { get; set; }

        // Navigation properties
        public virtual User? AssignedToUser { get; set; }
    }
}
