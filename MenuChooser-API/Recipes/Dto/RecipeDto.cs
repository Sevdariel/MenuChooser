using Recipes.Entities;

namespace Recipes.Dto
{
    public class RecipeDto
    {
        public string? Id { get; set; }
        public string Name { get; set; } = null!;
        public int Duration { get; set; }
        public List<RecipeProductDto> Products { get; set; } = null!;
        public MealType? MealType { get; set; }
        public List<Step> Steps { get; set; } = null!;
        public string CreatedBy { get; set; } = null!;
        public string UpdatedBy { get; set; } = null!;
    }
}
