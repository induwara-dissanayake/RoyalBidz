using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Services.Interfaces;
using System.Security.Claims;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly IUserService _userService;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(IProfileService profileService, IUserService userService, ILogger<ProfileController> logger)
        {
            _profileService = profileService;
            _userService = userService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub") ?? User.FindFirst("id");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid token - no user ID found");
            }
            return userId;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<ProfileSummaryDto>> GetProfileSummary()
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _profileService.GetProfileSummaryAsync(userId);
                
                if (profile == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }

                return Ok(profile);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting profile summary");
                return StatusCode(500, new { message = "An error occurred while retrieving profile summary" });
            }
        }

        [HttpPut("update")]
        public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var updatedUser = await _userService.UpdateUserAsync(userId, updateUserDto);
                
                if (updatedUser == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }

                // Log the activity
                await _profileService.LogUserActivityAsync(userId, new LogActivityDto
                {
                    ActivityType = "PROFILE_UPDATE",
                    Description = "Profile information updated"
                });

                return Ok(updatedUser);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile");
                return StatusCode(500, new { message = "An error occurred while updating profile" });
            }
        }

        [HttpGet("preferences")]
        public async Task<ActionResult<UserPreferencesDto>> GetPreferences()
        {
            try
            {
                var userId = GetCurrentUserId();
                var preferences = await _profileService.GetUserPreferencesAsync(userId);
                
                return Ok(preferences);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user preferences");
                return StatusCode(500, new { message = "An error occurred while retrieving preferences" });
            }
        }

        [HttpPut("preferences")]
        public async Task<ActionResult<UserPreferencesDto>> UpdatePreferences([FromBody] UpdateUserPreferencesDto updatePreferencesDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var preferences = await _profileService.UpdateUserPreferencesAsync(userId, updatePreferencesDto);
                
                return Ok(preferences);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user preferences");
                return StatusCode(500, new { message = "An error occurred while updating preferences" });
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult<ProfileStatsDto>> GetProfileStats()
        {
            try
            {
                var userId = GetCurrentUserId();
                var stats = await _profileService.GetProfileStatsAsync(userId);
                
                return Ok(stats);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting profile stats");
                return StatusCode(500, new { message = "An error occurred while retrieving profile statistics" });
            }
        }

        [HttpGet("activities")]
        public async Task<ActionResult<IEnumerable<UserActivityDto>>> GetActivityHistory(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] string? activityType = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                var activities = await _profileService.GetUserActivitiesAsync(userId, page, pageSize, activityType);
                
                return Ok(activities);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user activities");
                return StatusCode(500, new { message = "An error occurred while retrieving activities" });
            }
        }

        [HttpPost("activity")]
        public async Task<ActionResult> LogActivity([FromBody] LogActivityDto logActivityDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _profileService.LogUserActivityAsync(userId, logActivityDto);
                
                return Ok(new { message = "Activity logged successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging user activity");
                return StatusCode(500, new { message = "An error occurred while logging activity" });
            }
        }

        [HttpPost("upload-avatar")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult> UploadProfileImage(IFormFile file)
        {
            try
            {
                var userId = GetCurrentUserId();
                
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded" });
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { message = "Invalid file type. Only JPG, PNG, and GIF files are allowed." });
                }

                // Validate file size (5MB max)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File size must be less than 5MB" });
                }

                var imageUrl = await _profileService.UploadProfileImageAsync(userId, file);
                
                return Ok(new { imageUrl });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading profile image");
                return StatusCode(500, new { message = "An error occurred while uploading image" });
            }
        }

        [HttpDelete("delete-account")]
        public async Task<ActionResult> DeleteAccount([FromBody] ConfirmAccountDeletionDto confirmDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.DeleteAccountAsync(userId, confirmDto.Password);
                
                if (!result)
                {
                    return BadRequest(new { message = "Invalid password or account cannot be deleted" });
                }

                return Ok(new { message = "Account deleted successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting account");
                return StatusCode(500, new { message = "An error occurred while deleting account" });
            }
        }

        [HttpGet("wishlist")]
        public async Task<ActionResult<IEnumerable<WishlistDto>>> GetWishlist()
        {
            try
            {
                var userId = GetCurrentUserId();
                var wishlist = await _profileService.GetUserWishlistAsync(userId);
                
                return Ok(wishlist);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user wishlist");
                return StatusCode(500, new { message = "An error occurred while retrieving wishlist" });
            }
        }

        [HttpPost("wishlist/{jewelryItemId}")]
        public async Task<ActionResult<WishlistDto>> AddToWishlist(int jewelryItemId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var wishlistItem = await _profileService.AddToWishlistAsync(userId, jewelryItemId);
                
                return Ok(wishlistItem);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to wishlist");
                return StatusCode(500, new { message = "An error occurred while adding to wishlist" });
            }
        }

        [HttpDelete("wishlist/{jewelryItemId}")]
        public async Task<ActionResult> RemoveFromWishlist(int jewelryItemId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.RemoveFromWishlistAsync(userId, jewelryItemId);
                
                if (!result)
                {
                    return NotFound(new { message = "Item not found in wishlist" });
                }

                return Ok(new { message = "Item removed from wishlist" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing item from wishlist");
                return StatusCode(500, new { message = "An error occurred while removing from wishlist" });
            }
        }

        [HttpGet("wishlist/{jewelryItemId}/check")]
        public async Task<ActionResult<bool>> IsInWishlist(int jewelryItemId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var isInWishlist = await _profileService.IsInWishlistAsync(userId, jewelryItemId);
                
                return Ok(new { isInWishlist });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking wishlist status");
                return StatusCode(500, new { message = "An error occurred while checking wishlist" });
            }
        }

        // Alias routes for "watchlist" to keep backwards compatibility with frontend calls
        [HttpGet("watchlist")]
        public async Task<ActionResult<IEnumerable<WishlistDto>>> GetWatchlist()
        {
            return await GetWishlist();
        }

        [HttpPost("watchlist/{jewelryItemId}")]
        public async Task<ActionResult<WishlistDto>> AddToWatchlist(int jewelryItemId)
        {
            return await AddToWishlist(jewelryItemId);
        }

        [HttpDelete("watchlist/{jewelryItemId}")]
        public async Task<ActionResult> RemoveFromWatchlist(int jewelryItemId)
        {
            return await RemoveFromWishlist(jewelryItemId);
        }

        [HttpGet("watchlist/{jewelryItemId}/check")]
        public async Task<ActionResult<bool>> IsInWatchlist(int jewelryItemId)
        {
            return await IsInWishlist(jewelryItemId);
        }

        [HttpGet("payment-methods")]
        public async Task<ActionResult<IEnumerable<PaymentMethodDto>>> GetPaymentMethods()
        {
            try
            {
                var userId = GetCurrentUserId();
                var paymentMethods = await _profileService.GetUserPaymentMethodsAsync(userId);
                
                return Ok(paymentMethods);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment methods");
                return StatusCode(500, new { message = "An error occurred while retrieving payment methods" });
            }
        }

        [HttpPost("payment-methods")]
        public async Task<ActionResult<PaymentMethodDto>> AddPaymentMethod([FromBody] CreatePaymentMethodDto createPaymentMethodDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var paymentMethod = await _profileService.AddPaymentMethodAsync(userId, createPaymentMethodDto);
                
                return Ok(paymentMethod);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding payment method");
                return StatusCode(500, new { message = "An error occurred while adding payment method" });
            }
        }

        [HttpPut("payment-methods/{paymentMethodId}")]
        public async Task<ActionResult<PaymentMethodDto>> UpdatePaymentMethod(int paymentMethodId, [FromBody] UpdatePaymentMethodDto updatePaymentMethodDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var paymentMethod = await _profileService.UpdatePaymentMethodAsync(userId, paymentMethodId, updatePaymentMethodDto);
                
                if (paymentMethod == null)
                {
                    return NotFound(new { message = "Payment method not found" });
                }

                return Ok(paymentMethod);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment method");
                return StatusCode(500, new { message = "An error occurred while updating payment method" });
            }
        }

        [HttpDelete("payment-methods/{paymentMethodId}")]
        public async Task<ActionResult> DeletePaymentMethod(int paymentMethodId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.DeletePaymentMethodAsync(userId, paymentMethodId);
                
                if (!result)
                {
                    return NotFound(new { message = "Payment method not found" });
                }

                return Ok(new { message = "Payment method deleted successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting payment method");
                return StatusCode(500, new { message = "An error occurred while deleting payment method" });
            }
        }

        [HttpPut("payment-methods/{paymentMethodId}/set-default")]
        public async Task<ActionResult> SetDefaultPaymentMethod(int paymentMethodId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.SetDefaultPaymentMethodAsync(userId, paymentMethodId);
                
                if (!result)
                {
                    return NotFound(new { message = "Payment method not found" });
                }

                return Ok(new { message = "Default payment method updated successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting default payment method");
                return StatusCode(500, new { message = "An error occurred while setting default payment method" });
            }
        }
    }

    public class ConfirmAccountDeletionDto
    {
        public string Password { get; set; } = string.Empty;
    }
}
