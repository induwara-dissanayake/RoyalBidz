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
    public class AuctionsController : ControllerBase
    {
        private readonly IAuctionService _auctionService;
        private readonly IBidService _bidService;
        private readonly ILogger<AuctionsController> _logger;

        public AuctionsController(IAuctionService auctionService, IBidService bidService, 
            ILogger<AuctionsController> logger)
        {
            _auctionService = auctionService;
            _bidService = bidService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedResultDto<AuctionDto>>> GetAuctions([FromQuery] AuctionSearchDto? searchDto = null)
        {
            try
            {
                // Provide default values if searchDto is null
                searchDto ??= new AuctionSearchDto();
                
                var result = await _auctionService.SearchAuctionsAsync(searchDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting auctions");
                return StatusCode(500, new { message = "An error occurred while retrieving auctions" });
            }
        }

        [HttpGet("active")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AuctionDto>>> GetActiveAuctions()
        {
            try
            {
                var auctions = await _auctionService.GetActiveAuctionsAsync();
                return Ok(auctions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active auctions");
                return StatusCode(500, new { message = "An error occurred while retrieving active auctions" });
            }
        }

        [HttpGet("ending-soon")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AuctionDto>>> GetEndingSoonAuctions([FromQuery] int hours = 24)
        {
            try
            {
                var auctions = await _auctionService.GetEndingSoonAuctionsAsync(hours);
                return Ok(auctions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting ending soon auctions");
                return StatusCode(500, new { message = "An error occurred while retrieving ending soon auctions" });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<AuctionDto>> GetAuction(int id)
        {
            try
            {
                var auction = await _auctionService.GetAuctionWithDetailsAsync(id);
                if (auction == null)
                {
                    return NotFound(new { message = "Auction not found" });
                }

                return Ok(auction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting auction {AuctionId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the auction" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<ActionResult<AuctionDto>> CreateAuction([FromBody] CreateAuctionDto createAuctionDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var auction = await _auctionService.CreateAuctionAsync(userId, createAuctionDto);
                return CreatedAtAction(nameof(GetAuction), new { id = auction.Id }, auction);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating auction");
                return StatusCode(500, new { message = "An error occurred while creating the auction" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<ActionResult<AuctionDto>> UpdateAuction(int id, [FromBody] UpdateAuctionDto updateAuctionDto)
        {
            try
            {
                var auction = await _auctionService.UpdateAuctionAsync(id, updateAuctionDto);
                if (auction == null)
                {
                    return NotFound(new { message = "Auction not found" });
                }

                return Ok(auction);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating auction {AuctionId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the auction" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<ActionResult> DeleteAuction(int id)
        {
            try
            {
                var result = await _auctionService.DeleteAuctionAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Auction not found" });
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting auction {AuctionId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the auction" });
            }
        }

        [HttpPost("{id}/start")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<ActionResult> StartAuction(int id)
        {
            try
            {
                var result = await _auctionService.StartAuctionAsync(id);
                if (!result)
                {
                    return BadRequest(new { message = "Cannot start auction" });
                }

                return Ok(new { message = "Auction started successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting auction {AuctionId}", id);
                return StatusCode(500, new { message = "An error occurred while starting the auction" });
            }
        }

        [HttpPost("{id}/end")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> EndAuction(int id)
        {
            try
            {
                var result = await _auctionService.EndAuctionAsync(id);
                if (!result)
                {
                    return BadRequest(new { message = "Cannot end auction" });
                }

                return Ok(new { message = "Auction ended successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ending auction {AuctionId}", id);
                return StatusCode(500, new { message = "An error occurred while ending the auction" });
            }
        }

        [HttpGet("my-auctions")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<ActionResult<IEnumerable<AuctionDto>>> GetMyAuctions()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var auctions = await _auctionService.GetAuctionsBySellerAsync(userId);
                return Ok(auctions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user auctions");
                return StatusCode(500, new { message = "An error occurred while retrieving your auctions" });
            }
        }

        [HttpGet("{id}/bids")]
        [AllowAnonymous]
        public async Task<ActionResult<BidHistoryDto>> GetAuctionBids(int id)
        {
            try
            {
                var bidHistory = await _bidService.GetBidHistoryAsync(id);
                return Ok(bidHistory);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting auction bids for {AuctionId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving auction bids" });
            }
        }
    }
}