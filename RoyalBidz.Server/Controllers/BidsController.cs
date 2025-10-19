using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Hubs;
using RoyalBidz.Server.Services.Interfaces;
using System.Security.Claims;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BidsController : ControllerBase
    {
        private readonly IBidService _bidService;
        private readonly IHubContext<AuctionHub> _hubContext;
        private readonly IUserNotificationService _userNotificationService;
        private readonly IAuctionService _auctionService;
        private readonly ILogger<BidsController> _logger;

        public BidsController(IBidService bidService, IHubContext<AuctionHub> hubContext, 
            IUserNotificationService userNotificationService, IAuctionService auctionService,
            ILogger<BidsController> logger)
        {
            _bidService = bidService;
            _hubContext = hubContext;
            _userNotificationService = userNotificationService;
            _auctionService = auctionService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<BidDto>> PlaceBid([FromBody] CreateBidDto createBidDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var userName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Anonymous";

                var bid = await _bidService.PlaceBidAsync(userId, createBidDto);
                
                // Create notification for bid placement
                try
                {
                    var auction = await _auctionService.GetAuctionByIdAsync(createBidDto.AuctionId);
                    if (auction != null)
                    {
                        await _userNotificationService.CreateBidPlacedNotificationAsync(userId, auction.Title, bid.Amount);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to create bid placement notification for user {UserId}", userId);
                }
                
                // Notify all users in the auction group about the new bid. Do not let hub failures bubble
                // up and turn into 500 responses for the API caller (fire-and-log on failure).
                try
                {
                    await _hubContext.Clients.Group($"auction_{createBidDto.AuctionId}")
                        .SendAsync("BidUpdate", new
                        {
                            AuctionId = createBidDto.AuctionId,
                            Amount = bid.Amount,
                            BidderName = userName,
                            BidderId = userId,
                            Timestamp = DateTime.UtcNow,
                            IsAutomaticBid = bid.IsAutomaticBid
                        });
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to send SignalR BidUpdate notification for auction {AuctionId}", createBidDto.AuctionId);
                }

                return CreatedAtAction(nameof(GetBid), new { id = bid.Id }, bid);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error placing bid");
                return StatusCode(500, new { message = "An error occurred while placing the bid" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BidDto>> GetBid(int id)
        {
            try
            {
                var bid = await _bidService.GetBidByIdAsync(id);
                if (bid == null)
                {
                    return NotFound(new { message = "Bid not found" });
                }

                return Ok(bid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bid {BidId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the bid" });
            }
        }

        [HttpGet("my-bids")]
        public async Task<ActionResult<IEnumerable<BidDto>>> GetMyBids()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var bids = await _bidService.GetBidsByUserAsync(userId);
                return Ok(bids);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user bids");
                return StatusCode(500, new { message = "An error occurred while retrieving your bids" });
            }
        }

        [HttpGet("my-winning-bids")]
        public async Task<ActionResult<IEnumerable<BidDto>>> GetMyWinningBids()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var bids = await _bidService.GetWinningBidsAsync(userId);
                return Ok(bids);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user winning bids");
                return StatusCode(500, new { message = "An error occurred while retrieving your winning bids" });
            }
        }

        [HttpGet("auction/{auctionId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BidDto>>> GetAuctionBids(int auctionId)
        {
            try
            {
                var bids = await _bidService.GetBidsByAuctionAsync(auctionId);
                return Ok(bids);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting auction bids for {AuctionId}", auctionId);
                return StatusCode(500, new { message = "An error occurred while retrieving auction bids" });
            }
        }

        [HttpGet("auction/{auctionId}/highest")]
        [AllowAnonymous]
        public async Task<ActionResult<BidDto>> GetHighestBid(int auctionId)
        {
            try
            {
                var bid = await _bidService.GetHighestBidAsync(auctionId);
                if (bid == null)
                {
                    return NotFound(new { message = "No bids found for this auction" });
                }

                return Ok(bid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting highest bid for auction {AuctionId}", auctionId);
                return StatusCode(500, new { message = "An error occurred while retrieving the highest bid" });
            }
        }

        [HttpPost("validate")]
        public async Task<ActionResult<bool>> ValidateBid([FromBody] CreateBidDto createBidDto)
        {
            try
            {
                var isValid = await _bidService.ValidateBidAsync(createBidDto.AuctionId, createBidDto.Amount);
                return Ok(new { isValid });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating bid");
                return StatusCode(500, new { message = "An error occurred while validating the bid" });
            }
        }
    }
}