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
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IPaymentMethodRepository _paymentMethodRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IUserProfileRepository userProfileRepository, IPaymentMethodRepository paymentMethodRepository, IMapper mapper, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _userProfileRepository = userProfileRepository;
            _paymentMethodRepository = paymentMethodRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetWithProfileAsync(id);
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

            // Update User entity fields (Username, PhoneNumber)
            if (!string.IsNullOrEmpty(updateUserDto.Username))
                user.Username = updateUserDto.Username;
            if (!string.IsNullOrEmpty(updateUserDto.PhoneNumber))
                user.PhoneNumber = updateUserDto.PhoneNumber;
            
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            // Get or create UserProfile
            var userProfile = await _userProfileRepository.GetByUserIdAsync(id);
            if (userProfile == null)
            {
                userProfile = new UserProfile 
                { 
                    UserId = id,
                    CreatedAt = DateTime.UtcNow
                };
                await _userProfileRepository.AddAsync(userProfile);
            }

            // Update UserProfile fields
            if (!string.IsNullOrEmpty(updateUserDto.FirstName))
                userProfile.FirstName = updateUserDto.FirstName;
            if (!string.IsNullOrEmpty(updateUserDto.LastName))
                userProfile.LastName = updateUserDto.LastName;
            if (!string.IsNullOrEmpty(updateUserDto.Address))
                userProfile.Address = updateUserDto.Address;
            if (!string.IsNullOrEmpty(updateUserDto.City))
                userProfile.City = updateUserDto.City;
            if (!string.IsNullOrEmpty(updateUserDto.State))
                userProfile.State = updateUserDto.State;
            if (!string.IsNullOrEmpty(updateUserDto.ZipCode))
                userProfile.ZipCode = updateUserDto.ZipCode;
            if (!string.IsNullOrEmpty(updateUserDto.Country))
                userProfile.Country = updateUserDto.Country;
            if (!string.IsNullOrEmpty(updateUserDto.ProfileImageUrl))
                userProfile.ProfileImageUrl = updateUserDto.ProfileImageUrl;
            if (updateUserDto.DateOfBirth.HasValue)
                userProfile.DateOfBirth = updateUserDto.DateOfBirth;
            if (!string.IsNullOrEmpty(updateUserDto.Bio))
                userProfile.Bio = updateUserDto.Bio;
            
            userProfile.UpdatedAt = DateTime.UtcNow;
            await _userProfileRepository.UpdateAsync(userProfile);

            // Load the updated user with profile for the response
            var updatedUser = await _userRepository.GetWithProfileAsync(id);
            return _mapper.Map<UserDto>(updatedUser);
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

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                return false;
            }

            // Update to new password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<PaymentMethodDto> AddPaymentMethodAsync(int userId, CreatePaymentMethodDto createPaymentMethodDto)
        {
            // Extract last 4 digits from card number if provided
            string? last4 = null;
            string? brand = null;
            
            if (!string.IsNullOrEmpty(createPaymentMethodDto.CardNumber))
            {
                var cleanCardNumber = createPaymentMethodDto.CardNumber.Replace(" ", "");
                last4 = cleanCardNumber.Length >= 4 ? cleanCardNumber.Substring(cleanCardNumber.Length - 4) : null;
                
                // Determine card brand based on first digits
                if (cleanCardNumber.StartsWith("4"))
                    brand = "Visa";
                else if (cleanCardNumber.StartsWith("5") || cleanCardNumber.StartsWith("2"))
                    brand = "Mastercard";
                else if (cleanCardNumber.StartsWith("3"))
                    brand = "American Express";
                else
                    brand = "Unknown";
            }

            var paymentMethod = new PaymentMethod
            {
                UserId = userId,
                Type = createPaymentMethodDto.Type ?? "Credit Card",
                Brand = brand ?? createPaymentMethodDto.Brand,
                Last4 = last4 ?? createPaymentMethodDto.Last4,
                ExpiryDate = createPaymentMethodDto.ExpiryDate,
                Email = createPaymentMethodDto.Email,
                BankName = createPaymentMethodDto.BankName,
                AccountNumber = createPaymentMethodDto.AccountNumber,
                IsDefault = createPaymentMethodDto.IsDefault,
                CreatedAt = DateTime.UtcNow
            };

            // If this is set as default, update other payment methods to not be default
            if (createPaymentMethodDto.IsDefault)
            {
                var existingMethods = await _paymentMethodRepository.FindAsync(pm => pm.UserId == userId && pm.IsDefault);
                foreach (var method in existingMethods)
                {
                    method.IsDefault = false;
                    await _paymentMethodRepository.UpdateAsync(method);
                }
            }

            await _paymentMethodRepository.AddAsync(paymentMethod);
            return _mapper.Map<PaymentMethodDto>(paymentMethod);
        }

        public async Task<IEnumerable<PaymentMethodDto>> GetPaymentMethodsAsync(int userId)
        {
            var paymentMethods = await _paymentMethodRepository.FindAsync(pm => pm.UserId == userId && pm.IsActive);
            return _mapper.Map<IEnumerable<PaymentMethodDto>>(paymentMethods);
        }
    }
}