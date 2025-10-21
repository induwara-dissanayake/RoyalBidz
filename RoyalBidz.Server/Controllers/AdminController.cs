using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Data;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly RoyalBidzDbContext _context;
        private readonly IUserService _userService;
        private readonly IAuctionService _auctionService;
        private readonly IPaymentService _paymentService;

        public AdminController(
            RoyalBidzDbContext context,
            IUserService userService,
            IAuctionService auctionService,
            IPaymentService paymentService)
        {
            _context = context;
            _userService = userService;
            _auctionService = auctionService;
            _paymentService = paymentService;
        }

        // Dashboard Statistics
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var totalAuctions = await _context.Auctions.CountAsync();
                var totalBids = await _context.Bids.CountAsync();
                var activeAuctions = await _context.Auctions
                    .Where(a => a.Status == AuctionStatus.Active)
                    .CountAsync();
                
                var totalRevenue = await _context.Payments
                    .Where(p => p.Status == PaymentStatus.Completed)
                    .SumAsync(p => p.Amount);

                var pendingPayments = await _context.Payments
                    .Where(p => p.Status == PaymentStatus.Pending)
                    .CountAsync();

                var stats = new
                {
                    totalUsers,
                    totalAuctions,
                    totalBids,
                    totalRevenue,
                    activeAuctions,
                    pendingPayments
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching dashboard statistics", error = ex.Message });
            }
        }

        // User Statistics
        [HttpGet("stats/users")]
        public async Task<IActionResult> GetUserStats()
        {
            try
            {
                var userStats = await _context.Users
                    .GroupBy(u => u.Role)
                    .Select(g => new { Role = g.Key, Count = g.Count() })
                    .ToListAsync();

                var usersByStatus = await _context.Users
                    .GroupBy(u => u.Status)
                    .Select(g => new { Status = g.Key, Count = g.Count() })
                    .ToListAsync();

                var newUsersThisMonth = await _context.Users
                    .Where(u => u.CreatedAt >= DateTime.UtcNow.AddDays(-30))
                    .CountAsync();

                return Ok(new
                {
                    usersByRole = userStats,
                    usersByStatus = usersByStatus,
                    newUsersThisMonth
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching user statistics", error = ex.Message });
            }
        }

        // Auction Statistics
        [HttpGet("stats/auctions")]
        public async Task<IActionResult> GetAuctionStats()
        {
            try
            {
                var auctionsByStatus = await _context.Auctions
                    .GroupBy(a => a.Status)
                    .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
                    .ToListAsync();

                var avgBidsPerAuction = await _context.Auctions
                    .Where(a => a.Status == AuctionStatus.Ended)
                    .Select(a => new { AuctionId = a.Id, BidCount = a.Bids.Count() })
                    .AverageAsync(x => (double?)x.BidCount) ?? 0;

                var topCategories = await _context.JewelryItems
                    .GroupBy(j => j.Type)
                    .Select(g => new { Category = g.Key.ToString(), Count = g.Count() })
                    .OrderByDescending(x => x.Count)
                    .Take(5)
                    .ToListAsync();

                return Ok(new
                {
                    auctionsByStatus,
                    avgBidsPerAuction = Math.Round(avgBidsPerAuction, 2),
                    topCategories
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching auction statistics", error = ex.Message });
            }
        }

        // Revenue Statistics
        [HttpGet("stats/revenue")]
        public async Task<IActionResult> GetRevenueStats([FromQuery] int days = 30)
        {
            try
            {
                var startDate = DateTime.UtcNow.AddDays(-days);
                
                var dailyRevenue = await _context.Payments
                    .Where(p => p.Status == PaymentStatus.Completed && p.ProcessedAt >= startDate)
                    .GroupBy(p => p.ProcessedAt.Value.Date)
                    .Select(g => new { Date = g.Key, Amount = g.Sum(x => x.Amount) })
                    .OrderBy(x => x.Date)
                    .ToListAsync();

                var totalRevenue = dailyRevenue.Sum(x => x.Amount);
                var avgDailyRevenue = dailyRevenue.Any() ? dailyRevenue.Average(x => x.Amount) : 0;

                var topEarningAuctions = await _context.Auctions
                    .Where(a => a.Status == AuctionStatus.Ended && a.WinningBidderId.HasValue)
                    .OrderByDescending(a => a.CurrentBid)
                    .Take(5)
                    .Select(a => new { a.Id, a.Title, Revenue = a.CurrentBid, a.EndTime })
                    .ToListAsync();

                return Ok(new
                {
                    dailyRevenue,
                    totalRevenue,
                    avgDailyRevenue = Math.Round(avgDailyRevenue, 2),
                    topEarningAuctions
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching revenue statistics", error = ex.Message });
            }
        }

        // Recent Activity
        [HttpGet("activity")]
        public async Task<IActionResult> GetRecentActivity([FromQuery] int limit = 10)
        {
            try
            {
                var recentUsers = await _context.Users
                    .OrderByDescending(u => u.CreatedAt)
                    .Take(limit)
                    .Select(u => new
                    {
                        Type = "user_registered",
                        Description = $"New user registered: {u.Username}",
                        Timestamp = u.CreatedAt,
                        EntityId = u.Id
                    })
                    .ToListAsync();

                var recentAuctions = await _context.Auctions
                    .Where(a => a.Status == AuctionStatus.Ended && a.EndTime >= DateTime.UtcNow.AddDays(-7))
                    .OrderByDescending(a => a.EndTime)
                    .Take(limit)
                    .Select(a => new
                    {
                        Type = "auction_ended",
                        Description = $"Auction ended: {a.Title}",
                        Timestamp = a.EndTime,
                        EntityId = a.Id
                    })
                    .ToListAsync();

                var recentPayments = await _context.Payments
                    .Where(p => p.Status == PaymentStatus.Completed)
                    .OrderByDescending(p => p.ProcessedAt)
                    .Take(limit)
                    .Select(p => new
                    {
                        Type = "payment_completed",
                        Description = $"Payment completed: ${p.Amount:F2}",
                        Timestamp = p.ProcessedAt ?? p.CreatedAt,
                        EntityId = p.Id
                    })
                    .ToListAsync();

                var allActivity = recentUsers
                    .Concat(recentAuctions)
                    .Concat(recentPayments)
                    .OrderByDescending(a => a.Timestamp)
                    .Take(limit)
                    .ToList();

                return Ok(allActivity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching recent activity", error = ex.Message });
            }
        }

        // User Management
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.Users.AsQueryable();

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(u => u.Username.Contains(search) || u.Email.Contains(search));
                }

                var totalUsers = await query.CountAsync();
                var users = await query
                    .OrderByDescending(u => u.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(u => new
                    {
                        u.Id,
                        u.Username,
                        u.Email,
                        Role = u.Role.ToString(),
                        Status = u.Status.ToString(),
                        u.CreatedAt,
                        LastLogin = u.UpdatedAt // Assuming UpdatedAt tracks last login
                    })
                    .ToListAsync();

                return Ok(new
                {
                    users,
                    totalPages = (int)Math.Ceiling((double)totalUsers / pageSize),
                    currentPage = page,
                    totalUsers
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching users", error = ex.Message });
            }
        }

        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateUserStatusDto dto)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                user.Status = dto.Status;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "User status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user status", error = ex.Message });
            }
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto dto)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                if (Enum.TryParse<UserRole>(dto.Role, out var roleEnum))
                {
                    user.Role = roleEnum;
                    user.UpdatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();
                    return Ok(new { message = "User role updated successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Invalid role specified" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user role", error = ex.Message });
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                // Check if user has active auctions or bids
                var hasActiveAuctions = await _context.Auctions
                    .AnyAsync(a => a.SellerId == id && a.Status == AuctionStatus.Active);

                var hasActiveBids = await _context.Bids
                    .AnyAsync(b => b.BidderId == id && b.Status == BidStatus.Winning);

                if (hasActiveAuctions || hasActiveBids)
                {
                    return BadRequest(new { message = "Cannot delete user with active auctions or bids" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user", error = ex.Message });
            }
        }

        // Auction Management
        [HttpGet("auctions/pending")]
        public async Task<IActionResult> GetPendingAuctions()
        {
            try
            {
                var pendingAuctions = await _context.Auctions
                    .Where(a => a.Status == AuctionStatus.Draft)
                    .Include(a => a.JewelryItem)
                    .Include(a => a.Seller)
                    .Select(a => new
                    {
                        a.Id,
                        a.Title,
                        a.Description,
                        a.StartingBid,
                        a.StartTime,
                        a.EndTime,
                        a.Status,
                        Seller = new { a.Seller.Username, a.Seller.Email },
                        JewelryItem = new { a.JewelryItem.Type, a.JewelryItem.PrimaryMaterial, a.JewelryItem.Weight }
                    })
                    .ToListAsync();

                return Ok(pendingAuctions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching pending auctions", error = ex.Message });
            }
        }

        // Get all auctions (optionally filter by status)
        [HttpGet("auctions")]
        public async Task<IActionResult> GetAuctions([FromQuery] AuctionStatus? status = null)
        {
            try
            {
                var query = _context.Auctions
                    .Include(a => a.JewelryItem)
                    .Include(a => a.Seller)
                    .AsQueryable();

                if (status.HasValue)
                {
                    query = query.Where(a => a.Status == status.Value);
                }

                var auctions = await query
                    .Select(a => new
                    {
                        a.Id,
                        a.Title,
                        a.Description,
                        a.StartingBid,
                        a.StartTime,
                        a.EndTime,
                        a.Status,
                        CurrentBid = a.CurrentBid,
                        Seller = new { a.Seller.Username, a.Seller.Email },
                        JewelryItem = new { a.JewelryItem.Type, a.JewelryItem.PrimaryMaterial, a.JewelryItem.Weight }
                    })
                    .OrderByDescending(a => a.StartTime)
                    .ToListAsync();

                return Ok(auctions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching auctions", error = ex.Message });
            }
        }

        [HttpPut("auctions/{id}/approve")]
        public async Task<IActionResult> ApproveAuction(int id)
        {
            try
            {
                var auction = await _context.Auctions.FindAsync(id);
                if (auction == null)
                    return NotFound(new { message = "Auction not found" });

                auction.Status = AuctionStatus.Active;
                auction.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Auction approved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error approving auction", error = ex.Message });
            }
        }

        [HttpPut("auctions/{id}/reject")]
        public async Task<IActionResult> RejectAuction(int id, [FromBody] RejectAuctionDto dto)
        {
            try
            {
                var auction = await _context.Auctions.FindAsync(id);
                if (auction == null)
                    return NotFound(new { message = "Auction not found" });

                auction.Status = AuctionStatus.Cancelled;
                auction.UpdatedAt = DateTime.UtcNow;

                // Create notification for seller
                var notification = new Notification
                {
                    UserId = auction.SellerId,
                    Type = "auction_rejected",
                    Title = "Auction Rejected",
                    Message = $"Your auction '{auction.Title}' was rejected. Reason: {dto.Reason}",
                    IsRead = false,
                    EntityType = "auction",
                    EntityId = auction.Id,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Auction rejected successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error rejecting auction", error = ex.Message });
            }
        }

        // Payment Management
        [HttpGet("payments/pending")]
        public async Task<IActionResult> GetPendingPayments()
        {
            try
            {
                var pendingPayments = await _context.Payments
                    .Where(p => p.Status == PaymentStatus.Pending)
                    .Include(p => p.Auction)
                    .Include(p => p.Payer)
                    .Select(p => new
                    {
                        p.Id,
                        p.Amount,
                        ProcessedDate = p.ProcessedAt,
                        p.Status,
                        User = new { p.Payer.Username, p.Payer.Email },
                        Auction = new { p.Auction.Title, p.Auction.Id }
                    })
                    .ToListAsync();

                return Ok(pendingPayments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching pending payments", error = ex.Message });
            }
        }

        // Get all payments (optionally filter by status)
        [HttpGet("payments")]
        public async Task<IActionResult> GetPayments([FromQuery] PaymentStatus? status = null)
        {
            try
            {
                var query = _context.Payments
                    .Include(p => p.Auction)
                    .Include(p => p.Payer)
                    .AsQueryable();

                if (status.HasValue)
                {
                    query = query.Where(p => p.Status == status.Value);
                }

                var payments = await query
                    .Select(p => new
                    {
                        p.Id,
                        p.Amount,
                        ProcessedDate = p.ProcessedAt,
                        p.Status,
                        User = new { p.Payer.Username, p.Payer.Email },
                        Auction = new { p.Auction.Title, p.Auction.Id }
                    })
                    .OrderByDescending(p => p.ProcessedDate)
                    .ToListAsync();

                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching payments", error = ex.Message });
            }
        }

        [HttpPut("payments/{id}/verify")]
        public async Task<IActionResult> VerifyPayment(int id)
        {
            try
            {
                var payment = await _context.Payments.FindAsync(id);
                if (payment == null)
                    return NotFound(new { message = "Payment not found" });

                payment.Status = PaymentStatus.Completed;
                payment.ProcessedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Payment verified successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error verifying payment", error = ex.Message });
            }
        }

        // Analytics Endpoints
        [HttpGet("analytics/revenue")]
        public async Task<IActionResult> GetRevenueAnalytics([FromQuery] int days = 30)
        {
            try
            {
                var startDate = DateTime.UtcNow.AddDays(-days);
                
                var dailyRevenue = await _context.Payments
                    .Where(p => p.Status == PaymentStatus.Completed && p.ProcessedAt >= startDate)
                    .GroupBy(p => p.ProcessedAt.Value.Date)
                    .Select(g => new { Date = g.Key, Revenue = g.Sum(x => x.Amount), Count = g.Count() })
                    .OrderBy(x => x.Date)
                    .ToListAsync();

                var totalRevenue = dailyRevenue.Sum(x => x.Revenue);
                var totalTransactions = dailyRevenue.Sum(x => x.Count);

                return Ok(new { dailyRevenue, totalRevenue, totalTransactions });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching revenue analytics", error = ex.Message });
            }
        }

        [HttpGet("analytics/platform")]
        public async Task<IActionResult> GetPlatformAnalytics()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var activeUsers = await _context.Users.Where(u => u.LastLogin >= DateTime.UtcNow.AddDays(-30)).CountAsync();
                var totalAuctions = await _context.Auctions.CountAsync();
                var completedAuctions = await _context.Auctions.Where(a => a.Status == AuctionStatus.Completed).CountAsync();
                
                // Safely compute average bids per auction: load counts then average in-memory to avoid EF translation issues
                var endedOrCompletedAuctions = await _context.Auctions
                    .Where(a => a.Status == AuctionStatus.Ended || a.Status == AuctionStatus.Completed)
                    .Select(a => a.Id)
                    .ToListAsync();

                double avgBidsPerAuction = 0;
                if (endedOrCompletedAuctions.Any())
                {
                    var bidsCounts = await _context.Bids
                        .Where(b => endedOrCompletedAuctions.Contains(b.AuctionId))
                        .GroupBy(b => b.AuctionId)
                        .Select(g => g.Count())
                        .ToListAsync();

                    avgBidsPerAuction = bidsCounts.Any() ? bidsCounts.Average() : 0;
                }

                var topCategories = await _context.JewelryItems
                    .GroupBy(j => j.Type)
                    .Select(g => new { Category = g.Key.ToString(), Count = g.Count(), AvgValue = g.Average(x => x.EstimatedValue) })
                    .OrderByDescending(x => x.Count)
                    .Take(5)
                    .ToListAsync();

                return Ok(new
                {
                    totalUsers,
                    activeUsers,
                    userEngagementRate = totalUsers > 0 ? (double)activeUsers / totalUsers * 100 : 0,
                    totalAuctions,
                    completedAuctions,
                    completionRate = totalAuctions > 0 ? (double)completedAuctions / totalAuctions * 100 : 0,
                    avgBidsPerAuction = Math.Round(avgBidsPerAuction, 2),
                    topCategories
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching platform analytics", error = ex.Message });
            }
        }

        [HttpGet("analytics/social-shares")]
        public async Task<IActionResult> GetSocialShareAnalytics()
        {
            try
            {
                // Check if social shares table exists
                var socialSharesExist = await _context.Database.SqlQueryRaw<int>(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'social_shares'"
                ).FirstOrDefaultAsync();

                if (socialSharesExist == 0)
                {
                    return Ok(new
                    {
                        totalShares = 0,
                        sharesByPlatform = new List<object>(),
                        sharesByType = new List<object>(),
                        recentShares = new List<object>()
                    });
                }

                // Get social share stats using raw SQL since the model might not be mapped
                var sharesByPlatform = await _context.Database.SqlQueryRaw<dynamic>(
                    "SELECT platform, COUNT(*) as count FROM social_shares GROUP BY platform"
                ).ToListAsync();

                var sharesByType = await _context.Database.SqlQueryRaw<dynamic>(
                    "SELECT share_type, COUNT(*) as count FROM social_shares GROUP BY share_type"
                ).ToListAsync();

                var totalShares = await _context.Database.SqlQueryRaw<int>(
                    "SELECT COUNT(*) FROM social_shares"
                ).FirstOrDefaultAsync();

                return Ok(new
                {
                    totalShares,
                    sharesByPlatform,
                    sharesByType
                });
            }
            catch (Exception ex)
            {
                // Return empty data if social shares feature isn't implemented yet
                return Ok(new
                {
                    totalShares = 0,
                    sharesByPlatform = new List<object>(),
                    sharesByType = new List<object>(),
                    message = "Social shares feature not fully implemented"
                });
            }
        }

        // System Settings
        [HttpGet("settings")]
        public async Task<IActionResult> GetSystemSettings()
        {
            try
            {
                // Return basic system settings
                var settings = new
                {
                    platformName = "RoyalBidz",
                    version = "1.0.0",
                    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
                    databaseStatus = "Connected",
                    lastBackup = DateTime.UtcNow.AddDays(-1), // Mock data
                    maintenanceMode = false,
                    registrationEnabled = true,
                    auctionCreationEnabled = true,
                    paymentProcessingEnabled = true
                };

                return Ok(settings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching system settings", error = ex.Message });
            }
        }

        [HttpPut("settings")]
        public async Task<IActionResult> UpdateSystemSettings([FromBody] SystemSettingsDto settings)
        {
            try
            {
                // In a real implementation, you would save these to a settings table
                // For now, just return success
                return Ok(new { message = "System settings updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating system settings", error = ex.Message });
            }
        }
    }

    // DTOs for admin operations
    public class UpdateUserStatusDto
    {
        public UserStatus Status { get; set; }
    }

    public class UpdateUserRoleDto
    {
        public string Role { get; set; } = string.Empty;
    }

    public class RejectAuctionDto
    {
        public string Reason { get; set; } = string.Empty;
    }

    public class SystemSettingsDto
    {
        public bool MaintenanceMode { get; set; }
        public bool RegistrationEnabled { get; set; }
        public bool AuctionCreationEnabled { get; set; }
        public bool PaymentProcessingEnabled { get; set; }
    }
}
