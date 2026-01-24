using Products.Entities;
using Recipes.Entities;

namespace Recipes.Dto
{
    public class RecipeProductDto
    {
        public Product? Product { get; init; } = null;
        public decimal Quantity { get; set; }
        public Unit Unit { get; set; }
    }
}