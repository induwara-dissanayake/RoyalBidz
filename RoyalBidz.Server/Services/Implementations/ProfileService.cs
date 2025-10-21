using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Controllers;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class ProfileService : IProfileService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IUserPreferencesRepository _preferencesRepository;
        private readonly IUserActivityRepository _activityRepository;
        private readonly IWishlistRepository _wishlistRepository;
        private readonly IPaymentMethodRepository _paymentMethodRepository;
        private readonly IAuctionRepository _auctionRepository;
        private readonly IBidRepository _bidRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<ProfileService> _logger;
        private readonly IWebHostEnvironment _environment;

        public ProfileService(
            IUserRepository userRepository,
            IUserProfileRepository userProfileRepository,
            IUserPreferencesRepository preferencesRepository,
            IUserActivityRepository activityRepository,
            IWishlistRepository wishlistRepository,
            IPaymentMethodRepository paymentMethodRepository,
            IAuctionRepository auctionRepository,
            IBidRepository bidRepository,
            IPaymentRepository paymentRepository,
            IMapper mapper,
            ILogger<ProfileService> logger,
            IWebHostEnvironment environment)
        {
            _userRepository = userRepository;
            _userProfileRepository = userProfileRepository;
            _preferencesRepository = preferencesRepository;
            _activityRepository = activityRepository;
            _wishlistRepository = wishlistRepository;
            _paymentMethodRepository = paymentMethodRepository;
            _auctionRepository = auctionRepository;
            _bidRepository = bidRepository;
            _paymentRepository = paymentRepository;
            _mapper = mapper;
            _logger = logger;
            _environment = environment;
        }

        public async Task<ProfileSummaryDto?> GetProfileSummaryAsync(int userId)
        {
            var user = await _userRepository.GetWithProfileAsync(userId);
            if (user == null)
            {
                return null;
            }

            var userDto = _mapper.Map<UserDto>(user);
            var preferences = await GetUserPreferencesAsync(userId);
            var stats = await GetProfileStatsAsync(userId);
            var recentActivities = await GetUserActivitiesAsync(userId, 1, 10, null);

            return new ProfileSummaryDto
            {
                User = userDto,
                Preferences = preferences,
                Stats = stats,
                RecentActivities = recentActivities.ToList()
            };
        }

        public async Task<UserDto?> UpdateProfileAsync(int userId, UpdateUserDto updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            _mapper.Map(updateUserDto, user);
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            // Log activity
            await LogUserActivityAsync(userId, new LogActivityDto
            {
                ActivityType = "PROFILE_UPDATE",
                Description = "Profile information updated"
            });

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserPreferencesDto> GetUserPreferencesAsync(int userId)
        {
            var preferences = await _preferencesRepository.GetByUserIdAsync(userId);
            
            if (preferences == null)
            {
                // Create default preferences
                preferences = new UserPreferences
                {
                    UserId = userId,
                    EmailNotifications = true,
                    SmsNotifications = false,
                    PushNotifications = true,
                    BidNotifications = true,
                    AuctionEndNotifications = true,
                    NewsletterSubscription = true,
                    TwoFactorEnabled = false,
                    Currency = "USD",
                    Language = "en",
                    Timezone = "UTC",
                    PrivacyLevel = PrivacyLevel.Public
                };

                await _preferencesRepository.AddAsync(preferences);
            }

            return _mapper.Map<UserPreferencesDto>(preferences);
        }

        public async Task<UserPreferencesDto> UpdateUserPreferencesAsync(int userId, UpdateUserPreferencesDto updatePreferencesDto)
        {
            var preferences = await _preferencesRepository.GetByUserIdAsync(userId);
            
            if (preferences == null)
            {
                preferences = new UserPreferences { UserId = userId };
                await _preferencesRepository.AddAsync(preferences);
            }

            _mapper.Map(updatePreferencesDto, preferences);
            preferences.UpdatedAt = DateTime.UtcNow;

            await _preferencesRepository.UpdateAsync(preferences);

            // Log activity
            await LogUserActivityAsync(userId, new LogActivityDto
            {
                ActivityType = "PREFERENCES_UPDATE",
                Description = "User preferences updated"
            });

            return _mapper.Map<UserPreferencesDto>(preferences);
        }

        public async Task<ProfileStatsDto> GetProfileStatsAsync(int userId)
        {
            var userBids = await _bidRepository.GetBidsByUserAsync(userId);
            var userAuctions = await _auctionRepository.GetAuctionsBySellerAsync(userId);
            var userPayments = await _paymentRepository.GetPaymentsByUserAsync(userId);
            var winningBids = await _bidRepository.GetWinningBidsAsync(userId);
            var wishlistItems = await _wishlistRepository.GetUserWishlistAsync(userId);
            
            var totalSpent = userPayments.Where(p => p.Status == PaymentStatus.Completed).Sum(p => p.TotalAmount);
            var totalEarned = userAuctions.Where(a => a.Status == AuctionStatus.Completed && a.WinningBidderId.HasValue)
                .Sum(a => a.CurrentBid);
            
            var activeBids = userBids.Count(b => b.Status == BidStatus.Active);
            var recentActivity = await _activityRepository.GetRecentActivityAsync(userId);

            return new ProfileStatsDto
            {
                TotalBids = userBids.Count(),
                WonAuctions = winningBids.Count(),
                ActiveBids = activeBids,
                CreatedAuctions = userAuctions.Count(),
                TotalSpent = totalSpent,
                TotalEarned = totalEarned,
                WishlistItems = wishlistItems.Count(),
                LastActivity = recentActivity?.CreatedAt
            };
        }

        public async Task<IEnumerable<UserActivityDto>> GetUserActivitiesAsync(int userId, int page, int pageSize, string? activityType)
        {
            var activities = await _activityRepository.GetUserActivitiesAsync(userId, page, pageSize, activityType);
            return _mapper.Map<IEnumerable<UserActivityDto>>(activities);
        }

        public async Task LogUserActivityAsync(int userId, LogActivityDto logActivityDto)
        {
            var activity = new UserActivity
            {
                UserId = userId,
                ActivityType = logActivityDto.ActivityType,
                Description = logActivityDto.Description,
                EntityType = logActivityDto.EntityType,
                EntityId = logActivityDto.EntityId,
                Amount = logActivityDto.Amount,
                CreatedAt = DateTime.UtcNow
            };

            await _activityRepository.AddAsync(activity);
        }

        public async Task<string> UploadProfileImageAsync(int userId, IFormFile file)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "profiles");
            Directory.CreateDirectory(uploadsPath);

            // Generate unique filename
            var fileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Update user profile image URL
            var imageUrl = $"/uploads/profiles/{fileName}";
            
            // Get or create user profile
            var userProfile = await _userProfileRepository.GetByUserIdAsync(userId);
            if (userProfile == null)
            {
                userProfile = new UserProfile
                {
                    UserId = userId,
                    ProfileImageUrl = imageUrl,
                    CreatedAt = DateTime.UtcNow
                };
                await _userProfileRepository.AddAsync(userProfile);
            }
            else
            {
                userProfile.ProfileImageUrl = imageUrl;
                userProfile.UpdatedAt = DateTime.UtcNow;
                await _userProfileRepository.UpdateAsync(userProfile);
            }
            
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            // Log activity
            await LogUserActivityAsync(userId, new LogActivityDto
            {
                ActivityType = "PROFILE_IMAGE_UPDATE",
                Description = "Profile image updated"
            });

            return imageUrl;
        }

        public async Task<bool> DeleteAccountAsync(int userId, string password)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return false;
            }

            // Check if user has active auctions
            var activeAuctions = await _auctionRepository.GetAuctionsBySellerAsync(userId);
            if (activeAuctions.Any(a => a.Status == AuctionStatus.Active))
            {
                throw new InvalidOperationException("Cannot delete account with active auctions");
            }

            // Log final activity
            await LogUserActivityAsync(userId, new LogActivityDto
            {
                ActivityType = "ACCOUNT_DELETED",
                Description = "User account deleted"
            });

            // Soft delete user (change status instead of actual deletion)
            user.Status = UserStatus.Inactive;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            return true;
        }

        // Wishlist methods
        public async Task<IEnumerable<WishlistDto>> GetUserWishlistAsync(int userId)
        {
            var wishlistItems = await _wishlistRepository.GetUserWishlistAsync(userId);
            return _mapper.Map<IEnumerable<WishlistDto>>(wishlistItems);
        }

        public async Task<WishlistDto> AddToWishlistAsync(int userId, int jewelryItemId)
        {
            // Check if already in wishlist
            var existingItem = await _wishlistRepository.GetWishlistItemAsync(userId, jewelryItemId);
            if (existingItem != null)
            {
                throw new InvalidOperationException("Item is already in wishlist");
            }

            var wishlistItem = new Wishlist
            {
                UserId = userId,
                JewelryItemId = jewelryItemId,
                CreatedAt = DateTime.UtcNow
            };

            await _wishlistRepository.AddAsync(wishlistItem);

            // Log activity
            await LogUserActivityAsync(userId, new LogActivityDto
            {
                ActivityType = "WISHLIST_ADD",
                Description = "Added item to wishlist",
                EntityType = "JewelryItem",
                EntityId = jewelryItemId
            });

            return _mapper.Map<WishlistDto>(wishlistItem);
        }

        public async Task<bool> RemoveFromWishlistAsync(int userId, int jewelryItemId)
        {
            var wishlistItem = await _wishlistRepository.GetWishlistItemAsync(userId, jewelryItemId);
            if (wishlistItem == null)
            {
                return false;
            }

            await _wishlistRepository.DeleteAsync(wishlistItem);

            // Log activity
            await LogUserActivityAsync(userId, new LogActivityDto
            {
                ActivityType = "WISHLIST_REMOVE",
                Description = "Removed item from wishlist",
                EntityType = "JewelryItem",
                EntityId = jewelryItemId
            });

            return true;
        }

        public async Task<bool> IsInWishlistAsync(int userId, int jewelryItemId)
        {
            return await _wishlistRepository.IsInWishlistAsync(userId, jewelryItemId);
        }

        // Payment methods
        public async Task<IEnumerable<PaymentMethodDto>> GetUserPaymentMethodsAsync(int userId)
        {
            var paymentMethods = await _paymentMethodRepository.GetUserPaymentMethodsAsync(userId);
            return _mapper.Map<IEnumerable<PaymentMethodDto>>(paymentMethods);
        }

        public async Task<PaymentMethodDto> AddPaymentMethodAsync(int userId, CreatePaymentMethodDto createPaymentMethodDto)
        {
            // If this is set as default, remove default from others
            if (createPaymentMethodDto.IsDefault)
            {
                await _paymentMethodRepository.SetAsDefaultAsync(0, userId); // This will set all to false
            }

            var paymentMethod = _mapper.Map<PaymentMethod>(createPaymentMethodDto);
            paymentMethod.UserId = userId;
            paymentMethod.CreatedAt = DateTime.UtcNow;

            await _paymentMethodRepository.AddAsync(paymentMethod);

            // Log activity
            await LogUserActivityAsync(userId, new LogActivityDto
            {
                ActivityType = "PAYMENT_METHOD_ADD",
                Description = $"Added {paymentMethod.Type} payment method"
            });

            return _mapper.Map<PaymentMethodDto>(paymentMethod);
        }

        public async Task<PaymentMethodDto?> UpdatePaymentMethodAsync(int userId, int paymentMethodId, UpdatePaymentMethodDto updatePaymentMethodDto)
        {
            var paymentMethod = await _paymentMethodRepository.GetByIdAsync(paymentMethodId);
            if (paymentMethod == null || paymentMethod.UserId != userId)
            {
                return null;
            }

            _mapper.Map(updatePaymentMethodDto, paymentMethod);
            paymentMethod.UpdatedAt = DateTime.UtcNow;

            // If setting as default, remove default from others
            if (updatePaymentMethodDto.IsDefault == true)
            {
                await _paymentMethodRepository.SetAsDefaultAsync(paymentMethodId, userId);
            }

            await _paymentMethodRepository.UpdateAsync(paymentMethod);

            // Log activity
            await LogUserActivityAsync(userId, new LogActivityDto
            {
                ActivityType = "PAYMENT_METHOD_UPDATE",
                Description = $"Updated {paymentMethod.Type} payment method"
            });

            return _mapper.Map<PaymentMethodDto>(paymentMethod);
        }

        public async Task<bool> DeletePaymentMethodAsync(int userId, int paymentMethodId)
        {
            var paymentMethod = await _paymentMethodRepository.GetByIdAsync(paymentMethodId);
            if (paymentMethod == null || paymentMethod.UserId != userId)
            {
                return false;
            }

            await _paymentMethodRepository.DeleteAsync(paymentMethod);

            // Log activity
            await LogUserActivityAsync(userId, new LogActivityDto
            {
                ActivityType = "PAYMENT_METHOD_DELETE",
                Description = $"Deleted {paymentMethod.Type} payment method"
            });

            return true;
        }

        public async Task<bool> SetDefaultPaymentMethodAsync(int userId, int paymentMethodId)
        {
            return await _paymentMethodRepository.SetAsDefaultAsync(paymentMethodId, userId);
        }
    }
}
