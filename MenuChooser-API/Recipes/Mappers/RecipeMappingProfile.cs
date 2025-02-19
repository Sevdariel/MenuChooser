using AutoMapper;
using Recipes.Dto;
using Recipes.Entities;

namespace Recipes.Extensions
{
    public class RecipeMappingProfile : Profile
    {
        public RecipeMappingProfile()
        {
            CreateMap<CreateRecipeDto, Recipe>();
            CreateMap<UpdateRecipeDto, Recipe>();
            CreateMap<Recipe, RecipeListItemDto>();
        }
    }
}
