using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RoyalBidz.Server.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        private readonly INotificationService _notificationService;

        public AuthService(IUserRepository userRepository, IMapper mapper, 
            IConfiguration configuration, ILogger<AuthService> logger, INotificationService notificationService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _configuration = configuration;
            _logger = logger;
            _notificationService = notificationService;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (user.Status != UserStatus.Active)
            {
                throw new UnauthorizedAccessException("Account is not active");
            }

            await _userRepository.UpdateLastLoginAsync(user.Id);

            // Get the complete user data with profile information
            var userWithProfile = await _userRepository.GetWithProfileAsync(user.Id);
            var userDto = _mapper.Map<UserDto>(userWithProfile);
            var token = await GenerateJwtToken(userDto);
            var expiresAt = DateTime.UtcNow.AddHours(24);

            return new LoginResponseDto
            {
                Token = token,
                User = userDto,
                ExpiresAt = expiresAt
            };
        }

        public async Task<UserDto> RegisterAsync(CreateUserDto createUserDto)
        {
            if (await _userRepository.EmailExistsAsync(createUserDto.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            var user = _mapper.Map<User>(createUserDto);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password);
            user.CreatedAt = DateTime.UtcNow;
            user.EmailVerified = false;

            // Generate verification code
            var verificationCode = new Random().Next(100000, 999999).ToString();
            user.EmailVerificationCode = verificationCode;
            user.EmailVerificationCodeExpiry = DateTime.UtcNow.AddMinutes(15);

            await _userRepository.AddAsync(user);

            // Send verification email
            try
            {
                _logger.LogInformation("Attempting to send verification email to {Email}", user.Email);
                await _notificationService.SendEmailVerificationCodeAsync(user.Email, user.Username, verificationCode);
                _logger.LogInformation("Verification email sent successfully to {Email}", user.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send verification email to {Email}", user.Email);
                // Don't throw - allow registration to complete even if email fails
            }

            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Current password is incorrect");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            await _userRepository.UpdateAsync(user);

            return true;
        }

        public async Task<string> GenerateJwtToken(UserDto user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var jwtSettings = _configuration.GetSection("JwtSettings");
                var secretKey = jwtSettings["SecretKey"];
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<EmailVerificationResponseDto> VerifyEmailAsync(VerifyEmailDto verifyEmailDto)
        {
            var user = await _userRepository.GetByEmailAsync(verifyEmailDto.Email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            if (user.EmailVerified)
            {
                return new EmailVerificationResponseDto
                {
                    Success = true,
                    Message = "Email is already verified"
                };
            }

            if (user.EmailVerificationCode != verifyEmailDto.VerificationCode)
            {
                return new EmailVerificationResponseDto
                {
                    Success = false,
                    Message = "Invalid verification code"
                };
            }

            if (user.EmailVerificationCodeExpiry < DateTime.UtcNow)
            {
                return new EmailVerificationResponseDto
                {
                    Success = false,
                    Message = "Verification code has expired"
                };
            }

            // Mark email as verified
            user.EmailVerified = true;
            user.EmailVerificationCode = null;
            user.EmailVerificationCodeExpiry = null;
            await _userRepository.UpdateAsync(user);

            // Send success email
            await _notificationService.SendEmailVerificationSuccessAsync(user.Email, user.Username);

            return new EmailVerificationResponseDto
            {
                Success = true,
                Message = "Email verified successfully"
            };
        }

        public async Task<bool> ResendVerificationCodeAsync(ResendVerificationDto resendVerificationDto)
        {
            var user = await _userRepository.GetByEmailAsync(resendVerificationDto.Email);
            if (user == null)
            {
                return false;
            }

            if (user.EmailVerified)
            {
                return true; // Already verified
            }

            return await SendEmailVerificationCodeAsync(resendVerificationDto.Email);
        }

        public async Task<bool> SendEmailVerificationCodeAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                return false;
            }

            if (user.EmailVerified)
            {
                return true; // Already verified
            }

            // Generate verification code
            var verificationCode = new Random().Next(100000, 999999).ToString();
            user.EmailVerificationCode = verificationCode;
            user.EmailVerificationCodeExpiry = DateTime.UtcNow.AddMinutes(15); // 15 minutes expiry

            await _userRepository.UpdateAsync(user);

            // Send verification email
            await _notificationService.SendEmailVerificationCodeAsync(user.Email, user.Username, verificationCode);

            return true;
        }
    }
}