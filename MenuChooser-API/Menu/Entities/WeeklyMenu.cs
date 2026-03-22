using Recipes.Entities;

namespace Menu.Entities;

public class WeeklyMenu
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public DateOnly WeekStart { get; private set; }
    public IReadOnlyList<DailyMenu> Days { get; private set; }
    public DateTime GeneratedAt { get; private set; }

    private WeeklyMenu() { }

    public static WeeklyMenu Generate(
        Guid userId,
        DateOnly weekStart,
        IReadOnlyList<Recipe> availableRecipes,
        IMealSlotRandomizer randomizer)
    {
        var days = Enumerable.Range(0, 7)
            .Select(d => DailyMenu.Generate(weekStart.AddDays(d), availableRecipes, randomizer))
            .ToList();

        return new WeeklyMenu
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WeekStart = weekStart,
            Days = days,
            GeneratedAt = DateTime.UtcNow
        };
    }
}