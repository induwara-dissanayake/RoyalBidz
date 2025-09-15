using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace RoyalBidz.Server.Hubs
{
    [Authorize]
    public class AuctionHub : Hub
    {
        private readonly ILogger<AuctionHub> _logger;

        public AuctionHub(ILogger<AuctionHub> logger)
        {
            _logger = logger;
        }

        public async Task JoinAuction(string auctionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"auction_{auctionId}");
            
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
            
            _logger.LogInformation("User {UserId} ({UserName}) joined auction {AuctionId}", userId, userName, auctionId);
            
            await Clients.Group($"auction_{auctionId}").SendAsync("UserJoined", new { UserId = userId, UserName = userName });
        }

        public async Task LeaveAuction(string auctionId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"auction_{auctionId}");
            
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
            
            _logger.LogInformation("User {UserId} ({UserName}) left auction {AuctionId}", userId, userName, auctionId);
            
            await Clients.Group($"auction_{auctionId}").SendAsync("UserLeft", new { UserId = userId, UserName = userName });
        }

        public async Task SendBidUpdate(string auctionId, decimal amount, string bidderName)
        {
            await Clients.Group($"auction_{auctionId}").SendAsync("BidUpdate", new 
            { 
                AuctionId = auctionId, 
                Amount = amount, 
                BidderName = bidderName, 
                Timestamp = DateTime.UtcNow 
            });
        }

        public async Task SendAuctionUpdate(string auctionId, string status, string message)
        {
            await Clients.Group($"auction_{auctionId}").SendAsync("AuctionUpdate", new 
            { 
                AuctionId = auctionId, 
                Status = status, 
                Message = message, 
                Timestamp = DateTime.UtcNow 
            });
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
            
            _logger.LogInformation("User {UserId} ({UserName}) connected to auction hub", userId, userName);
            
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
            
            _logger.LogInformation("User {UserId} ({UserName}) disconnected from auction hub", userId, userName);
            
            await base.OnDisconnectedAsync(exception);
        }
    }
}