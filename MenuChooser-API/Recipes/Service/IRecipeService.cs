using Recipes.Dto;
using Recipes.Entities;

namespace Recipes.Service
{
    public interface IRecipeService
    {
        Task<Recipe> GetRecipeByIdAsync(string id);
        Task<List<Recipe>> GetRecipesAsync();
        Task<Recipe> CreateRecipeAsync(CreateRecipeDto createRecipeDto);

        Task DeleteRecipeAsync(string id);
        Task<bool> UpdateRecipeAsync(UpdateRecipeDto updateRecipeDto, Recipe recipe);
    }
}
