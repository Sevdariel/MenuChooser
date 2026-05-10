using Recipes.Entities;

namespace Menu.Entities;

public class DailyMenu
{
    public DateOnly Date { get; private set; }
    public IReadOnlyList<MealSlot> Meals { get; private set; }

    public static DailyMenu Generate(
        DateOnly date,
        IReadOnlyList<Recipe> recipes,
        IMealSlotRandomizer randomizer,
        IReadOnlyList<MealConfig> mealConfigs)
    {
        var enabledMeals = mealConfigs.Where(m => m.Enabled).ToList();
        var picks = randomizer.PickDistinct(recipes, count: enabledMeals.Count);

        var meals = enabledMeals.Select((config, index) => new MealSlot
        {
            Type = config.Type,
            Name = config.Name,
            Time = config.Time,
            Recipe = picks[index]
        }).ToList();

        return new DailyMenu
        {
            Date = date,
            Meals = meals
        };
    }
}

public class MealSlot
{
    public MealType Type { get; init; }
    public string Name { get; init; }
    public string Time { get; init; }
    public Recipe Recipe { get; init; }
}