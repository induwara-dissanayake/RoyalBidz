using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoyalBidz.Server.DTOs;
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
        private readonly ILogger<BidsController> _logger;

        public BidsController(IBidService bidService, ILogger<BidsController> logger)
        {
            _bidService = bidService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<BidDto>> PlaceBid([FromBody] CreateBidDto createBidDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var bid = await _bidService.PlaceBidAsync(userId, createBidDto);
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