using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Services.Interfaces;
using System.Security.Claims;

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

        

        

        
    }
}