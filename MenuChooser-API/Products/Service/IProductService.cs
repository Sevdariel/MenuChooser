using Products.Dto;
using Products.Entities;

namespace Products.Service
{
    public interface IProductService
    {
        Task<Product> GetProductByIdAsync(string id);
        Task<Product> CreateProductAsync(Product product);
        Task UpdateProductAsync(Product product);
        Task DeleteProductAsync(string id);
    }
}