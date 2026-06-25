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
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching product with ID: {ProductId}", id);
                return StatusCode(500, "An error occurred while fetching the product");
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            try
            {
                _logger.LogInformation("Fetching all products");
                var products = await _productService.GetProductsAsync();
                _logger.LogInformation("Retrieved {ProductCount} products", products.Count);

                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all products");
                return StatusCode(500, "An error occurred while fetching products");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(CreateProductDto createProductDto)
        {
            try
            {
                _logger.LogInformation("Creating product: {ProductName}", createProductDto.Name);
                var createdProduct = await _productService.CreateProductAsync(createProductDto);
                _logger.LogInformation("Product created successfully with ID: {ProductId}", createdProduct.Id);

                return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product: {ProductName}", createProductDto.Name);
                return StatusCode(500, "An error occurred during product creation");
            }
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateProduct(UpdateProductDto updatedProductDto)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product with ID: {ProductId}", updatedProductDto.Id);
                return StatusCode(500, "An error occurred during product update");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            try
            {
                _logger.LogInformation("Deleting product with ID: {ProductId}", id);
                await _productService.DeleteProductAsync(id);
                _logger.LogInformation("Product deleted successfully: {ProductId}", id);

                return Ok("Product delete sucessfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product with ID: {ProductId}", id);
                return StatusCode(500, "An error occurred during product deletion");
            }
        }

        [HttpGet("items")]
        public async Task<ActionResult<List<Product>>> SearchProductsByPattern([FromQuery] string searchPattern = "")
        {
            try
            {
                _logger.LogDebug("Searching products with pattern: {Pattern}", searchPattern);
                var result = await _productService.SearchProductsByPattern(searchPattern);
                _logger.LogDebug("Found {ProductCount} products matching pattern", result.Count);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with pattern: {Pattern}", searchPattern);
                return StatusCode(500, "An error occurred while searching products");
            }
        }

        [HttpPost("migrate-fields")]
        public async Task<IActionResult> MigrateProductFields()
        {
            try
            {
                _logger.LogInformation("Starting product fields migration");
                var result = await _productService.MigrateProductFieldsAsync();
                _logger.LogInformation("Product fields migration completed: {Count} products migrated", result);
                return Ok($"Migrated {result} products");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during product fields migration");
                return StatusCode(500, "An error occurred during product fields migration");
            }
        }
    }
}
