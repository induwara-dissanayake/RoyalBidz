using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Data;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class UserNotificationService : IUserNotificationService
    {
        private readonly RoyalBidzDbContext _context;

        public UserNotificationService(RoyalBidzDbContext context)
        {
            _context = context;
        }

        public async Task CreateBidOutbidNotificationAsync(int userId, string auctionTitle, decimal newBidAmount)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = "bid_outbid",
                Title = "You've been outbid!",
                Message = $"Your bid on \"{auctionTitle}\" has been outbid. Current highest bid: ${newBidAmount:N2}",
                EntityType = "auction",
                Amount = newBidAmount
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateAuctionWonNotificationAsync(int userId, string auctionTitle, decimal winningBid)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = "auction_won",
                Title = "Congratulations! You won an auction",
                Message = $"You won the auction for \"{auctionTitle}\" with a bid of ${winningBid:N2}",
                EntityType = "auction",
                Amount = winningBid
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreatePaymentSuccessNotificationAsync(int userId, string auctionTitle, decimal amount)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = "payment_success",
                Title = "Payment processed successfully",
                Message = $"Your payment of ${amount:N2} for \"{auctionTitle}\" has been processed",
                EntityType = "payment",
                Amount = amount
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateAuctionEndingNotificationAsync(int userId, string auctionTitle, DateTime endTime)
        {
            var timeRemaining = endTime - DateTime.UtcNow;
            var timeText = timeRemaining.TotalHours < 1 
                ? $"{timeRemaining.Minutes} minutes" 
                : $"{(int)timeRemaining.TotalHours} hours";

            var notification = new Notification
            {
                UserId = userId,
                Type = "auction_ending",
                Title = "Auction ending soon",
                Message = $"The auction for \"{auctionTitle}\" ends in {timeText}. You are currently the highest bidder!",
                EntityType = "auction"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateNewAuctionNotificationAsync(int userId, string auctionTitle, decimal startingBid)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = "new_auction",
                Title = "New auction matching your interests",
                Message = $"A new \"{auctionTitle}\" auction has started. Starting bid: ${startingBid:N2}",
                EntityType = "auction",
                Amount = startingBid
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateBidAcceptedNotificationAsync(int userId, string auctionTitle, decimal bidAmount)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = "bid_accepted",
                Title = "Your bid has been accepted",
                Message = $"Your bid of ${bidAmount:N2} on \"{auctionTitle}\" has been accepted. You are now the highest bidder!",
                EntityType = "bid",
                Amount = bidAmount
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateAuctionCreatedNotificationAsync(int userId, string auctionTitle)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = "auction_created",
                Title = "Your auction is now live",
                Message = $"Your auction \"{auctionTitle}\" has been created and is now accepting bids",
                EntityType = "auction"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateBidPlacedNotificationAsync(int userId, string auctionTitle, decimal bidAmount)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = "bid_placed",
                Title = "Bid placed successfully",
                Message = $"You placed a bid of ${bidAmount:N2} on \"{auctionTitle}\"",
                EntityType = "bid",
                Amount = bidAmount
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateAuctionWonWithPaymentNotificationAsync(int userId, string auctionTitle, decimal winningBid, int auctionId)
        {
            // Idempotency: don't create duplicate auction_won_payment for same user + auction
            var exists = await _context.Notifications.AnyAsync(n =>
                n.UserId == userId && n.Type == "auction_won_payment" && n.EntityType == "auction" && n.EntityId == auctionId);

            if (exists)
            {
                return; // already created
            }

            var notification = new Notification
            {
                UserId = userId,
                Type = "auction_won_payment",
                Title = "🎉 Congratulations! You Won!",
                Message = $"You won \"{auctionTitle}\" with a bid of ${winningBid:N2}. Complete your payment within 48 hours to secure your item.",
                EntityType = "auction",
                EntityId = auctionId,
                Amount = winningBid,
                ActionUrl = $"/payment/{auctionId}",
                ActionLabel = "Complete Payment",
                ActionCancelUrl = $"/payment/cancel/{auctionId}",
                ActionCancelLabel = "Cancel Payment"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreatePaymentReminderNotificationAsync(int userId, string auctionTitle, decimal amount, int auctionId)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = "payment_reminder",
                Title = "⏰ Payment Reminder",
                Message = $"Don't forget to complete your payment of ${amount:N2} for \"{auctionTitle}\". Your payment deadline is approaching.",
                EntityType = "payment",
                EntityId = auctionId,
                Amount = amount,
                ActionUrl = $"/payment/{auctionId}",
                ActionLabel = "Pay Now"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
    }
}
