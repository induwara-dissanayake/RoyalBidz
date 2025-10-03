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
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub") ?? User.FindFirst("id");
                if (userIdClaim == null)
                {
                    return BadRequest(new { message = "Invalid token - no user ID found" });
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest(new { message = "Invalid user ID in token" });
                }

                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return StatusCode(500, new { message = "An error occurred while retrieving user information" });
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(500, new { message = "An error occurred while retrieving users" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user {UserId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the user" });
            }
        }

        [HttpGet("by-role/{role}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersByRole(UserRole role)
        {
            try
            {
                var users = await _userService.GetUsersByRoleAsync(role);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users by role {Role}", role);
                return StatusCode(500, new { message = "An error occurred while retrieving users by role" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                var user = await _userService.CreateUserAsync(createUserDto);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, new { message = "An error occurred while creating the user" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _userService.UpdateUserAsync(id, updateUserDto);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the user" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                var result = await _userService.DeleteUserAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "User not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the user" });
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateUserStatus(int id, [FromBody] UserStatus status)
        {
            try
            {
                var result = await _userService.UpdateUserStatusAsync(id, status);
                if (!result)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new { message = "User status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user status {UserId}", id);
                return StatusCode(500, new { message = "An error occurred while updating user status" });
            }
        }
    }
}