using System.ComponentModel.DataAnnotations;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.DTOs
{
    public class ContactInquiryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? MobileNumber { get; set; }
        public string Enquiry { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public int? AssignedToUserId { get; set; }
        public string? AssignedToUserName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateContactInquiryDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(20, ErrorMessage = "Mobile number cannot exceed 20 characters")]
        public string? MobileNumber { get; set; }
        
        [Required]
        [StringLength(2000, ErrorMessage = "Enquiry cannot exceed 2000 characters")]
        public string Enquiry { get; set; } = string.Empty;
    }

    public class UpdateContactInquiryDto
    {
        public ContactInquiryStatus? Status { get; set; }
        public ContactInquiryPriority? Priority { get; set; }
        public int? AssignedToUserId { get; set; }
        public string? Notes { get; set; }
    }

    public class ContactInquiryResponseDto
    {
        public int Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class ContactInquiryStatsDto
    {
        public int TotalInquiries { get; set; }
        public int PendingInquiries { get; set; }
        public int InProgressInquiries { get; set; }
        public int ResolvedInquiries { get; set; }
        public int HighPriorityInquiries { get; set; }
        public double AverageResponseTimeHours { get; set; }
    }
}
