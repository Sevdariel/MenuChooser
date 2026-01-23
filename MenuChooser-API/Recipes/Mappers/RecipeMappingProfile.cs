using AutoMapper;
using Products.Entities;
using Recipes.Dto;
using Recipes.Entities;

namespace Recipes.Mappers
{
    public class RecipeMappingProfile : Profile
    {
        public RecipeMappingProfile()
        {
            CreateMap<CreateRecipeDto, Recipe>();
            CreateMap<UpdateRecipeDto, Recipe>();
            CreateMap<Recipe, RecipeListItemDto>();
            CreateMap<Recipe, RecipeDto>();
            CreateMap<List<Product>, RecipeProductDto>();
        }
    }
}
