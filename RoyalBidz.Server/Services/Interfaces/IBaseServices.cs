using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto> RegisterAsync(CreateUserDto createUserDto);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
        Task<string> GenerateJwtToken(UserDto user);
        Task<bool> ValidateTokenAsync(string token);
        Task<EmailVerificationResponseDto> VerifyEmailAsync(VerifyEmailDto verifyEmailDto);
        Task<bool> ResendVerificationCodeAsync(ResendVerificationDto resendVerificationDto);
        Task<bool> SendEmailVerificationCodeAsync(string email);
    }

    public interface IUserService
    {
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto?> GetUserByEmailAsync(string email);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<IEnumerable<UserDto>> GetUsersByRoleAsync(UserRole role);
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> UpdateUserStatusAsync(int id, UserStatus status);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<PaymentMethodDto> AddPaymentMethodAsync(int userId, CreatePaymentMethodDto createPaymentMethodDto);
        Task<IEnumerable<PaymentMethodDto>> GetPaymentMethodsAsync(int userId);
    }

    public interface IProfileService
    {
        Task<ProfileSummaryDto?> GetProfileSummaryAsync(int userId);
        Task<UserDto?> UpdateProfileAsync(int userId, UpdateUserDto updateUserDto);
        Task<UserPreferencesDto> GetUserPreferencesAsync(int userId);
        Task<UserPreferencesDto> UpdateUserPreferencesAsync(int userId, UpdateUserPreferencesDto updatePreferencesDto);
        Task<ProfileStatsDto> GetProfileStatsAsync(int userId);
        Task<IEnumerable<UserActivityDto>> GetUserActivitiesAsync(int userId, int page, int pageSize, string? activityType);
        Task LogUserActivityAsync(int userId, LogActivityDto logActivityDto);
        Task<string> UploadProfileImageAsync(int userId, IFormFile file);
        Task<bool> DeleteAccountAsync(int userId, string password);
        
        // Wishlist methods
        Task<IEnumerable<WishlistDto>> GetUserWishlistAsync(int userId);
        Task<WishlistDto> AddToWishlistAsync(int userId, int jewelryItemId);
        Task<bool> RemoveFromWishlistAsync(int userId, int jewelryItemId);
        Task<bool> IsInWishlistAsync(int userId, int jewelryItemId);
        
        // Payment methods
        Task<IEnumerable<PaymentMethodDto>> GetUserPaymentMethodsAsync(int userId);
        Task<PaymentMethodDto> AddPaymentMethodAsync(int userId, CreatePaymentMethodDto createPaymentMethodDto);
        Task<PaymentMethodDto?> UpdatePaymentMethodAsync(int userId, int paymentMethodId, UpdatePaymentMethodDto updatePaymentMethodDto);
        Task<bool> DeletePaymentMethodAsync(int userId, int paymentMethodId);
        Task<bool> SetDefaultPaymentMethodAsync(int userId, int paymentMethodId);
    }

    public interface IContactService
    {
        Task<ContactInquiryResponseDto> CreateInquiryAsync(CreateContactInquiryDto createContactInquiryDto);
        Task<ContactInquiryDto?> GetInquiryByIdAsync(int id);
        Task<IEnumerable<ContactInquiryDto>> GetAllInquiriesAsync();
        Task<IEnumerable<ContactInquiryDto>> GetInquiriesByStatusAsync(ContactInquiryStatus status);
        Task<IEnumerable<ContactInquiryDto>> GetInquiriesByPriorityAsync(ContactInquiryPriority priority);
        Task<IEnumerable<ContactInquiryDto>> GetPendingInquiriesAsync();
        Task<IEnumerable<ContactInquiryDto>> GetRecentInquiriesAsync(int days = 30);
        Task<ContactInquiryDto?> UpdateInquiryAsync(int id, UpdateContactInquiryDto updateContactInquiryDto);
        Task<bool> DeleteInquiryAsync(int id);
        Task<bool> AssignInquiryAsync(int id, int userId);
        Task<ContactInquiryStatsDto> GetInquiryStatsAsync();
    }
}