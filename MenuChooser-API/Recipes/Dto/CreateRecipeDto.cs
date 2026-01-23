using Recipes.Entities;

namespace Recipes.Dto
{
    public class CreateRecipeDto
    {
        public string Name { get; set; } = null!;
        public int Duration { get; set; }
        public List<RecipeProduct> RecipeProducts { get; set; } = null!;
        public List<Step> Steps { get; set; } = null!;
        public MealType? MealType { get; set; }
        public string CreatedBy { get; set; } = null!;
    }
}
