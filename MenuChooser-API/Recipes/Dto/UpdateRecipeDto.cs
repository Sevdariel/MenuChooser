using Recipes.Entities;

namespace Recipes.Dto
{
    public class UpdateRecipeDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int Duration { get; set; }
        public List<string> ProductsId { get; set; } = null!;
        public List<Step> Steps { get; set; } = null!;
        public MealType? MealType { get; set; }
        public string UpdatedBy { get; set; } = null!;
    }
}
