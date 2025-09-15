using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly INotificationService _notificationService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, INotificationService notificationService, 
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email {Email}", loginDto.Email);
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                var user = await _authService.RegisterAsync(createUserDto);
                
                // Send welcome email
                await _notificationService.SendWelcomeEmailAsync(user.Email, $"{user.FirstName} {user.LastName}");
                
                return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for email {Email}", createUserDto.Email);
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst("id")?.Value ?? "0");
                var result = await _authService.ChangePasswordAsync(userId, changePasswordDto);
                
                if (result)
                {
                    return Ok(new { message = "Password changed successfully" });
                }
                
                return NotFound(new { message = "User not found" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for user");
                return StatusCode(500, new { message = "An error occurred while changing password" });
            }
        }

        [HttpPost("validate-token")]
        public async Task<ActionResult> ValidateToken([FromBody] string token)
        {
            try
            {
                var isValid = await _authService.ValidateTokenAsync(token);
                return Ok(new { isValid });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return Ok(new { isValid = false });
            }
        }
    }
}