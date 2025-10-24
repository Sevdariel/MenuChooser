using AutoMapper;
using Database.Data;
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

        public ProductService(MongoDBContext databaseContext, IMapper mapper)
        {
            _productCollection = databaseContext.GetMongoDatabase().GetCollection<Product>(MongoDBExtensions.CollectionName(GetType().Name));
            _mapper = mapper;
        }

        public async Task<Product> GetProductByIdAsync(string id) => await _productCollection.Find(product => product.Id == id).FirstOrDefaultAsync();

        public async Task<List<Product>> GetProductsAsync() => await _productCollection.Find(_ => true).ToListAsync();

        public async Task<Product> CreateProductAsync(CreateProductDto createProductDto)
        {
            var createProduct = _mapper.Map<Product>(createProductDto);

            await _productCollection.InsertOneAsync(createProduct);

            return createProduct;
        }

        public async Task<bool> UpdateProductAsync(UpdateProductDto updatedProductDto)
        {
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

            return result.ModifiedCount > 0;
        }

        public async Task DeleteProductAsync(string id) => await _productCollection.DeleteOneAsync(product => product.Id == id);

        public async Task<List<Product>> GetProductsByIdsAsync(List<string> ids)
        {
            var filter = Builders<Product>.Filter.In(product => product.Id, ids);

            return await _productCollection.Find(filter).ToListAsync();
        }

        public async Task<List<Product>> SearchProductsByPattern(string pattern)
        {
            if (string.IsNullOrWhiteSpace(pattern))
                return await _productCollection.Find(_ => true).Limit(10).ToListAsync();
            
            var filter = Builders<Product>.Filter.Regex("name", new MongoDB.Bson.BsonRegularExpression(pattern, "i"));

            return await _productCollection.Find(filter).ToListAsync();
        }
    }
}