using Recipes.Entities;

namespace Menu.Dto;

public record MenuPreviewDto(
    Guid Id,
    DateOnly WeekStart,
    List<DailyMenuDto> Days
);

public record DailyMenuDto(
    DateOnly Date,
    List<MealSlotDto> Meals
);

public record MealSlotDto(
    MealType Type,
    string Name,
    string Time,
    RecipeDto Recipe
);

public record RecipeDto(
    string Id,
    string Name,
    int Duration,
    MealType? MealType,
    List<RecipeTag> Tags,
    int? CaloriesPerServing,
    string? Description,
    List<string> Ingredients
);
