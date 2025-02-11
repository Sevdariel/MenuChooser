using Microsoft.AspNetCore.Mvc;
using Products.Dto;
using Products.Entities;
using Products.Service;

namespace Products.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;
        public ProductController(ProductService productService) => _productService = productService;

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(string id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound("Product doesn't exist");
            }

            return product;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await _productService.GetProductsAsync();

            return products;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(CreateProductDto createProductDto)
        {
            var createdProduct = await _productService.CreateProductAsync(createProductDto);

            return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateProduct(UpdateProductDto updatedProductDto)
        {
            var product = await _productService.GetProductByIdAsync(updatedProductDto.Id);

            if (product == null)
                return NotFound("Product doesn't exist");

            var result = await _productService.UpdateProductAsync(updatedProductDto);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            await _productService.DeleteProductAsync(id);

            return Ok("Product delete sucessfully");
        }
    }
}