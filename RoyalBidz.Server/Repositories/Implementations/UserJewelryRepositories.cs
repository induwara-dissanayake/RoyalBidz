using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Data;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;

namespace RoyalBidz.Server.Repositories.Implementations
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetWithProfileAsync(int userId)
        {
            return await _dbSet
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role)
        {
            return await _dbSet.Where(u => u.Role == role).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetActiveUsersAsync()
        {
            return await _dbSet.Where(u => u.Status == UserStatus.Active).ToListAsync();
        }

        public async Task UpdateLastLoginAsync(int userId)
        {
            var user = await _dbSet.FindAsync(userId);
            if (user != null)
            {
                user.LastLogin = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
    }

    public class UserProfileRepository : GenericRepository<UserProfile>, IUserProfileRepository
    {
        public UserProfileRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<UserProfile?> GetByUserIdAsync(int userId)
        {
            return await _dbSet.FirstOrDefaultAsync(up => up.UserId == userId);
        }
    }

    public class UserPreferencesRepository : GenericRepository<UserPreferences>, IUserPreferencesRepository
    {
        public UserPreferencesRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<UserPreferences?> GetByUserIdAsync(int userId)
        {
            return await _dbSet.FirstOrDefaultAsync(p => p.UserId == userId);
        }
    }

    public class UserActivityRepository : GenericRepository<UserActivity>, IUserActivityRepository
    {
        public UserActivityRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<UserActivity>> GetUserActivitiesAsync(int userId, int page, int pageSize, string? activityType)
        {
            var query = _dbSet.Where(a => a.UserId == userId);

            if (!string.IsNullOrEmpty(activityType))
            {
                query = query.Where(a => a.ActivityType == activityType);
            }

            return await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<UserActivity?> GetRecentActivityAsync(int userId)
        {
            return await _dbSet
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<UserActivity>> GetActivitiesByTypeAsync(string activityType, int page, int pageSize)
        {
            return await _dbSet
                .Where(a => a.ActivityType == activityType)
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }

    public class WishlistRepository : GenericRepository<Wishlist>, IWishlistRepository
    {
        public WishlistRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Wishlist>> GetUserWishlistAsync(int userId)
        {
            return await _dbSet
                .Include(w => w.JewelryItem)
                .ThenInclude(j => j.Images.Where(i => i.IsPrimary))
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.CreatedAt)
                .ToListAsync();
        }

        public async Task<Wishlist?> GetWishlistItemAsync(int userId, int jewelryItemId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(w => w.UserId == userId && w.JewelryItemId == jewelryItemId);
        }

        public async Task<bool> IsInWishlistAsync(int userId, int jewelryItemId)
        {
            return await _dbSet
                .AnyAsync(w => w.UserId == userId && w.JewelryItemId == jewelryItemId);
        }
    }

    public class PaymentMethodRepository : GenericRepository<PaymentMethod>, IPaymentMethodRepository
    {
        public PaymentMethodRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PaymentMethod>> GetUserPaymentMethodsAsync(int userId)
        {
            return await _dbSet
                .Where(pm => pm.UserId == userId && pm.IsActive)
                .OrderByDescending(pm => pm.IsDefault)
                .ThenBy(pm => pm.CreatedAt)
                .ToListAsync();
        }

        public async Task<PaymentMethod?> GetDefaultPaymentMethodAsync(int userId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(pm => pm.UserId == userId && pm.IsDefault && pm.IsActive);
        }

        public async Task<bool> SetAsDefaultAsync(int paymentMethodId, int userId)
        {
            // First remove default from all other methods
            var userMethods = await _dbSet
                .Where(pm => pm.UserId == userId)
                .ToListAsync();

            foreach (var method in userMethods)
            {
                method.IsDefault = method.Id == paymentMethodId;
                method.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class JewelryItemRepository : GenericRepository<JewelryItem>, IJewelryItemRepository
    {
        public JewelryItemRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<JewelryItem>> GetByTypeAsync(JewelryType type)
        {
            return await _dbSet.Where(j => j.Type == type).ToListAsync();
        }

        public async Task<IEnumerable<JewelryItem>> GetByMaterialAsync(JewelryMaterial material)
        {
            return await _dbSet.Where(j => j.PrimaryMaterial == material).ToListAsync();
        }

        public async Task<IEnumerable<JewelryItem>> SearchAsync(string searchTerm)
        {
            return await _dbSet
                .Where(j => j.Name.Contains(searchTerm) || 
                           (j.Description != null && j.Description.Contains(searchTerm)) ||
                           (j.Brand != null && j.Brand.Contains(searchTerm)))
                .ToListAsync();
        }

        public async Task<JewelryItem?> GetWithImagesAsync(int id)
        {
            return await _dbSet
                .Include(j => j.Images.OrderBy(i => i.DisplayOrder))
                .FirstOrDefaultAsync(j => j.Id == id);
        }
    }

    public class ContactInquiryRepository : GenericRepository<ContactInquiry>, IContactInquiryRepository
    {
        public ContactInquiryRepository(RoyalBidzDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ContactInquiry>> GetByStatusAsync(ContactInquiryStatus status)
        {
            return await _dbSet
                .Where(c => c.Status == status)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ContactInquiry>> GetByPriorityAsync(ContactInquiryPriority priority)
        {
            return await _dbSet
                .Where(c => c.Priority == priority)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ContactInquiry>> GetAssignedToUserAsync(int userId)
        {
            return await _dbSet
                .Where(c => c.AssignedToUserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ContactInquiry>> GetPendingInquiriesAsync()
        {
            return await _dbSet
                .Where(c => c.Status == ContactInquiryStatus.Pending)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ContactInquiry>> GetRecentInquiriesAsync(int days = 30)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-days);
            return await _dbSet
                .Where(c => c.CreatedAt >= cutoffDate)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<ContactInquiry?> GetWithAssignedUserAsync(int id)
        {
            return await _dbSet
                .Include(c => c.AssignedToUser)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> UpdateStatusAsync(int id, ContactInquiryStatus status)
        {
            var inquiry = await _dbSet.FindAsync(id);
            if (inquiry == null) return false;

            inquiry.Status = status;
            inquiry.UpdatedAt = DateTime.UtcNow;
            
            if (status == ContactInquiryStatus.InProgress || status == ContactInquiryStatus.Resolved)
            {
                inquiry.RespondedAt ??= DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AssignToUserAsync(int id, int userId)
        {
            var inquiry = await _dbSet.FindAsync(id);
            if (inquiry == null) return false;

            inquiry.AssignedToUserId = userId;
            inquiry.UpdatedAt = DateTime.UtcNow;
            
            if (inquiry.Status == ContactInquiryStatus.Pending)
            {
                inquiry.Status = ContactInquiryStatus.InProgress;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}