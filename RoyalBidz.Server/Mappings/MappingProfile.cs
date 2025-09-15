using AutoMapper;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;

namespace RoyalBidz.Server.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<CreateUserDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            CreateMap<UpdateUserDto, User>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<JewelryItem, JewelryItemDto>();
            CreateMap<CreateJewelryItemDto, JewelryItem>();
            CreateMap<UpdateJewelryItemDto, JewelryItem>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<JewelryImage, JewelryImageDto>();
            CreateMap<CreateJewelryImageDto, JewelryImage>();

            CreateMap<Auction, AuctionDto>()
                .ForMember(dest => dest.TimeRemaining, opt => opt.MapFrom(src => 
                    src.Status == AuctionStatus.Active && src.EndTime > DateTime.UtcNow 
                        ? src.EndTime - DateTime.UtcNow 
                        : (TimeSpan?)null))
                .ForMember(dest => dest.TotalBids, opt => opt.MapFrom(src => src.Bids.Count));
            CreateMap<CreateAuctionDto, Auction>();
            CreateMap<UpdateAuctionDto, Auction>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Bid, BidDto>()
                .ForMember(dest => dest.AuctionTitle, opt => opt.MapFrom(src => src.Auction.Title));
            CreateMap<CreateBidDto, Bid>();

            CreateMap<Payment, PaymentDto>()
                .ForMember(dest => dest.AuctionTitle, opt => opt.MapFrom(src => src.Auction.Title));
            CreateMap<CreatePaymentDto, Payment>();
            CreateMap<UpdatePaymentDto, Payment>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}