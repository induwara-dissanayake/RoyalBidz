using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JewelryController : ControllerBase
    {
        private readonly IJewelryService _jewelryService;
        private readonly ILogger<JewelryController> _logger;

        public JewelryController(IJewelryService jewelryService, ILogger<JewelryController> logger)
        {
            _jewelryService = jewelryService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<JewelryItemDto>>> GetJewelryItems()
        {
            try
            {
                var items = await _jewelryService.GetAllJewelryItemsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting jewelry items");
                return StatusCode(500, new { message = "An error occurred while retrieving jewelry items" });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<JewelryItemDto>> GetJewelryItem(int id)
        {
            try
            {
                var item = await _jewelryService.GetJewelryItemWithImagesAsync(id);
                if (item == null)
                {
                    return NotFound(new { message = "Jewelry item not found" });
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting jewelry item {ItemId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the jewelry item" });
            }
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<JewelryItemDto>>> SearchJewelryItems([FromQuery] string searchTerm)
        {
            try
            {
                var items = await _jewelryService.SearchJewelryItemsAsync(searchTerm);
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching jewelry items");
                return StatusCode(500, new { message = "An error occurred while searching jewelry items" });
            }
        }

        [HttpGet("type/{type}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<JewelryItemDto>>> GetJewelryByType(JewelryType type)
        {
            try
            {
                var items = await _jewelryService.GetJewelryByTypeAsync(type);
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting jewelry items by type {Type}", type);
                return StatusCode(500, new { message = "An error occurred while retrieving jewelry items by type" });
            }
        }

        [HttpGet("material/{material}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<JewelryItemDto>>> GetJewelryByMaterial(JewelryMaterial material)
        {
            try
            {
                var items = await _jewelryService.GetJewelryByMaterialAsync(material);
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting jewelry items by material {Material}", material);
                return StatusCode(500, new { message = "An error occurred while retrieving jewelry items by material" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<ActionResult<JewelryItemDto>> CreateJewelryItem([FromBody] CreateJewelryItemDto createJewelryItemDto)
        {
            try
            {
                var item = await _jewelryService.CreateJewelryItemAsync(createJewelryItemDto);
                return CreatedAtAction(nameof(GetJewelryItem), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating jewelry item");
                return StatusCode(500, new { message = "An error occurred while creating the jewelry item" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<ActionResult<JewelryItemDto>> UpdateJewelryItem(int id, [FromBody] UpdateJewelryItemDto updateJewelryItemDto)
        {
            try
            {
                var item = await _jewelryService.UpdateJewelryItemAsync(id, updateJewelryItemDto);
                if (item == null)
                {
                    return NotFound(new { message = "Jewelry item not found" });
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating jewelry item {ItemId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the jewelry item" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<ActionResult> DeleteJewelryItem(int id)
        {
            try
            {
                var result = await _jewelryService.DeleteJewelryItemAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Jewelry item not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting jewelry item {ItemId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the jewelry item" });
            }
        }
    }
}