using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Data
{
    public class RoyalBidzDbContext : DbContext
    {
        public RoyalBidzDbContext(DbContextOptions<RoyalBidzDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<JewelryItem> JewelryItems { get; set; }
        public DbSet<JewelryImage> JewelryImages { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
            });

            // JewelryItem configuration
            modelBuilder.Entity<JewelryItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.EstimatedValue).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Weight).HasColumnType("decimal(8,3)");
            });

            // JewelryImage configuration
            modelBuilder.Entity<JewelryImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(d => d.JewelryItem)
                    .WithMany(p => p.Images)
                    .HasForeignKey(d => d.JewelryItemId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Auction configuration
            modelBuilder.Entity<Auction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.StartingBid).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ReservePrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.BidIncrement).HasColumnType("decimal(18,2)");
                entity.Property(e => e.BuyNowPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.CurrentBid).HasColumnType("decimal(18,2)");

                entity.HasOne(d => d.JewelryItem)
                    .WithMany(p => p.Auctions)
                    .HasForeignKey(d => d.JewelryItemId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.Seller)
                    .WithMany(p => p.CreatedAuctions)
                    .HasForeignKey(d => d.SellerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.WinningBidder)
                    .WithMany()
                    .HasForeignKey(d => d.WinningBidderId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Bid configuration
            modelBuilder.Entity<Bid>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MaxAutoBidAmount).HasColumnType("decimal(18,2)");

                entity.HasOne(d => d.Auction)
                    .WithMany(p => p.Bids)
                    .HasForeignKey(d => d.AuctionId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Bidder)
                    .WithMany(p => p.Bids)
                    .HasForeignKey(d => d.BidderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => new { e.AuctionId, e.BidTime });
            });

            // Payment configuration
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.AuctioneerFee).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ProcessingFee).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");

                entity.HasOne(d => d.Auction)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.AuctionId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.Payer)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.PayerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            var createdAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Seed users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@royalbidz.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = UserRole.Admin,
                    Status = UserStatus.Active,
                    CreatedAt = createdAt
                },
                new User
                {
                    Id = 2,
                    FirstName = "John",
                    LastName = "Seller",
                    Email = "seller@royalbidz.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Seller123!"),
                    Role = UserRole.Seller,
                    Status = UserStatus.Active,
                    CreatedAt = createdAt
                },
                new User
                {
                    Id = 3,
                    FirstName = "Jane",
                    LastName = "Buyer",
                    Email = "buyer@royalbidz.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Buyer123!"),
                    Role = UserRole.Buyer,
                    Status = UserStatus.Active,
                    CreatedAt = createdAt
                }
            );

            // Seed jewelry items
            modelBuilder.Entity<JewelryItem>().HasData(
                new JewelryItem
                {
                    Id = 1,
                    Name = "Vintage Diamond Ring",
                    Description = "A stunning vintage diamond ring from the 1950s featuring a 2-carat center stone.",
                    Type = JewelryType.Ring,
                    PrimaryMaterial = JewelryMaterial.Diamond,
                    Brand = "Cartier",
                    Weight = 5.2m,
                    Condition = ItemCondition.Excellent,
                    YearMade = 1955,
                    Origin = "France",
                    EstimatedValue = 15000.00m,
                    CreatedAt = createdAt
                },
                new JewelryItem
                {
                    Id = 2,
                    Name = "Pearl Necklace",
                    Description = "Elegant cultured pearl necklace with 18k gold clasp.",
                    Type = JewelryType.Necklace,
                    PrimaryMaterial = JewelryMaterial.Pearl,
                    Weight = 45.8m,
                    Condition = ItemCondition.New,
                    EstimatedValue = 3500.00m,
                    CreatedAt = createdAt
                },
                new JewelryItem
                {
                    Id = 3,
                    Name = "Ruby Earrings",
                    Description = "Pair of exquisite ruby earrings set in platinum.",
                    Type = JewelryType.Earrings,
                    PrimaryMaterial = JewelryMaterial.Ruby,
                    Weight = 8.1m,
                    Condition = ItemCondition.VeryGood,
                    EstimatedValue = 8500.00m,
                    CreatedAt = createdAt
                }
            );

            // Seed jewelry images
            modelBuilder.Entity<JewelryImage>().HasData(
                new JewelryImage { Id = 1, JewelryItemId = 1, ImageUrl = "/images/diamond-ring-1.jpg", IsPrimary = true, DisplayOrder = 1, CreatedAt = createdAt },
                new JewelryImage { Id = 2, JewelryItemId = 1, ImageUrl = "/images/diamond-ring-2.jpg", IsPrimary = false, DisplayOrder = 2, CreatedAt = createdAt },
                new JewelryImage { Id = 3, JewelryItemId = 2, ImageUrl = "/images/pearl-necklace-1.jpg", IsPrimary = true, DisplayOrder = 1, CreatedAt = createdAt },
                new JewelryImage { Id = 4, JewelryItemId = 3, ImageUrl = "/images/ruby-earrings-1.jpg", IsPrimary = true, DisplayOrder = 1, CreatedAt = createdAt }
            );

            // Seed auctions
            var auctionStartTime = DateTime.UtcNow.AddDays(-1);
            var auctionEndTime = DateTime.UtcNow.AddDays(7);

            modelBuilder.Entity<Auction>().HasData(
                new Auction
                {
                    Id = 1,
                    Title = "Vintage Diamond Ring Auction",
                    Description = "Don't miss this rare opportunity to own a vintage Cartier diamond ring.",
                    JewelryItemId = 1,
                    SellerId = 2,
                    StartingBid = 5000.00m,
                    ReservePrice = 12000.00m,
                    BidIncrement = 100.00m,
                    BuyNowPrice = 18000.00m,
                    StartTime = auctionStartTime,
                    EndTime = auctionEndTime,
                    Status = AuctionStatus.Active,
                    CurrentBid = 5000.00m,
                    CreatedAt = createdAt
                },
                new Auction
                {
                    Id = 2,
                    Title = "Cultured Pearl Necklace",
                    Description = "Beautiful cultured pearl necklace perfect for special occasions.",
                    JewelryItemId = 2,
                    SellerId = 2,
                    StartingBid = 1000.00m,
                    BidIncrement = 50.00m,
                    StartTime = auctionStartTime,
                    EndTime = auctionEndTime.AddDays(3),
                    Status = AuctionStatus.Active,
                    CurrentBid = 1000.00m,
                    CreatedAt = createdAt
                }
            );
        }
    }
}