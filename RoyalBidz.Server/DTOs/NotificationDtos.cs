namespace RoyalBidz.Server.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public decimal? Amount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
    public string? ActionUrl { get; set; }
    public string? ActionLabel { get; set; }
    public string? ActionCancelUrl { get; set; }
    public string? ActionCancelLabel { get; set; }
    }

    public class CreateNotificationDto
    {
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public decimal? Amount { get; set; }
    }

    public class MarkNotificationReadDto
    {
        public int NotificationId { get; set; }
    }

    public class NotificationSummaryDto
    {
        public int TotalNotifications { get; set; }
        public int UnreadNotifications { get; set; }
        public List<NotificationDto> RecentNotifications { get; set; } = new();
    }
}
