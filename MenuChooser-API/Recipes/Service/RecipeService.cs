using AutoMapper;
using Database.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;
using Products.Dto;
using Products.Entities;
using Recipes.Dto;
using Recipes.Entities;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace Recipes.Service
{
    public class RecipeService : IRecipeService
    {
        private readonly IMongoCollection<Recipe> _recipeCollection;
        private readonly IMapper _mapper;

        public RecipeService(MongoDBContext databaseContext, IMapper mapper)
        {
            _recipeCollection = databaseContext.GetMongoDatabase().GetCollection<Recipe>(MongoDBExtensions.CollectionName(GetType().Name));
            _mapper = mapper;
        }

        public async Task<Recipe> CreateRecipeAsync(CreateRecipeDto createRecipeDto)
        {
            var createRecipe = _mapper.Map<Recipe>(createRecipeDto);

            await _recipeCollection.InsertOneAsync(createRecipe);

            return createRecipe;
        }

        public async Task<Recipe> GetRecipeByIdAsync(string id) => await _recipeCollection.Find(recipe => recipe.Id == id).FirstOrDefaultAsync();

        public async Task<List<Recipe>> GetRecipesAsync() => await _recipeCollection.Find(_ => true).ToListAsync();

        public async Task DeleteRecipeAsync(string id) => await _recipeCollection.DeleteOneAsync(recipe => recipe.Id == id);

        public async Task<bool> UpdateRecipeAsync(UpdateRecipeDto updateRecipeDto, Recipe existingRecipe)
        {
            var filter = Builders<Recipe>.Filter.Eq(product => product.Id, updateRecipeDto.Id);

            var updatedRecipe= _mapper.Map(updateRecipeDto, existingRecipe);

            var updateDefinitions = new List<UpdateDefinition<Recipe>>();

            foreach (PropertyInfo prop in typeof(UpdateRecipeDto).GetProperties())
            {
                var newValue = prop.GetValue(updateRecipeDto);
                if (newValue != null)
                    updateDefinitions.Add(Builders<Recipe>.Update.Set(prop.Name, newValue));
            }

            if (!updateDefinitions.Any()) return false;

            var update = Builders<Recipe>.Update.Combine(updateDefinitions);

            var result = await _recipeCollection.UpdateOneAsync(filter, update);

            return result.ModifiedCount > 0;
        }
    }
}
