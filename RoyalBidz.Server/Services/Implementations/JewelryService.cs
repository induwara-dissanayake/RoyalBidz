using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RoyalBidz.Server.Data;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class JewelryService : IJewelryService
    {
        private readonly RoyalBidzDbContext _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<JewelryService> _logger;

        public JewelryService(
            RoyalBidzDbContext context,
            IMapper mapper,
            IWebHostEnvironment environment,
            ILogger<JewelryService> logger)
        {
            _context = context;
            _mapper = mapper;
            _environment = environment;
            _logger = logger;
        }

        public async Task<IEnumerable<JewelryItemDto>> GetAllJewelryItemsAsync()
        {
            var items = await _context.JewelryItems
                .Include(j => j.Images)
                .ToListAsync();

            return _mapper.Map<IEnumerable<JewelryItemDto>>(items);
        }

        public async Task<JewelryItemDto?> GetJewelryItemByIdAsync(int id)
        {
            var item = await _context.JewelryItems
                .FirstOrDefaultAsync(j => j.Id == id);

            return item != null ? _mapper.Map<JewelryItemDto>(item) : null;
        }

        public async Task<JewelryItemDto?> GetJewelryItemWithImagesAsync(int id)
        {
            var item = await _context.JewelryItems
                .Include(j => j.Images.OrderBy(i => i.DisplayOrder))
                .FirstOrDefaultAsync(j => j.Id == id);

            return item != null ? _mapper.Map<JewelryItemDto>(item) : null;
        }

        public async Task<IEnumerable<JewelryItemDto>> GetJewelryItemsByTypeAsync(JewelryType type)
        {
            var items = await _context.JewelryItems
                .Include(j => j.Images)
                .Where(j => j.Type == type)
                .ToListAsync();

            return _mapper.Map<IEnumerable<JewelryItemDto>>(items);
        }

        public async Task<IEnumerable<JewelryItemDto>> GetJewelryItemsByMaterialAsync(JewelryMaterial material)
        {
            var items = await _context.JewelryItems
                .Include(j => j.Images)
                .Where(j => j.PrimaryMaterial == material)
                .ToListAsync();

            return _mapper.Map<IEnumerable<JewelryItemDto>>(items);
        }

        // Alias methods for controller compatibility
        public async Task<IEnumerable<JewelryItemDto>> SearchJewelryItemsAsync(string searchTerm)
        {
            var items = await _context.JewelryItems
                .Include(j => j.Images)
                .Where(j => j.Name.Contains(searchTerm) || 
                           (j.Description != null && j.Description.Contains(searchTerm)) ||
                           (j.Brand != null && j.Brand.Contains(searchTerm)))
                .ToListAsync();

            return _mapper.Map<IEnumerable<JewelryItemDto>>(items);
        }

        public async Task<IEnumerable<JewelryItemDto>> GetJewelryByTypeAsync(JewelryType type)
        {
            return await GetJewelryItemsByTypeAsync(type);
        }

        public async Task<IEnumerable<JewelryItemDto>> GetJewelryByMaterialAsync(JewelryMaterial material)
        {
            return await GetJewelryItemsByMaterialAsync(material);
        }

        public async Task<JewelryItemDto> CreateJewelryItemAsync(CreateJewelryItemDto createJewelryItemDto)
        {
            var jewelryItem = _mapper.Map<JewelryItem>(createJewelryItemDto);
            jewelryItem.CreatedAt = DateTime.UtcNow;

            _context.JewelryItems.Add(jewelryItem);
            await _context.SaveChangesAsync();

            // Add images if provided
            if (createJewelryItemDto.Images.Any())
            {
                foreach (var imageDto in createJewelryItemDto.Images)
                {
                    var image = _mapper.Map<JewelryImage>(imageDto);
                    image.JewelryItemId = jewelryItem.Id;
                    image.CreatedAt = DateTime.UtcNow;
                    _context.JewelryImages.Add(image);
                }
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<JewelryItemDto>(jewelryItem);
        }

        public async Task<JewelryItemDto?> UpdateJewelryItemAsync(int id, UpdateJewelryItemDto updateJewelryItemDto)
        {
            var jewelryItem = await _context.JewelryItems
                .FirstOrDefaultAsync(j => j.Id == id);

            if (jewelryItem == null)
                return null;

            _mapper.Map(updateJewelryItemDto, jewelryItem);
            await _context.SaveChangesAsync();

            return _mapper.Map<JewelryItemDto>(jewelryItem);
        }

        public async Task<bool> DeleteJewelryItemAsync(int id)
        {
            var jewelryItem = await _context.JewelryItems
                .Include(j => j.Images)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (jewelryItem == null)
                return false;

            // Delete associated images from filesystem
            foreach (var image in jewelryItem.Images)
            {
                await DeleteImageFileAsync(image.ImageUrl);
            }

            _context.JewelryItems.Remove(jewelryItem);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<JewelryImageDto> UploadImageAsync(int jewelryItemId, IFormFile file, string? altText = null, bool isPrimary = false, int displayOrder = 0)
        {
            // Verify jewelry item exists
            var jewelryItem = await _context.JewelryItems
                .FirstOrDefaultAsync(j => j.Id == jewelryItemId);

            if (jewelryItem == null)
                throw new InvalidOperationException("Jewelry item not found");

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "jewelry");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"{jewelryItemId}_{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // If this is marked as primary, unset other primary images
            if (isPrimary)
            {
                var existingPrimaryImages = await _context.JewelryImages
                    .Where(i => i.JewelryItemId == jewelryItemId && i.IsPrimary)
                    .ToListAsync();

                foreach (var img in existingPrimaryImages)
                {
                    img.IsPrimary = false;
                }
            }

            // Create image record
            var image = new JewelryImage
            {
                JewelryItemId = jewelryItemId,
                ImageUrl = $"/uploads/jewelry/{fileName}",
                AltText = altText ?? $"{jewelryItem.Name} - Image",
                IsPrimary = isPrimary,
                DisplayOrder = displayOrder,
                CreatedAt = DateTime.UtcNow
            };

            _context.JewelryImages.Add(image);
            await _context.SaveChangesAsync();

            return _mapper.Map<JewelryImageDto>(image);
        }

        public async Task<JewelryImageDto> AddImageToJewelryItemAsync(int jewelryItemId, CreateJewelryImageDto createImageDto)
        {
            // Verify jewelry item exists
            var jewelryItem = await _context.JewelryItems
                .FirstOrDefaultAsync(j => j.Id == jewelryItemId);

            if (jewelryItem == null)
                throw new InvalidOperationException("Jewelry item not found");

            // If this is marked as primary, unset other primary images
            if (createImageDto.IsPrimary)
            {
                var existingPrimaryImages = await _context.JewelryImages
                    .Where(i => i.JewelryItemId == jewelryItemId && i.IsPrimary)
                    .ToListAsync();

                foreach (var img in existingPrimaryImages)
                {
                    img.IsPrimary = false;
                }
            }

            var image = _mapper.Map<JewelryImage>(createImageDto);
            image.JewelryItemId = jewelryItemId;
            image.CreatedAt = DateTime.UtcNow;

            _context.JewelryImages.Add(image);
            await _context.SaveChangesAsync();

            return _mapper.Map<JewelryImageDto>(image);
        }

        public async Task<bool> DeleteImageAsync(int imageId)
        {
            var image = await _context.JewelryImages
                .FirstOrDefaultAsync(i => i.Id == imageId);

            if (image == null)
                return false;

            // Delete file from filesystem
            await DeleteImageFileAsync(image.ImageUrl);

            _context.JewelryImages.Remove(image);
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task DeleteImageFileAsync(string imageUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(imageUrl))
                    return;

                var fileName = Path.GetFileName(imageUrl);
                var filePath = Path.Combine(_environment.WebRootPath, "uploads", "jewelry", fileName);

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image file {ImageUrl}", imageUrl);
                // Don't throw - image record should still be deleted even if file deletion fails
            }
        }
    }
}
