using AutoMapper;
using Database.Data;
using MongoDB.Driver;
using Recipes.Dto;
using Recipes.Entities;

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

        public async Task<Recipe> GetRecipeAsync(string id) => await _recipeCollection.Find(recipe => recipe.Id == id).FirstOrDefaultAsync();

        public async Task<List<Recipe>> GetRecipesAsync() => await _recipeCollection.Find(_ => true).ToListAsync();
    }
}
