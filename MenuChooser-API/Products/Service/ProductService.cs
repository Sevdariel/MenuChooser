using Database.Data;
using MongoDB.Driver;
using Products.Dto;
using Products.Entities;

namespace Products.Service
{
    public class ProductService : IProductService
    {
        private readonly IMongoCollection<Product> _productCollection;

        public ProductService(DatabaseContext databaseContext)
        {
            _productCollection = databaseContext.GetMongoDatabase().GetCollection<Product>(DatabaseExtensions.CollectionName(GetType().Name));
        }

        public async Task<Product> GetProductByIdAsync(string id) => await _productCollection.Find(product => product.Id == id).FirstOrDefaultAsync();

        public async Task<Product> CreateProductAsync(Product product)
        {
            await _productCollection.InsertOneAsync(product);
            return product;
        }

        public async Task UpdateProductAsync(Product updatedProduct) => await _productCollection.ReplaceOneAsync(product => product.Id == updatedProduct.Id, updatedProduct);

        public async Task DeleteProductAsync(string id) => await _productCollection.DeleteOneAsync(product => product.Id == id);
    }
}