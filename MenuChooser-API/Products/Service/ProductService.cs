using AutoMapper;
using Database.Data;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Products.Dto;
using Products.Entities;
using System.Reflection;

namespace Products.Service
{
    public class ProductService : IProductService
    {
        private readonly IMongoCollection<Product> _productCollection;
        private readonly IMapper _mapper;
        private readonly ILogger<ProductService> _logger;

        public ProductService(MongoDBContext databaseContext, IMapper mapper, ILogger<ProductService> logger)
        {
            _productCollection = databaseContext.GetMongoDatabase().GetCollection<Product>(MongoDBExtensions.CollectionName(GetType().Name));
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Product> GetProductByIdAsync(string id)
        {
            try
            {
                _logger.LogDebug("Fetching product by ID: {ProductId}", id);
                return await _productCollection.Find(product => product.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching product by ID: {ProductId}", id);
                throw;
            }
        }

        public async Task<List<Product>> GetProductsAsync()
        {
            try
            {
                _logger.LogDebug("Fetching all products");
                var products = await _productCollection.Find(_ => true).ToListAsync();
                _logger.LogDebug("Retrieved {ProductCount} products", products.Count);
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all products");
                throw;
            }
        }

        public async Task<Product> CreateProductAsync(CreateProductDto createProductDto)
        {
            try
            {
                _logger.LogInformation("Creating product: {ProductName}", createProductDto.Name);
                var createProduct = _mapper.Map<Product>(createProductDto);

                await _productCollection.InsertOneAsync(createProduct);
                _logger.LogInformation("Product created successfully: {ProductId}", createProduct.Id);

                return createProduct;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product: {ProductName}", createProductDto.Name);
                throw;
            }
        }

        public async Task<bool> UpdateProductAsync(UpdateProductDto updatedProductDto)
        {
            try
            {
                _logger.LogInformation("Updating product: {ProductId}", updatedProductDto.Id);
                var filter = Builders<Product>.Filter.Eq(product => product.Id, updatedProductDto.Id);

                var updatedProduct = _mapper.Map<Product>(updatedProductDto);

                var updateDefinitions = new List<UpdateDefinition<Product>>();

                foreach (PropertyInfo prop in typeof(UpdateProductDto).GetProperties())
                {
                    var newValue = prop.GetValue(updatedProductDto);
                    if (newValue != null)
                        updateDefinitions.Add(Builders<Product>.Update.Set(prop.Name, newValue));
                }

                if (!updateDefinitions.Any()) return false;

                var update = Builders<Product>.Update.Combine(updateDefinitions);

                var result = await _productCollection.UpdateOneAsync(filter, update);
                _logger.LogInformation("Product update result: {ModifiedCount} documents modified", result.ModifiedCount);

                return result.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product: {ProductId}", updatedProductDto.Id);
                throw;
            }
        }

        public async Task DeleteProductAsync(string id)
        {
            try
            {
                _logger.LogInformation("Deleting product: {ProductId}", id);
                await _productCollection.DeleteOneAsync(product => product.Id == id);
                _logger.LogInformation("Product deleted successfully: {ProductId}", id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product: {ProductId}", id);
                throw;
            }
        }

        public async Task<List<Product>> GetProductsByIdsAsync(List<string> ids)
        {
            try
            {
                _logger.LogDebug("Fetching {Count} products by IDs", ids.Count);
                var filter = Builders<Product>.Filter.In(product => product.Id, ids);
                var products = await _productCollection.Find(filter).ToListAsync();
                _logger.LogDebug("Retrieved {ProductCount} products", products.Count);
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching products by IDs");
                throw;
            }
        }

        public async Task<List<Product>> SearchProductsByPattern(string pattern)
        {
            try
            {
                _logger.LogDebug("Searching products with pattern: {Pattern}", pattern);
                List<Product> products;
                if (string.IsNullOrWhiteSpace(pattern))
                {
                    products = await _productCollection.Find(_ => true).Limit(10).ToListAsync();
                }
                else
                {
                    var filter = Builders<Product>.Filter.Regex("name", new MongoDB.Bson.BsonRegularExpression(pattern, "i"));
                    products = await _productCollection.Find(filter).ToListAsync();
                }
                _logger.LogDebug("Found {ProductCount} products matching pattern", products.Count);
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with pattern: {Pattern}", pattern);
                throw;
            }
        }

        public async Task<int> MigrateProductFieldsAsync()
        {
            try
            {
                _logger.LogInformation("Starting product fields migration");
                var filter = Builders<Product>.Filter.Or(
                    Builders<Product>.Filter.Exists("sub", false),
                    Builders<Product>.Filter.Exists("emoji", false),
                    Builders<Product>.Filter.Exists("category", false),
                    Builders<Product>.Filter.Exists("unit", false),
                    Builders<Product>.Filter.Exists("kcal", false),
                    Builders<Product>.Filter.Exists("protein", false),
                    Builders<Product>.Filter.Exists("carbs", false),
                    Builders<Product>.Filter.Exists("fat", false)
                );
                var update = Builders<Product>.Update
                    .Set("sub", "")
                    .Set("emoji", "🥗")
                    .Set("category", ProductCategory.Other)
                    .Set("unit", "g")
                    .Set("kcal", 100)
                    .Set("protein", 0.0)
                    .Set("carbs", 0.0)
                    .Set("fat", 0.0);
                var result = await _productCollection.UpdateManyAsync(filter, update);
                _logger.LogInformation("Product fields migration completed: {Count} products migrated", result.ModifiedCount);
                return (int)result.ModifiedCount;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during product fields migration");
                throw;
            }
        }
    }
}