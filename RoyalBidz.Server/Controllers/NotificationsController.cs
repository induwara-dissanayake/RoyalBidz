using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Security.Claims;
using RoyalBidz.Server.Data;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly RoyalBidzDbContext _context;
        private readonly IMapper _mapper;

        public NotificationsController(RoyalBidzDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid user ID in token");
            }
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<List<NotificationDto>>> GetNotifications(
            [FromQuery] bool unreadOnly = false,
            [FromQuery] int limit = 50,
            [FromQuery] int offset = 0)
        {
            try
            {
                var userId = GetCurrentUserId();

                var query = _context.Notifications
                    .Where(n => n.UserId == userId);

                if (unreadOnly)
                {
                    query = query.Where(n => !n.IsRead);
                }

                var notifications = await query
                    .OrderByDescending(n => n.CreatedAt)
                    .Skip(offset)
                    .Take(limit)
                    .ToListAsync();

                return Ok(_mapper.Map<List<NotificationDto>>(notifications));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching notifications", details = ex.Message });
            }
        }

        [HttpGet("summary")]
        public async Task<ActionResult<NotificationSummaryDto>> GetNotificationSummary()
        {
            try
            {
                var userId = GetCurrentUserId();

                var totalNotifications = await _context.Notifications
                    .CountAsync(n => n.UserId == userId);

                var unreadNotifications = await _context.Notifications
                    .CountAsync(n => n.UserId == userId && !n.IsRead);

                var recentNotifications = await _context.Notifications
                    .Where(n => n.UserId == userId)
                    .OrderByDescending(n => n.CreatedAt)
                    .Take(5)
                    .ToListAsync();

                var summary = new NotificationSummaryDto
                {
                    TotalNotifications = totalNotifications,
                    UnreadNotifications = unreadNotifications,
                    RecentNotifications = _mapper.Map<List<NotificationDto>>(recentNotifications)
                };

                return Ok(summary);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching notification summary", details = ex.Message });
            }
        }

        // Simple stats endpoint used by navbar to show unread count
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetNotificationStats()
        {
            try
            {
                var userId = GetCurrentUserId();

                var unreadNotifications = await _context.Notifications
                    .CountAsync(n => n.UserId == userId && !n.IsRead);

                return Ok(new { UnreadNotifications = unreadNotifications });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching notification stats", details = ex.Message });
            }
        }

        [HttpPost("{id}/mark-read")]
        public async Task<ActionResult> MarkAsRead(int id)
        {
            try
            {
                var userId = GetCurrentUserId();

                var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

                if (notification == null)
                {
                    return NotFound(new { message = "Notification not found" });
                }

                if (!notification.IsRead)
                {
                    notification.IsRead = true;
                    notification.ReadAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Notification marked as read" });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while marking notification as read", details = ex.Message });
            }
        }

        [HttpPost("mark-all-read")]
        public async Task<ActionResult> MarkAllAsRead()
        {
            try
            {
                var userId = GetCurrentUserId();

                var unreadNotifications = await _context.Notifications
                    .Where(n => n.UserId == userId && !n.IsRead)
                    .ToListAsync();

                foreach (var notification in unreadNotifications)
                {
                    notification.IsRead = true;
                    notification.ReadAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = $"Marked {unreadNotifications.Count} notifications as read" });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while marking all notifications as read", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNotification(int id)
        {
            try
            {
                var userId = GetCurrentUserId();

                var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

                if (notification == null)
                {
                    return NotFound(new { message = "Notification not found" });
                }

                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Notification deleted successfully" });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting notification", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<NotificationDto>> CreateNotification([FromBody] CreateNotificationDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();

                var notification = _mapper.Map<Notification>(dto);
                notification.UserId = userId;

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetNotifications),
                    new { id = notification.Id },
                    _mapper.Map<NotificationDto>(notification));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating notification", details = ex.Message });
            }
        }
    }
}
