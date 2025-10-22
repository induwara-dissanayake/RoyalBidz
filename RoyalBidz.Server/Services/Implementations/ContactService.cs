using AutoMapper;
using Microsoft.Extensions.Logging;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;

namespace RoyalBidz.Server.Services.Implementations
{
    public class ContactService : IContactService
    {
        private readonly IContactInquiryRepository _contactRepository;
        private readonly IEmailNotificationService _emailService;
        private readonly IMapper _mapper;
        private readonly ILogger<ContactService> _logger;

        public ContactService(
            IContactInquiryRepository contactRepository,
            IEmailNotificationService emailService,
            IMapper mapper,
            ILogger<ContactService> logger)
        {
            _contactRepository = contactRepository;
            _emailService = emailService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ContactInquiryResponseDto> CreateInquiryAsync(CreateContactInquiryDto createContactInquiryDto)
        {
            try
            {
                var inquiry = _mapper.Map<ContactInquiry>(createContactInquiryDto);
                inquiry.CreatedAt = DateTime.UtcNow;
                inquiry.Status = ContactInquiryStatus.Pending;
                inquiry.Priority = ContactInquiryPriority.Medium;

                await _contactRepository.AddAsync(inquiry);

                // Send confirmation email to the user
                await _emailService.SendContactInquiryConfirmationAsync(
                    inquiry.Email, 
                    inquiry.Name, 
                    inquiry.Id);

                // Notify admin team about new inquiry
                await _emailService.SendNewInquiryNotificationAsync(inquiry);

                _logger.LogInformation("New contact inquiry created with ID: {InquiryId}", inquiry.Id);

                return new ContactInquiryResponseDto
                {
                    Id = inquiry.Id,
                    Message = "Your inquiry has been submitted successfully. We will get back to you soon.",
                    CreatedAt = inquiry.CreatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating contact inquiry for {Email}", createContactInquiryDto.Email);
                throw;
            }
        }

        public async Task<ContactInquiryDto?> GetInquiryByIdAsync(int id)
        {
            var inquiry = await _contactRepository.GetWithAssignedUserAsync(id);
            if (inquiry == null) return null;

            var dto = _mapper.Map<ContactInquiryDto>(inquiry);
            dto.AssignedToUserName = inquiry.AssignedToUser?.Username;
            return dto;
        }

        public async Task<IEnumerable<ContactInquiryDto>> GetAllInquiriesAsync()
        {
            var inquiries = await _contactRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ContactInquiryDto>>(inquiries);
        }

        public async Task<IEnumerable<ContactInquiryDto>> GetInquiriesByStatusAsync(ContactInquiryStatus status)
        {
            var inquiries = await _contactRepository.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<ContactInquiryDto>>(inquiries);
        }

        public async Task<IEnumerable<ContactInquiryDto>> GetInquiriesByPriorityAsync(ContactInquiryPriority priority)
        {
            var inquiries = await _contactRepository.GetByPriorityAsync(priority);
            return _mapper.Map<IEnumerable<ContactInquiryDto>>(inquiries);
        }

        public async Task<IEnumerable<ContactInquiryDto>> GetPendingInquiriesAsync()
        {
            var inquiries = await _contactRepository.GetPendingInquiriesAsync();
            return _mapper.Map<IEnumerable<ContactInquiryDto>>(inquiries);
        }

        public async Task<IEnumerable<ContactInquiryDto>> GetRecentInquiriesAsync(int days = 30)
        {
            var inquiries = await _contactRepository.GetRecentInquiriesAsync(days);
            return _mapper.Map<IEnumerable<ContactInquiryDto>>(inquiries);
        }

        public async Task<ContactInquiryDto?> UpdateInquiryAsync(int id, UpdateContactInquiryDto updateContactInquiryDto)
        {
            var inquiry = await _contactRepository.GetByIdAsync(id);
            if (inquiry == null) return null;

            // Update only non-null properties
            if (updateContactInquiryDto.Status.HasValue)
                inquiry.Status = updateContactInquiryDto.Status.Value;
            
            if (updateContactInquiryDto.Priority.HasValue)
                inquiry.Priority = updateContactInquiryDto.Priority.Value;
            
            if (updateContactInquiryDto.AssignedToUserId.HasValue)
                inquiry.AssignedToUserId = updateContactInquiryDto.AssignedToUserId.Value;
            
            if (updateContactInquiryDto.Notes != null)
                inquiry.Notes = updateContactInquiryDto.Notes;

            inquiry.UpdatedAt = DateTime.UtcNow;

            // Set RespondedAt if status is being updated to InProgress or Resolved
            if (updateContactInquiryDto.Status.HasValue && 
                (updateContactInquiryDto.Status.Value == ContactInquiryStatus.InProgress || 
                 updateContactInquiryDto.Status.Value == ContactInquiryStatus.Resolved) &&
                inquiry.RespondedAt == null)
            {
                inquiry.RespondedAt = DateTime.UtcNow;
            }

            await _contactRepository.UpdateAsync(inquiry);

            _logger.LogInformation("Contact inquiry {InquiryId} updated", id);

            return _mapper.Map<ContactInquiryDto>(inquiry);
        }

        public async Task<bool> DeleteInquiryAsync(int id)
        {
            var inquiry = await _contactRepository.GetByIdAsync(id);
            if (inquiry == null) return false;

            await _contactRepository.DeleteAsync(inquiry);
            _logger.LogInformation("Contact inquiry {InquiryId} deleted", id);
            return true;
        }

        public async Task<bool> AssignInquiryAsync(int id, int userId)
        {
            return await _contactRepository.AssignToUserAsync(id, userId);
        }

        public async Task<ContactInquiryStatsDto> GetInquiryStatsAsync()
        {
            var allInquiries = await _contactRepository.GetAllAsync();
            var inquiriesList = allInquiries.ToList();

            var totalInquiries = inquiriesList.Count;
            var pendingInquiries = inquiriesList.Count(i => i.Status == ContactInquiryStatus.Pending);
            var inProgressInquiries = inquiriesList.Count(i => i.Status == ContactInquiryStatus.InProgress);
            var resolvedInquiries = inquiriesList.Count(i => i.Status == ContactInquiryStatus.Resolved);
            var highPriorityInquiries = inquiriesList.Count(i => i.Priority == ContactInquiryPriority.High || i.Priority == ContactInquiryPriority.Urgent);

            // Calculate average response time for resolved inquiries
            var resolvedWithResponseTime = inquiriesList
                .Where(i => i.Status == ContactInquiryStatus.Resolved && i.RespondedAt.HasValue)
                .ToList();

            double averageResponseTimeHours = 0;
            if (resolvedWithResponseTime.Any())
            {
                var totalResponseTime = resolvedWithResponseTime
                    .Sum(i => (i.RespondedAt!.Value - i.CreatedAt).TotalHours);
                averageResponseTimeHours = totalResponseTime / resolvedWithResponseTime.Count;
            }

            return new ContactInquiryStatsDto
            {
                TotalInquiries = totalInquiries,
                PendingInquiries = pendingInquiries,
                InProgressInquiries = inProgressInquiries,
                ResolvedInquiries = resolvedInquiries,
                HighPriorityInquiries = highPriorityInquiries,
                AverageResponseTimeHours = Math.Round(averageResponseTimeHours, 2)
            };
        }
    }
}
