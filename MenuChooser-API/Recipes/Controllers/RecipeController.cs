using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Products.Service;
using Recipes.Dto;
using Recipes.Service;

namespace Recipes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class RecipeController(RecipeService recipeService, IMapper mapper, ProductService productService)
        : ControllerBase
    {
        private readonly RecipeService _recipeService = recipeService;
        private readonly IMapper _mapper = mapper;
        private readonly ProductService _productService = productService;

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateRecipe(CreateRecipeDto createRecipeDto)
        {
            var createdRecipe = await _recipeService.CreateRecipeAsync(createRecipeDto);

            return CreatedAtAction(nameof(GetRecipe), new { id = createdRecipe.Id }, createdRecipe);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeDto>> GetRecipe(string id)
        {
            var recipe = await _recipeService.GetRecipeByIdAsync(id);

            if (recipe == null)
                return NotFound("Recipe doesn't exists");

            var products =
                await _productService.GetProductsByIdsAsync(recipe.RecipeProducts
                    .Select(recipeProduct => recipeProduct.ProductId).ToList());

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

            return recipeDto;
        }

        [HttpGet]
        public async Task<ActionResult<List<RecipeListItemDto>>> GetRecipes()
        {
            var recipes = await _recipeService.GetRecipesAsync();

            var recipeListItems = _mapper.Map<List<RecipeListItemDto>>(recipes);

            return recipeListItems;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(string id)
        {
            await _recipeService.DeleteRecipeAsync(id);

            return Ok("Recipe delete sucessfully");
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateRecipe(UpdateRecipeDto updatedRecipeDto)
        {
            var recipe = await _recipeService.GetRecipeByIdAsync(updatedRecipeDto.Id);

            if (recipe == null)
                return NotFound("Recipe doesn't exist");

            var result = await _recipeService.UpdateRecipeAsync(updatedRecipeDto, recipe);

            return Ok(result);
        }
    }
}