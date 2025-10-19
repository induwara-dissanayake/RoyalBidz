using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.BackgroundServices
{
    public class AuctionBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AuctionBackgroundService> _logger;
        private readonly TimeSpan _period = TimeSpan.FromMinutes(1); // Check every minute

        public AuctionBackgroundService(IServiceProvider serviceProvider, ILogger<AuctionBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessAuctions();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while processing auctions");
                }

                await Task.Delay(_period, stoppingToken);
            }
        }

        private async Task ProcessAuctions()
        {
            using var scope = _serviceProvider.CreateScope();
            var auctionService = scope.ServiceProvider.GetRequiredService<IAuctionService>();
            var notificationService = scope.ServiceProvider.GetRequiredService<IUserNotificationService>();

            try
            {
                // Process ended auctions (set status = Ended and set final winner)
                var activeToEnd = await auctionService.GetEndingSoonAuctionsAsync(0); // immediate ended
                foreach (var a in activeToEnd)
                {
                    // Finalize winner from leading bidder
                    if (a.LeadingBidderId.HasValue)
                    {
                        await auctionService.AssignWinningBidderAsync(a.Id, a.LeadingBidderId.Value);
                        
                        // Send auction won notification with payment action
                        await notificationService.CreateAuctionWonWithPaymentNotificationAsync(
                            a.LeadingBidderId.Value,
                            a.Title,
                            a.CurrentBid,
                            a.Id
                        );
                    }
                }

                // Get auctions ending soon (within 1 hour)
                var endingSoonAuctions = await auctionService.GetEndingSoonAuctionsAsync(1);
                
                foreach (var auction in endingSoonAuctions)
                {
                    _logger.LogInformation("Auction {AuctionId} '{Title}' is ending soon", auction.Id, auction.Title);
                    
                    // Send notification for auctions ending soon to the current leading bidder
                    if (auction.LeadingBidderId.HasValue)
                    {
                        await notificationService.CreateAuctionEndingNotificationAsync(
                            auction.LeadingBidderId.Value, 
                            auction.Title, 
                            auction.EndTime);
                    }
                }

                _logger.LogDebug("Auction background processing completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in auction background processing");
            }
        }
    }
}