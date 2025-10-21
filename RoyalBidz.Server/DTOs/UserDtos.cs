using RoyalBidz.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace RoyalBidz.Server.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public string? ProfileImageUrl { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Bio { get; set; }
        public UserRole Role { get; set; }
        public UserStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateUserDto
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;

        [Phone]
        public string? PhoneNumber { get; set; }

        public UserRole Role { get; set; } = UserRole.Buyer;
    }

    public class UpdateUserDto
    {
        [StringLength(100)]
        public string? Username { get; set; }
        
        [StringLength(50)]
        public string? FirstName { get; set; }
        
        [StringLength(50)]
        public string? LastName { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }
        
        [StringLength(500)]
        public string? Address { get; set; }
        
        [StringLength(100)]
        public string? City { get; set; }
        
        [StringLength(100)]
        public string? State { get; set; }
        
        [StringLength(20)]
        public string? ZipCode { get; set; }
        
        [StringLength(100)]
        public string? Country { get; set; }
        
        [StringLength(500)]
        public string? ProfileImageUrl { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        [StringLength(1000)]
        public string? Bio { get; set; }
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; } = string.Empty;
    }

    public class UserPreferencesDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool EmailNotifications { get; set; }
        public bool SmsNotifications { get; set; }
        public bool PushNotifications { get; set; }
        public bool BidNotifications { get; set; }
        public bool AuctionEndNotifications { get; set; }
        public bool NewsletterSubscription { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public string Currency { get; set; } = "USD";
        public string Language { get; set; } = "en";
        public string Timezone { get; set; } = "UTC";
        public PrivacyLevel PrivacyLevel { get; set; }
    }

    public class UpdateUserPreferencesDto
    {
        public bool? EmailNotifications { get; set; }
        public bool? SmsNotifications { get; set; }
        public bool? PushNotifications { get; set; }
        public bool? BidNotifications { get; set; }
        public bool? AuctionEndNotifications { get; set; }
        public bool? NewsletterSubscription { get; set; }
        public bool? TwoFactorEnabled { get; set; }
        
        [StringLength(10)]
        public string? Currency { get; set; }
        
        [StringLength(10)]
        public string? Language { get; set; }
        
        [StringLength(50)]
        public string? Timezone { get; set; }
        
        public PrivacyLevel? PrivacyLevel { get; set; }
    }

    public class UserActivityDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public decimal? Amount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class LogActivityDto
    {
        public string ActivityType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public decimal? Amount { get; set; }
    }

    public class ProfileStatsDto
    {
        public int TotalBids { get; set; }
        public int WonAuctions { get; set; }
        public int ActiveBids { get; set; }
        public int CreatedAuctions { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal TotalEarned { get; set; }
        public int WishlistItems { get; set; }
        public DateTime? LastActivity { get; set; }
    }

    public class ProfileSummaryDto
    {
        public UserDto User { get; set; } = null!;
        public UserPreferencesDto? Preferences { get; set; }
        public ProfileStatsDto Stats { get; set; } = null!;
        public List<UserActivityDto> RecentActivities { get; set; } = new();
    }

    public class WishlistDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int JewelryItemId { get; set; }
        public JewelryItemDto JewelryItem { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class PaymentMethodDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public string? Last4 { get; set; }
        public string? ExpiryDate { get; set; }
        public string? Email { get; set; }
        public string? BankName { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreatePaymentMethodDto
    {
        public string? Type { get; set; } = "Credit Card";
        public string? Brand { get; set; }
        public string? Last4 { get; set; }
        public string? ExpiryDate { get; set; }
        public string? Email { get; set; }
        public string? BankName { get; set; }
        public string? AccountNumber { get; set; }
        public string? CardNumber { get; set; }
        public string? Cvv { get; set; }
        public string? CardholderName { get; set; }
        public bool IsDefault { get; set; } = false;
    }

    public class UpdatePaymentMethodDto
    {
        [StringLength(100)]
        public string? Brand { get; set; }
        
        [StringLength(7)]
        public string? ExpiryDate { get; set; }
        
        public bool? IsDefault { get; set; }
        
        public bool? IsActive { get; set; }
    }

    public class VerifyEmailDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(6, MinimumLength = 6)]
        public string VerificationCode { get; set; } = string.Empty;
    }

    public class ResendVerificationDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }

    public class EmailVerificationResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }
        public UserDto? User { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}