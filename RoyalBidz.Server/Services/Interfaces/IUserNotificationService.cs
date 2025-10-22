namespace RoyalBidz.Server.Services.Interfaces
{
    public interface IUserNotificationService
    {
        Task CreateBidOutbidNotificationAsync(int userId, string auctionTitle, decimal newBidAmount);
        Task CreateAuctionWonNotificationAsync(int userId, string auctionTitle, decimal winningBid);
        Task CreatePaymentSuccessNotificationAsync(int userId, string auctionTitle, decimal amount);
        Task CreateAuctionEndingNotificationAsync(int userId, string auctionTitle, DateTime endTime);
        Task CreateNewAuctionNotificationAsync(int userId, string auctionTitle, decimal startingBid);
        Task CreateBidAcceptedNotificationAsync(int userId, string auctionTitle, decimal bidAmount);
        Task CreateAuctionCreatedNotificationAsync(int userId, string auctionTitle);
        Task CreateBidPlacedNotificationAsync(int userId, string auctionTitle, decimal bidAmount);
        Task CreateAuctionWonWithPaymentNotificationAsync(int userId, string auctionTitle, decimal winningBid, int auctionId);
        Task CreatePaymentReminderNotificationAsync(int userId, string auctionTitle, decimal amount, int auctionId);
    }
}
