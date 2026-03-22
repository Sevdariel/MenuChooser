using Recipes.Entities;

namespace Menu.Entities;

public class DailyMenu
{
    public DateOnly Date { get; private set; }
    public Recipe Breakfast { get; private set; }
    public Recipe Lunch { get; private set; }
    public Recipe Dinner { get; private set; }
    public Recipe Supper { get; private set; }

    public static DailyMenu Generate(
        DateOnly date,
        IReadOnlyList<Recipe> recipes,
        IMealSlotRandomizer randomizer)
    {
        // losowanie 4 różnych przepisów na ten dzień
        var picks = randomizer.PickDistinct(recipes, count: 4);
        return new DailyMenu
        {
            Date = date,
            Breakfast = picks[0],
            Lunch = picks[1],
            Dinner = picks[2],
            Supper = picks[3]
        };
    }
}