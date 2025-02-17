using Recipes.Entities;

namespace Recipes.Dto
{
    public class CreateRecipeDto
    {
        public string Name { get; set; } = null!;
        public int Duration { get; set; }
        public List<string> ProductsId { get; set; } = null!;
        public List<Step> Steps { get; set; } = null!;
        public MealType MealType { get; set; }
    }
}
