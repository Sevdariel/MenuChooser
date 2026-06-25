using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Products.Dto;
using Products.Entities;
using Products.Service;

namespace Products.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductController> _logger;
        
        public ProductController(IProductService productService, ILogger<ProductController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(string id)
        {
            _logger.LogDebug("Fetching product with ID: {ProductId}", id);
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                _logger.LogWarning("Product not found with ID: {ProductId}", id);
                return NotFound("Product doesn't exist");
            }

            return product;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            _logger.LogInformation("Fetching all products");
            var products = await _productService.GetProductsAsync();
            _logger.LogInformation("Retrieved {ProductCount} products", products.Count);

            return products;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(CreateProductDto createProductDto)
        {
            _logger.LogInformation("Creating product: {ProductName}", createProductDto.Name);
            var createdProduct = await _productService.CreateProductAsync(createProductDto);
            _logger.LogInformation("Product created successfully with ID: {ProductId}", createdProduct.Id);

            return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateProduct(UpdateProductDto updatedProductDto)
        {
            _logger.LogInformation("Updating product with ID: {ProductId}", updatedProductDto.Id);
            var product = await _productService.GetProductByIdAsync(updatedProductDto.Id);

            if (product == null)
            {
                _logger.LogWarning("Product not found for update: {ProductId}", updatedProductDto.Id);
                return NotFound("Product doesn't exist");
            }

            var result = await _productService.UpdateProductAsync(updatedProductDto);
            _logger.LogInformation("Product updated successfully: {ProductId}", updatedProductDto.Id);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            _logger.LogInformation("Deleting product with ID: {ProductId}", id);
            await _productService.DeleteProductAsync(id);
            _logger.LogInformation("Product deleted successfully: {ProductId}", id);

            return Ok("Product delete sucessfully");
        }

        [HttpGet("items")]
        public async Task<ActionResult<List<Product>>> SearchProductsByPattern([FromQuery] string searchPattern = "")
        {
            _logger.LogDebug("Searching products with pattern: {Pattern}", searchPattern);
            var result = await _productService.SearchProductsByPattern(searchPattern);
            _logger.LogDebug("Found {ProductCount} products matching pattern", result.Count);

            return Ok(result);
        }

        [HttpPost("migrate-fields")]
        public async Task<IActionResult> MigrateProductFields()
        {
            _logger.LogInformation("Starting product fields migration");
            var result = await _productService.MigrateProductFieldsAsync();
            _logger.LogInformation("Product fields migration completed: {Count} products migrated", result);
            return Ok($"Migrated {result} products");
        }
    }
}
