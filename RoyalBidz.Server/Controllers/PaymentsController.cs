using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Services.Interfaces;
using System.Security.Claims;

namespace RoyalBidz.Server.Controllers
{
    // API controller & define  route & authorization
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        //retrieve specific payment by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDto>> GetPayment(int id)
        {
            try
            {
                var payment = await _paymentService.GetPaymentByIdAsync(id);
                if (payment == null)
                {
                    return NotFound(new { message = "Payment not found" });
                }

                return Ok(payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment {PaymentId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the payment" });
            }
        }
        
//retrieve all payments made by the authenticated users(currently logged user)
        [HttpGet("my-payments")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetMyPayments()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var payments = await _paymentService.GetPaymentsByUserAsync(userId);
                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user payments");
                return StatusCode(500, new { message = "An error occurred while retrieving your payments" });
            }
        }

//retrieve payment details for a specific auction
        [HttpGet("auction/{auctionId}")]
        public async Task<ActionResult<PaymentDto>> GetPaymentByAuction(int auctionId)
        {
            try
            {
                var payment = await _paymentService.GetPaymentByAuctionAsync(auctionId);
                if (payment == null)
                {
                    return NotFound(new { message = "Payment not found for this auction" });
                }

                return Ok(payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment for auction {AuctionId}", auctionId);
                return StatusCode(500, new { message = "An error occurred while retrieving the payment" });
            }
        }

//create new payment reco
        [HttpPost]
        public async Task<ActionResult<PaymentDto>> CreatePayment([FromBody] CreatePaymentDto createPaymentDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var payment = await _paymentService.CreatePaymentAsync(userId, createPaymentDto);
                return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment");
                return StatusCode(500, new { message = "An error occurred while creating the payment" });
            }
        }

//init a payment process for a specific auction
        [HttpPost("auction/{auctionId}")]
        public async Task<ActionResult<PaymentDto>> InitiateAuctionPayment(int auctionId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var payment = await _paymentService.InitiateAuctionPaymentAsync(userId, auctionId);
                return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initiating auction payment");
                return StatusCode(500, new { message = "An error occurred while initiating the payment" });
            }
        }

//specific payment by using ID
        [HttpPost("{id}/process")]
        public async Task<ActionResult> ProcessPayment(int id)
        {
            try
            {
                var result = await _paymentService.ProcessPaymentAsync(id);
                if (result)
                {
                    return Ok(new { message = "Payment processed successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Payment processing failed" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment {PaymentId}", id);
                return StatusCode(500, new { message = "An error occurred while processing the payment" });
            }
        }


//process auction payment using provided details
        [HttpPost("process")]
        public async Task<ActionResult<PaymentDto>> ProcessAuctionPayment([FromBody] ProcessPaymentDto processPaymentDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var payment = await _paymentService.ProcessAuctionPaymentAsync(userId, processPaymentDto);
                return Ok(payment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing auction payment");
                return StatusCode(500, new { message = "An error occurred while processing the payment" });
            }
        }

//update payment status(admin only)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PaymentDto>> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentDto updatePaymentDto)
        {
            try
            {
                var payment = await _paymentService.UpdatePaymentStatusAsync(id, updatePaymentDto);
                if (payment == null)
                {
                    return NotFound(new { message = "Payment not found" });
                }

                return Ok(payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment status {PaymentId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the payment status" });
            }
        }

        //retieve all pending payments

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPendingPayments()
        {
            try
            {
                var payments = await _paymentService.GetPendingPaymentsAsync();
                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pending payments");
                return StatusCode(500, new { message = "An error occurred while retrieving pending payments" });
            }
        }

        // calculate & retrieve all total revenue
        
        [HttpGet("revenue")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<decimal>> GetTotalRevenue([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            try
            {
                var revenue = await _paymentService.GetTotalRevenueAsync(fromDate, toDate);
                return Ok(new { totalRevenue = revenue });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total revenue");
                return StatusCode(500, new { message = "An error occurred while retrieving revenue data" });
            }
        }
    }
}