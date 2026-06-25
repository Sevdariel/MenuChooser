using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Products.Service;
using Recipes.Dto;
using Recipes.Service;

namespace Recipes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class RecipeController(IRecipeService recipeService, IMapper mapper, IProductService productService, ILogger<RecipeController> logger)
        : ControllerBase
    {
        private readonly IRecipeService _recipeService = recipeService;
        private readonly IMapper _mapper = mapper;
        private readonly IProductService _productService = productService;
        private readonly ILogger<RecipeController> _logger = logger;

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateRecipe(CreateRecipeDto createRecipeDto)
        {
            _logger.LogInformation("Creating recipe: {RecipeName}", createRecipeDto.Name);
            var createdRecipe = await _recipeService.CreateRecipeAsync(createRecipeDto);
            _logger.LogInformation("Recipe created successfully with ID: {RecipeId}", createdRecipe.Id);

            return CreatedAtAction(nameof(GetRecipe), new { id = createdRecipe.Id }, createdRecipe);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeDto>> GetRecipe(string id)
        {
            _logger.LogDebug("Fetching recipe with ID: {RecipeId}", id);
            var recipe = await _recipeService.GetRecipeByIdAsync(id);

            if (recipe == null)
            {
                _logger.LogWarning("Recipe not found with ID: {RecipeId}", id);
                return NotFound("Recipe doesn't exists");
            }

            var products =
                await _productService.GetProductsByIdsAsync(recipe.RecipeProducts
                    .Select(recipeProduct => recipeProduct.ProductId)
                    .Where(id => id != null)
                    .Select(id => id!)
                    .ToList());

            var recipeDto = _mapper.Map<RecipeDto>(recipe);
            
            var recipeProductsDto = recipe.RecipeProducts
                .Select(rp =>
                {
                    var product = products.First(p => p.Id == rp.ProductId);

                    return new RecipeProductDto
                    {
                        Product = product,
                        Quantity = rp.Quantity,
                        Unit = rp.Unit
                    };
                })
                .ToList();
            recipeDto.Products = recipeProductsDto;
            _logger.LogDebug("Recipe fetched successfully: {RecipeName}", recipe.Name);
            return recipeDto;
        }

        [HttpGet]
        public async Task<ActionResult<List<RecipeListItemDto>>> GetRecipes(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Fetching all recipes");
            var recipes = await _recipeService.GetRecipesAsync(cancellationToken);
            _logger.LogInformation("Retrieved {RecipeCount} recipes", recipes.Count);

            var recipeListItems = _mapper.Map<List<RecipeListItemDto>>(recipes);

            return recipeListItems;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(string id)
        {
            _logger.LogInformation("Deleting recipe with ID: {RecipeId}", id);
            await _recipeService.DeleteRecipeAsync(id);
            _logger.LogInformation("Recipe deleted successfully: {RecipeId}", id);

            return NoContent();
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateRecipe(UpdateRecipeDto updatedRecipeDto)
        {
            _logger.LogInformation("Updating recipe with ID: {RecipeId}", updatedRecipeDto.Id);
            var recipe = await _recipeService.GetRecipeByIdAsync(updatedRecipeDto.Id);

            if (recipe == null)
            {
                _logger.LogWarning("Recipe not found for update: {RecipeId}", updatedRecipeDto.Id);
                return NotFound("Recipe doesn't exist");
            }

            var result = await _recipeService.UpdateRecipeAsync(updatedRecipeDto, recipe);
            _logger.LogInformation("Recipe updated successfully: {RecipeId}", updatedRecipeDto.Id);

            return Ok(result);
        }

        [HttpPost("migrate-tags")]
        [AllowAnonymous]
        public async Task<IActionResult> MigrateTags()
        {
            _logger.LogInformation("Starting recipe tags migration");
            var result = await _recipeService.MigrateTagsAsync();
            _logger.LogInformation("Recipe tags migration completed: {Count} recipes migrated", result);
            return Ok($"Migrated {result} recipes");
        }

        [HttpGet("by-product/{productId}")]
        public async Task<ActionResult<List<RecipeListItemDto>>> GetRecipesByProductId(string productId)
        {
            _logger.LogDebug("Fetching recipes by product ID: {ProductId}", productId);
            var recipes = await _recipeService.GetRecipesByProductIdAsync(productId);
            var recipeListItems = _mapper.Map<List<RecipeListItemDto>>(recipes);
            _logger.LogDebug("Found {RecipeCount} recipes for product {ProductId}", recipes.Count, productId);
            return recipeListItems;
        }
    }
}
