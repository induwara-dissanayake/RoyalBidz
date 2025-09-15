using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto> RegisterAsync(CreateUserDto createUserDto);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
        Task<string> GenerateJwtToken(UserDto user);
        Task<bool> ValidateTokenAsync(string token);
    }

    public interface IUserService
    {
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto?> GetUserByEmailAsync(string email);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<IEnumerable<UserDto>> GetUsersByRoleAsync(UserRole role);
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> UpdateUserStatusAsync(int id, UserStatus status);
    }

    public interface IJewelryService
    {
        Task<JewelryItemDto?> GetJewelryItemByIdAsync(int id);
        Task<IEnumerable<JewelryItemDto>> GetAllJewelryItemsAsync();
        Task<IEnumerable<JewelryItemDto>> SearchJewelryItemsAsync(string searchTerm);
        Task<IEnumerable<JewelryItemDto>> GetJewelryByTypeAsync(JewelryType type);
        Task<IEnumerable<JewelryItemDto>> GetJewelryByMaterialAsync(JewelryMaterial material);
        Task<JewelryItemDto> CreateJewelryItemAsync(CreateJewelryItemDto createJewelryItemDto);
        Task<JewelryItemDto?> UpdateJewelryItemAsync(int id, UpdateJewelryItemDto updateJewelryItemDto);
        Task<bool> DeleteJewelryItemAsync(int id);
        Task<JewelryItemDto?> GetJewelryItemWithImagesAsync(int id);
    }
}