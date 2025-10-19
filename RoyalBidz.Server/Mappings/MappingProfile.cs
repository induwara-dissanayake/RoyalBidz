using AutoMapper;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.FirstName : null))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.LastName : null))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.Address : null))
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.City : null))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.State : null))
                .ForMember(dest => dest.ZipCode, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.ZipCode : null))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.Country : null))
                .ForMember(dest => dest.ProfileImageUrl, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.ProfileImageUrl : null))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.DateOfBirth : null))
                .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Profile != null ? src.Profile.Bio : null));
            
            CreateMap<UserProfile, UserDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.User.Role))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.User.Status))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.User.CreatedAt))
                .ForMember(dest => dest.LastLogin, opt => opt.MapFrom(src => src.User.LastLogin));
            
            CreateMap<CreateUserDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            CreateMap<UpdateUserDto, User>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UserPreferences, UserPreferencesDto>();
            CreateMap<UpdateUserPreferencesDto, UserPreferences>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UserActivity, UserActivityDto>();

            CreateMap<Notification, NotificationDto>();
            CreateMap<CreateNotificationDto, Notification>();

            CreateMap<Wishlist, WishlistDto>();
            
            CreateMap<PaymentMethod, PaymentMethodDto>();
            CreateMap<CreatePaymentMethodDto, PaymentMethod>();

            CreateMap<ContactInquiry, ContactInquiryDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority.ToString()));
            CreateMap<CreateContactInquiryDto, ContactInquiry>();
            CreateMap<UpdatePaymentMethodDto, PaymentMethod>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<JewelryItem, JewelryItemDto>();
            CreateMap<CreateJewelryItemDto, JewelryItem>();
            CreateMap<UpdateJewelryItemDto, JewelryItem>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<JewelryImage, JewelryImageDto>();
            CreateMap<CreateJewelryImageDto, JewelryImage>();

            CreateMap<Auction, AuctionDto>()
                .ForMember(dest => dest.TimeRemaining, opt => opt.MapFrom(src => 
                    src.Status == AuctionStatus.Active && src.EndTime > RoyalBidz.Server.Utils.TimeZoneHelper.GetColomboNow()
                        ? src.EndTime - RoyalBidz.Server.Utils.TimeZoneHelper.GetColomboNow()
                        : (TimeSpan?)null))
                .ForMember(dest => dest.TotalBids, opt => opt.MapFrom(src => src.Bids.Count))
                .ForMember(dest => dest.LeadingBidder, opt => opt.MapFrom(src => src.LeadingBidder));
            CreateMap<CreateAuctionDto, Auction>();
            CreateMap<UpdateAuctionDto, Auction>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Bid, BidDto>()
                .ForMember(dest => dest.AuctionTitle, opt => opt.MapFrom(src => src.Auction.Title))
                .ForMember(dest => dest.AuctionCurrentBid, opt => opt.MapFrom(src => src.Auction.CurrentBid))
                .ForMember(dest => dest.AuctionEndTime, opt => opt.MapFrom(src => src.Auction.EndTime))
                .ForMember(dest => dest.AuctionStatus, opt => opt.MapFrom(src => src.Auction.Status.ToString()))
                .ForMember(dest => dest.AuctionWinningBidderId, opt => opt.MapFrom(src => src.Auction.WinningBidderId))
                .ForMember(dest => dest.AuctionLeadingBidderId, opt => opt.MapFrom(src => src.Auction.LeadingBidderId))
                .ForMember(dest => dest.JewelryItemName, opt => opt.MapFrom(src => src.Auction.JewelryItem.Name))
                .ForMember(dest => dest.JewelryItemImageUrl, opt => opt.MapFrom(src => src.Auction.JewelryItem.Images.FirstOrDefault() != null ? src.Auction.JewelryItem.Images.FirstOrDefault()!.ImageUrl : ""))
                .ForMember(dest => dest.JewelryItemType, opt => opt.MapFrom(src => src.Auction.JewelryItem.Type.ToString()))
                .ForMember(dest => dest.JewelryItemMaterial, opt => opt.MapFrom(src => src.Auction.JewelryItem.PrimaryMaterial.ToString()))
                .ForMember(dest => dest.JewelryItemCondition, opt => opt.MapFrom(src => src.Auction.JewelryItem.Condition.ToString()));
            CreateMap<CreateBidDto, Bid>();

            CreateMap<Payment, PaymentDto>()
                .ForMember(dest => dest.AuctionTitle, opt => opt.MapFrom(src => src.Auction.Title));
            CreateMap<CreatePaymentDto, Payment>();
            CreateMap<UpdatePaymentDto, Payment>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}