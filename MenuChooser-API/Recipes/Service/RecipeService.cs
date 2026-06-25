using AutoMapper;
using Database.Data;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Recipes.Dto;
using Recipes.Entities;

namespace Recipes.Service
{
    public class RecipeService : IRecipeService
    {
        private readonly IMongoCollection<Recipe> _recipeCollection;
        private readonly IMapper _mapper;
        private readonly ILogger<RecipeService> _logger;

        public RecipeService(MongoDBContext databaseContext, IMapper mapper, ILogger<RecipeService> logger)
        {
            _recipeCollection = databaseContext.GetMongoDatabase().GetCollection<Recipe>(MongoDBExtensions.CollectionName(GetType().Name));
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Recipe> CreateRecipeAsync(CreateRecipeDto createRecipeDto)
        {
            _logger.LogInformation("Creating recipe: {RecipeName}", createRecipeDto.Name);
            var createRecipe = _mapper.Map<Recipe>(createRecipeDto);

            await _recipeCollection.InsertOneAsync(createRecipe);
            _logger.LogInformation("Recipe created successfully: {RecipeId}", createRecipe.Id);

            return createRecipe;
        }

        public async Task<Recipe> GetRecipeByIdAsync(string id)
        {
            _logger.LogDebug("Fetching recipe by ID: {RecipeId}", id);
            return await _recipeCollection.Find(recipe => recipe.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Recipe>> GetRecipesAsync(CancellationToken cancellationToken = default)
        {
            _logger.LogDebug("Fetching all recipes");
            var recipes = await _recipeCollection.Find(_ => true).ToListAsync(cancellationToken);
            _logger.LogDebug("Retrieved {RecipeCount} recipes", recipes.Count);
            return recipes;
        }

        public async Task DeleteRecipeAsync(string id)
        {
            _logger.LogInformation("Deleting recipe: {RecipeId}", id);
            await _recipeCollection.DeleteOneAsync(recipe => recipe.Id == id);
            _logger.LogInformation("Recipe deleted successfully: {RecipeId}", id);
        }

        public async Task<bool> UpdateRecipeAsync(UpdateRecipeDto updateRecipeDto, Recipe existingRecipe)
        {
            _logger.LogInformation("Updating recipe: {RecipeId}", updateRecipeDto.Id);
            var filter = Builders<Recipe>.Filter.Eq(recipe => recipe.Id, updateRecipeDto.Id);

            var updatedRecipe = _mapper.Map(updateRecipeDto, existingRecipe);

            var update = Builders<Recipe>.Update
                .Set(r => r.Name, updatedRecipe.Name)
                .Set(r => r.Duration, updatedRecipe.Duration)
                .Set(r => r.RecipeProducts, updatedRecipe.RecipeProducts)
                .Set(r => r.Steps, updatedRecipe.Steps)
                .Set(r => r.MealType, updatedRecipe.MealType)
                .Set(r => r.Tags, updatedRecipe.Tags)
                .Set(r => r.UpdatedBy, updatedRecipe.UpdatedBy)
                .Set(r => r.Servings, updatedRecipe.Servings)
                .Set(r => r.CaloriesPerServing, updatedRecipe.CaloriesPerServing);

            var result = await _recipeCollection.UpdateOneAsync(filter, update);
            _logger.LogInformation("Recipe update result: {ModifiedCount} documents modified", result.ModifiedCount);

            return result.ModifiedCount > 0;
        }

        public async Task<int> MigrateTagsAsync()
        {
            _logger.LogInformation("Starting recipe migration");
            var filter = Builders<Recipe>.Filter.Or(
                Builders<Recipe>.Filter.Exists("servings", false),
                Builders<Recipe>.Filter.Exists("caloriesPerServing", false)
            );
            var update = Builders<Recipe>.Update
                .Set("servings", 4)
                .Set("caloriesPerServing", 520);
            var result = await _recipeCollection.UpdateManyAsync(filter, update);
            _logger.LogInformation("Recipe migration completed: {Count} recipes migrated", result.ModifiedCount);
            return (int)result.ModifiedCount;
        }

        public async Task<List<Recipe>> GetRecipesByProductIdAsync(string productId)
        {
            _logger.LogDebug("Fetching recipes by product ID: {ProductId}", productId);
            var filter = Builders<Recipe>.Filter.ElemMatch(
                recipe => recipe.RecipeProducts,
                rp => rp.ProductId == productId
            );
            var recipes = await _recipeCollection.Find(filter).ToListAsync();
            _logger.LogDebug("Found {RecipeCount} recipes for product {ProductId}", recipes.Count, productId);
            return recipes;
        }
    }
}
