using Products.Dto;
using Products.Entities;

namespace Products.Service
{
    public interface IProductService
    {
        Task<Product> GetProductByIdAsync(string id);
        Task<List<Product>> GetProductsAsync();
        Task<Product> CreateProductAsync(CreateProductDto createProductDto);
        Task<bool> UpdateProductAsync(UpdateProductDto updatedProductDto);
        Task DeleteProductAsync(string id);
        Task<List<Product>> GetProductsByIdsAsync(List<string> ids);
    }
}