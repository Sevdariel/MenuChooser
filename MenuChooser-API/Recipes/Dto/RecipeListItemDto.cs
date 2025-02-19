using Recipes.Entities;

namespace Recipes.Dto
{
    public class RecipeListItemDto
    {
        public string Id { get; set; } = null!;

        public string Name { get; set; } = null!;

        public int Duration { get; set; }

        public MealType MealType { get; set; }
    }
}
