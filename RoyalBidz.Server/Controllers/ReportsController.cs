using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly ILogger<ReportsController> _logger;

        public ReportsController(IReportService reportService, ILogger<ReportsController> logger)
        {
            _reportService = reportService;
            _logger = logger;
        }

        [HttpGet("auction-report")]
        public async Task<ActionResult<object>> GetAuctionReport([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            try
            {
                var report = await _reportService.GetAuctionReportAsync(fromDate, toDate);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating auction report");
                return StatusCode(500, new { message = "An error occurred while generating the auction report" });
            }
        }

        [HttpGet("bidder-activity")]
        public async Task<ActionResult<object>> GetBidderActivityReport([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            try
            {
                var report = await _reportService.GetBidderActivityReportAsync(fromDate, toDate);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating bidder activity report");
                return StatusCode(500, new { message = "An error occurred while generating the bidder activity report" });
            }
        }

        [HttpGet("revenue-report")]
        public async Task<ActionResult<object>> GetRevenueReport([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            try
            {
                var report = await _reportService.GetRevenueReportAsync(fromDate, toDate);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating revenue report");
                return StatusCode(500, new { message = "An error occurred while generating the revenue report" });
            }
        }

        [HttpGet("popular-items")]
        public async Task<ActionResult<object>> GetPopularItemsReport([FromQuery] int topCount = 10)
        {
            try
            {
                var report = await _reportService.GetPopularItemsReportAsync(topCount);
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating popular items report");
                return StatusCode(500, new { message = "An error occurred while generating the popular items report" });
            }
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<object>> GetDashboardData()
        {
            try
            {
                var lastMonth = DateTime.UtcNow.AddDays(-30);
                var now = DateTime.UtcNow;

                var auctionReport = await _reportService.GetAuctionReportAsync(lastMonth, now);
                var bidderReport = await _reportService.GetBidderActivityReportAsync(lastMonth, now);
                var revenueReport = await _reportService.GetRevenueReportAsync(lastMonth, now);
                var popularItems = await _reportService.GetPopularItemsReportAsync(5);

                return Ok(new
                {
                    Period = new { From = lastMonth, To = now },
                    AuctionData = auctionReport,
                    BidderActivity = bidderReport,
                    Revenue = revenueReport,
                    PopularItems = popularItems,
                    GeneratedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating dashboard data");
                return StatusCode(500, new { message = "An error occurred while generating the dashboard data" });
            }
        }
    }
}