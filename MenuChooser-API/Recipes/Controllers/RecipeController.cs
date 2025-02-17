using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recipes.Dto;
using Recipes.Entities;
using Recipes.Service;

namespace Recipes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class RecipeController : ControllerBase
    {
        private readonly RecipeService _recipeService;

        public RecipeController(RecipeService recipeService) => _recipeService = recipeService;

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateRecipe(CreateRecipeDto createRecipeDto)
        {
            var createdRecipe = await _recipeService.CreateRecipeAsync(createRecipeDto);

            return CreatedAtAction(nameof(GetRecipe), new {id = createdRecipe.Id}, createdRecipe);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(string id)
        {
            var recipe = await _recipeService.GetRecipeAsync(id);

            if (recipe == null)
            {
                return NotFound("Recipe doesn't exists");
            }

            return recipe;
        }

        [HttpGet]
        public async Task<ActionResult<List<Recipe>>> GetRecipes()
        {
            var recipes = await _recipeService.GetRecipesAsync();

            return recipes;
        }
    }
}
