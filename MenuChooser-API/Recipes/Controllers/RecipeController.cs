﻿using AutoMapper;
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
        private readonly IMapper _mapper;

        public RecipeController(RecipeService recipeService, IMapper mapper)
        {
            _recipeService = recipeService;
            _mapper = mapper;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateRecipe(CreateRecipeDto createRecipeDto)
        {
            var createdRecipe = await _recipeService.CreateRecipeAsync(createRecipeDto);

            return CreatedAtAction(nameof(GetRecipe), new { id = createdRecipe.Id }, createdRecipe);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(string id)
        {
            var recipe = await _recipeService.GetRecipeByIdAsync(id);

            if (recipe == null)
            {
                return NotFound("Recipe doesn't exists");
            }

            return recipe;
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
