using Recipes.Dto;
using Recipes.Entities;

namespace Recipes.Service
{
    public interface IRecipeService
    {
        Task<Recipe> GetRecipeAsync(string id);
        Task<List<Recipe>> GetRecipesAsync();
        Task<Recipe> CreateRecipeAsync(CreateRecipeDto createRecipeDto);
    }
}
