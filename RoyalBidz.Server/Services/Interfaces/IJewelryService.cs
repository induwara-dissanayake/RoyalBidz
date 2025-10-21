using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Services.Interfaces
{
    public interface IJewelryService
    {
        Task<IEnumerable<JewelryItemDto>> GetAllJewelryItemsAsync();
        Task<JewelryItemDto?> GetJewelryItemByIdAsync(int id);
        Task<JewelryItemDto?> GetJewelryItemWithImagesAsync(int id);
        Task<IEnumerable<JewelryItemDto>> GetJewelryItemsByTypeAsync(JewelryType type);
        Task<IEnumerable<JewelryItemDto>> GetJewelryItemsByMaterialAsync(JewelryMaterial material);
        Task<IEnumerable<JewelryItemDto>> SearchJewelryItemsAsync(string searchTerm);
        Task<IEnumerable<JewelryItemDto>> GetJewelryByTypeAsync(JewelryType type);
        Task<IEnumerable<JewelryItemDto>> GetJewelryByMaterialAsync(JewelryMaterial material);
        Task<JewelryItemDto> CreateJewelryItemAsync(CreateJewelryItemDto createJewelryItemDto);
        Task<JewelryItemDto?> UpdateJewelryItemAsync(int id, UpdateJewelryItemDto updateJewelryItemDto);
        Task<bool> DeleteJewelryItemAsync(int id);
        Task<JewelryImageDto> UploadImageAsync(int jewelryItemId, IFormFile file, string? altText = null, bool isPrimary = false, int displayOrder = 0);
        Task<JewelryImageDto> AddImageToJewelryItemAsync(int jewelryItemId, CreateJewelryImageDto createImageDto);
        Task<bool> DeleteImageAsync(int imageId);
    }
}
