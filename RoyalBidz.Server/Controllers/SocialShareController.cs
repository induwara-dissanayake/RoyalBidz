using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Services.Interfaces;
using System.Security.Claims;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SocialShareController : ControllerBase
    {
        private readonly ISocialShareService _socialShareService;
        private readonly ILogger<SocialShareController> _logger;

        public SocialShareController(
            ISocialShareService socialShareService,
            ILogger<SocialShareController> logger)
        {
            _socialShareService = socialShareService;
            _logger = logger;
        }

        /// <summary>
        /// Record a social media share
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<SocialShareDto>> RecordShare([FromBody] CreateSocialShareDto createSocialShareDto)
        {
            try
            {
                // Get user ID if authenticated, otherwise null for anonymous shares
                int? userId = null;
                if (User.Identity?.IsAuthenticated == true)
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (userIdClaim != null && int.TryParse(userIdClaim, out int parsedUserId))
                    {
                        userId = parsedUserId;
                    }
                }

                // Add request context
                createSocialShareDto.UserAgent = Request.Headers["User-Agent"].FirstOrDefault();
                createSocialShareDto.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

                var share = await _socialShareService.RecordShareAsync(userId, createSocialShareDto);
                return Ok(share);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording social share");
                return StatusCode(500, new { message = "An error occurred while recording the share" });
            }
        }

        /// <summary>
        /// Get shares by current user
        /// </summary>
        [HttpGet("my-shares")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SocialShareDto>>> GetMyShares()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user" });
                }

                var shares = await _socialShareService.GetUserSharesAsync(userId);
                return Ok(shares);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user shares");
                return StatusCode(500, new { message = "An error occurred while retrieving shares" });
            }
        }

        /// <summary>
        /// Get shares for a specific auction
        /// </summary>
        [HttpGet("auction/{auctionId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<SocialShareDto>>> GetAuctionShares(int auctionId)
        {
            try
            {
                var shares = await _socialShareService.GetAuctionSharesAsync(auctionId);
                return Ok(shares);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting auction shares for auction {AuctionId}", auctionId);
                return StatusCode(500, new { message = "An error occurred while retrieving auction shares" });
            }
        }

        /// <summary>
        /// Get social share statistics (Admin only)
        /// </summary>
        [HttpGet("stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<SocialShareStatsDto>>> GetShareStats()
        {
            try
            {
                var stats = await _socialShareService.GetShareStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting social share stats");
                return StatusCode(500, new { message = "An error occurred while retrieving share statistics" });
            }
        }

        /// <summary>
        /// Get total shares count
        /// </summary>
        [HttpGet("count")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> GetTotalSharesCount()
        {
            try
            {
                var count = await _socialShareService.GetTotalSharesCountAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total shares count");
                return StatusCode(500, new { message = "An error occurred while retrieving shares count" });
            }
        }
    }
}
