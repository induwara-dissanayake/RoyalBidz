using AutoMapper;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IMapper mapper, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user == null ? null : _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            return user == null ? null : _mapper.Map<UserDto>(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<IEnumerable<UserDto>> GetUsersByRoleAsync(UserRole role)
        {
            var users = await _userRepository.GetUsersByRoleAsync(role);
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            if (await _userRepository.EmailExistsAsync(createUserDto.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            var user = _mapper.Map<User>(createUserDto);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password);
            user.CreatedAt = DateTime.UtcNow;

            await _userRepository.AddAsync(user);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            _mapper.Map(updateUserDto, user);
            await _userRepository.UpdateAsync(user);

            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            await _userRepository.DeleteAsync(user);
            return true;
        }

        public async Task<bool> UpdateUserStatusAsync(int id, UserStatus status)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            user.Status = status;
            await _userRepository.UpdateAsync(user);
            return true;
        }
    }

    public class JewelryService : IJewelryService
    {
        private readonly IJewelryItemRepository _jewelryRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<JewelryService> _logger;

        public JewelryService(IJewelryItemRepository jewelryRepository, IMapper mapper, ILogger<JewelryService> logger)
        {
            _jewelryRepository = jewelryRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<JewelryItemDto?> GetJewelryItemByIdAsync(int id)
        {
            var item = await _jewelryRepository.GetByIdAsync(id);
            return item == null ? null : _mapper.Map<JewelryItemDto>(item);
        }

        public async Task<IEnumerable<JewelryItemDto>> GetAllJewelryItemsAsync()
        {
            var items = await _jewelryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<JewelryItemDto>>(items);
        }

        public async Task<IEnumerable<JewelryItemDto>> SearchJewelryItemsAsync(string searchTerm)
        {
            var items = await _jewelryRepository.SearchAsync(searchTerm);
            return _mapper.Map<IEnumerable<JewelryItemDto>>(items);
        }

        public async Task<IEnumerable<JewelryItemDto>> GetJewelryByTypeAsync(JewelryType type)
        {
            var items = await _jewelryRepository.GetByTypeAsync(type);
            return _mapper.Map<IEnumerable<JewelryItemDto>>(items);
        }

        public async Task<IEnumerable<JewelryItemDto>> GetJewelryByMaterialAsync(JewelryMaterial material)
        {
            var items = await _jewelryRepository.GetByMaterialAsync(material);
            return _mapper.Map<IEnumerable<JewelryItemDto>>(items);
        }

        public async Task<JewelryItemDto> CreateJewelryItemAsync(CreateJewelryItemDto createJewelryItemDto)
        {
            var item = _mapper.Map<JewelryItem>(createJewelryItemDto);
            item.CreatedAt = DateTime.UtcNow;

            await _jewelryRepository.AddAsync(item);
            return _mapper.Map<JewelryItemDto>(item);
        }

        public async Task<JewelryItemDto?> UpdateJewelryItemAsync(int id, UpdateJewelryItemDto updateJewelryItemDto)
        {
            var item = await _jewelryRepository.GetByIdAsync(id);
            if (item == null)
            {
                return null;
            }

            _mapper.Map(updateJewelryItemDto, item);
            await _jewelryRepository.UpdateAsync(item);

            return _mapper.Map<JewelryItemDto>(item);
        }

        public async Task<bool> DeleteJewelryItemAsync(int id)
        {
            var item = await _jewelryRepository.GetByIdAsync(id);
            if (item == null)
            {
                return false;
            }

            await _jewelryRepository.DeleteAsync(item);
            return true;
        }

        public async Task<JewelryItemDto?> GetJewelryItemWithImagesAsync(int id)
        {
            var item = await _jewelryRepository.GetWithImagesAsync(id);
            return item == null ? null : _mapper.Map<JewelryItemDto>(item);
        }
    }
}