using Microsoft.AspNetCore.Mvc;
using RoyalBidz.Server.Services.Interfaces;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Data;
using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Controllers
{
    [ApiController]
    [Route("api/admin/debug")]
    public class AdminDebugController : ControllerBase
    {
        private readonly IAuctionService _auctionService;
        private readonly IBidRepository _bidRepository;
        private readonly RoyalBidzDbContext _context;

        public AdminDebugController(IAuctionService auctionService, IBidRepository bidRepository, RoyalBidzDbContext context)
        {
            _auctionService = auctionService;
            _bidRepository = bidRepository;
            _context = context;
        }

        [HttpPost("finalize/{id}")]
        public async Task<IActionResult> Finalize(int id)
        {
            // Determine winner: prefer LeadingBidderId, otherwise highest bid
            var auctionEntity = await _context.Auctions.FindAsync(id);
            if (auctionEntity == null) return NotFound();

            var bids = (await _bidRepository.GetBidsByAuctionAsync(id)).OrderByDescending(b => b.Amount).ThenByDescending(b => b.BidTime).ToList();
            int? winnerId = auctionEntity.LeadingBidderId;
            if (!winnerId.HasValue && bids.Any()) winnerId = bids.First().BidderId;

            if (winnerId.HasValue)
            {
                await _auctionService.AssignWinningBidderAsync(id, winnerId.Value);
            }

            // Reload minimal data for response
            var auction = await _context.Auctions
                .Where(a => a.Id == id)
                .Select(a => new {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.CurrentBid,
                    a.LeadingBidderId,
                    a.WinningBidderId,
                    a.EndTime,
                    a.UpdatedAt
                })
                .FirstOrDefaultAsync();

            var simpleBids = bids.Select(b => new { b.Id, b.BidderId, b.Amount, Status = b.Status.ToString(), b.BidTime }).ToList();

            var notifications = await _context.Notifications
                .Where(n => n.EntityId == id)
                .Select(n => new { n.Id, n.UserId, n.Type, n.Title, n.Message, n.EntityId, n.ActionUrl, n.ActionLabel, n.CreatedAt })
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(new { auction, bids = simpleBids, notifications });
        }

        [HttpPost("seed-bid/{id}")]
        public async Task<IActionResult> SeedBid(int id)
        {
            var auction = await _context.Auctions.FindAsync(id);
            if (auction == null) return NotFound();

            // choose a test bidder (use existing user id 3 if present)
            var testBidderId = 3;

            // Determine next amount
            var current = auction.CurrentBid;
            decimal nextAmount = current + (auction.BidIncrement > 0 ? auction.BidIncrement : 1);

            var bid = new Bid
            {
                AuctionId = id,
                BidderId = testBidderId,
                Amount = nextAmount,
                BidTime = DateTime.UtcNow,
                Status = BidStatus.Winning,
                // Bid model does not have CreatedAt/UpdatedAt
            };

            _context.Bids.Add(bid);

            // Update auction leading/current
            auction.CurrentBid = nextAmount;
            auction.LeadingBidderId = testBidderId;
            auction.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { bidId = bid.Id, auctionId = auction.Id, auction.CurrentBid, auction.LeadingBidderId });
        }

        [HttpPost("create-notification/{id}")]
        public async Task<IActionResult> CreateNotification(int id)
        {
            var auction = await _context.Auctions.FindAsync(id);
            if (auction == null) return NotFound();

            // Insert using raw SQL to avoid mapping issues with DB schema (ActionCancel* columns may be missing)
            var userId = auction.LeadingBidderId ?? 3;
            var now = DateTime.UtcNow;
            var sql = $@"
                INSERT INTO Notifications
                    (UserId, Type, Title, Message, IsRead, EntityType, EntityId, Amount, ActionUrl, ActionLabel, CreatedAt)
                VALUES
                    ({userId}, 'auction_won_payment', @title, @message, false, 'auction', {auction.Id}, {auction.CurrentBid}, @actionUrl, 'Complete Payment', @now);
            ";

            var title = "🎉 Congratulations! You Won!";
            var message = $"You won \"{auction.Title}\". Complete payment to secure your item.";
            var actionUrl = $"/payment/{auction.Id}";

            var insertSql = @"INSERT INTO Notifications
                (UserId, Type, Title, Message, IsRead, EntityType, EntityId, Amount, ActionUrl, ActionLabel, CreatedAt)
                VALUES
                ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10});";

            await _context.Database.ExecuteSqlRawAsync(insertSql,
                userId,
                "auction_won_payment",
                title,
                message,
                false,
                "auction",
                auction.Id,
                auction.CurrentBid,
                actionUrl,
                "Complete Payment",
                now);

            return Ok(new { created = true });
        }
    }
}
