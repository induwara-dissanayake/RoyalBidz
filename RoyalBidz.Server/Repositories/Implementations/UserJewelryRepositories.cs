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
}