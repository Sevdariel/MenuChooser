using Products.Entities;

namespace Recipe.Entities
{
    public class Recipe
    {
        public string Name { get; set; } = null!;
        public int Duration { get; set; }
        public List<Product> Products { get; set; } = null!;
        public MealType MealType { get; set; }
        public List<Step> Steps { get; set; } = null!;
    }
}
