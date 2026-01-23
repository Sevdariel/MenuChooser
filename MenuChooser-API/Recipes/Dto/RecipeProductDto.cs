using Products.Entities;
using Recipes.Entities;

namespace Recipes.Dto
{
    public class RecipeProductDto
    {
        public Product? Products { get; init; } = null;
        public decimal Quantity { get; set; }
        public Unit Unit { get; set; }
    }
}