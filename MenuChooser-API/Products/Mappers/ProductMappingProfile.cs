using AutoMapper;
using Products.Dto;
using Products.Entities;

namespace Products.Extensions
{
    public class ProductMappingProfile : Profile
    {
        public ProductMappingProfile()
        {
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
        }
    }
}
