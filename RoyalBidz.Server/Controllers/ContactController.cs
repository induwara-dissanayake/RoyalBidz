using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;
        private readonly ILogger<ContactController> _logger;

        public ContactController(IContactService contactService, ILogger<ContactController> logger)
        {
            _contactService = contactService;
            _logger = logger;
        }

        /// <summary>
        /// Submit a new contact inquiry (public endpoint)
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ContactInquiryResponseDto>> CreateInquiry([FromBody] CreateContactInquiryDto createContactInquiryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _contactService.CreateInquiryAsync(createContactInquiryDto);
                return CreatedAtAction(nameof(GetInquiry), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating contact inquiry");
                return StatusCode(500, new { message = "An error occurred while submitting your inquiry" });
            }
        }

        /// <summary>
        /// Get inquiry by ID (Admin only)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ContactInquiryDto>> GetInquiry(int id)
        {
            try
            {
                var inquiry = await _contactService.GetInquiryByIdAsync(id);
                if (inquiry == null)
                {
                    return NotFound(new { message = "Inquiry not found" });
                }

                return Ok(inquiry);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving inquiry {InquiryId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the inquiry" });
            }
        }

        /// <summary>
        /// Get all inquiries (Admin only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ContactInquiryDto>>> GetAllInquiries()
        {
            try
            {
                var inquiries = await _contactService.GetAllInquiriesAsync();
                return Ok(inquiries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all inquiries");
                return StatusCode(500, new { message = "An error occurred while retrieving inquiries" });
            }
        }

        /// <summary>
        /// Get inquiries by status (Admin only)
        /// </summary>
        [HttpGet("status/{status}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ContactInquiryDto>>> GetInquiriesByStatus(ContactInquiryStatus status)
        {
            try
            {
                var inquiries = await _contactService.GetInquiriesByStatusAsync(status);
                return Ok(inquiries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving inquiries by status {Status}", status);
                return StatusCode(500, new { message = "An error occurred while retrieving inquiries" });
            }
        }

        /// <summary>
        /// Get inquiries by priority (Admin only)
        /// </summary>
        [HttpGet("priority/{priority}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ContactInquiryDto>>> GetInquiriesByPriority(ContactInquiryPriority priority)
        {
            try
            {
                var inquiries = await _contactService.GetInquiriesByPriorityAsync(priority);
                return Ok(inquiries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving inquiries by priority {Priority}", priority);
                return StatusCode(500, new { message = "An error occurred while retrieving inquiries" });
            }
        }

        /// <summary>
        /// Get pending inquiries (Admin only)
        /// </summary>
        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ContactInquiryDto>>> GetPendingInquiries()
        {
            try
            {
                var inquiries = await _contactService.GetPendingInquiriesAsync();
                return Ok(inquiries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving pending inquiries");
                return StatusCode(500, new { message = "An error occurred while retrieving pending inquiries" });
            }
        }

        /// <summary>
        /// Get recent inquiries (Admin only)
        /// </summary>
        [HttpGet("recent")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ContactInquiryDto>>> GetRecentInquiries([FromQuery] int days = 30)
        {
            try
            {
                var inquiries = await _contactService.GetRecentInquiriesAsync(days);
                return Ok(inquiries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent inquiries for {Days} days", days);
                return StatusCode(500, new { message = "An error occurred while retrieving recent inquiries" });
            }
        }

        /// <summary>
        /// Update inquiry (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ContactInquiryDto>> UpdateInquiry(int id, [FromBody] UpdateContactInquiryDto updateContactInquiryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedInquiry = await _contactService.UpdateInquiryAsync(id, updateContactInquiryDto);
                if (updatedInquiry == null)
                {
                    return NotFound(new { message = "Inquiry not found" });
                }

                return Ok(updatedInquiry);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating inquiry {InquiryId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the inquiry" });
            }
        }

        /// <summary>
        /// Delete inquiry (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteInquiry(int id)
        {
            try
            {
                var result = await _contactService.DeleteInquiryAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Inquiry not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting inquiry {InquiryId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the inquiry" });
            }
        }

        /// <summary>
        /// Assign inquiry to a user (Admin only)
        /// </summary>
        [HttpPost("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AssignInquiry(int id, [FromBody] AssignInquiryDto assignInquiryDto)
        {
            try
            {
                var result = await _contactService.AssignInquiryAsync(id, assignInquiryDto.UserId);
                if (!result)
                {
                    return NotFound(new { message = "Inquiry not found" });
                }

                return Ok(new { message = "Inquiry assigned successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning inquiry {InquiryId} to user {UserId}", id, assignInquiryDto.UserId);
                return StatusCode(500, new { message = "An error occurred while assigning the inquiry" });
            }
        }

        /// <summary>
        /// Get inquiry statistics (Admin only)
        /// </summary>
        [HttpGet("stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ContactInquiryStatsDto>> GetInquiryStats()
        {
            try
            {
                var stats = await _contactService.GetInquiryStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving inquiry statistics");
                return StatusCode(500, new { message = "An error occurred while retrieving statistics" });
            }
        }
    }

    // Helper DTO for assignment
    public class AssignInquiryDto
    {
        public int UserId { get; set; }
    }
}
