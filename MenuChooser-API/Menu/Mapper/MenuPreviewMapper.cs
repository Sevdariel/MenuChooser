using Menu.Dto;
using Menu.Entities;
using Recipes.Entities;

namespace Menu.Mapper;

public static class MenuPreviewMapper
{
    public static MenuPreviewDto ToPreviewDto(WeeklyMenu menu)
    {
        return new MenuPreviewDto(
            Id: menu.Id,
            WeekStart: menu.WeekStart,
            Days: menu.Days.Select(ToDailyMenuDto).ToList()
        );
    }

    private static DailyMenuDto ToDailyMenuDto(DailyMenu day)
    {
        return new DailyMenuDto(
            Date: day.Date,
            Meals: day.Meals.Select(ToMealSlotDto).ToList()
        );
    }

    private static MealSlotDto ToMealSlotDto(MealSlot meal)
    {
        return new MealSlotDto(
            Type: meal.Type,
            Name: meal.Name,
            Time: meal.Time,
            Recipe: ToRecipeDto(meal.Recipe)
        );
    }

    private static RecipeDto ToRecipeDto(Recipe recipe)
    {
        return new RecipeDto(
            Id: recipe.Id ?? string.Empty,
            Name: recipe.Name,
            Duration: recipe.Duration,
            MealType: recipe.MealType,
            Tags: recipe.Tags?.ToList() ?? new List<RecipeTag>()
        );
    }
}
