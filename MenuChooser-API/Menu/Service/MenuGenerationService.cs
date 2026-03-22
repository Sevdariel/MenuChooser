using Menu.Entities;
using Recipes.Service;

namespace Menu;

public class MenuGenerationService
{
    private readonly IRecipeService _recipes;
    // private readonly IWeeklyMenuRepository _menus;
    private readonly IMealSlotRandomizer _randomizer;

    public async Task<WeeklyMenuDto> GenerateAsync(Guid userId, CancellationToken ct)
    {
        var recipes = await _recipes.GetRecipesAsync();

        // if (recipes.Count < 4)
        //     throw new DomainException("Za mało przepisów – potrzebne minimum 4.");

        var weekStart = DateOnly.FromDateTime(DateTime.Today).StartOfWeek();
        var menu = WeeklyMenu.Generate(userId, weekStart, recipes, _randomizer);

        // await _menus.SaveAsync(menu, ct);

        return WeeklyMenuDto.From(menu);
    }
}