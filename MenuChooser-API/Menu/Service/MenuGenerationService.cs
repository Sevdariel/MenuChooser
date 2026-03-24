using Menu.Entities;
using Recipes.Service;

namespace Menu.Service;

public class MenuGenerationService : IMenuGenerationService
{
    private readonly IRecipeService _recipes;
    // private readonly IWeeklyMenuRepository _menus;
    private readonly IMealSlotRandomizer _randomizer;

    public async Task<WeeklyMenuDto> GenerateAsync(CancellationToken cancellationToken)
    {
        var recipes = await _recipes.GetRecipesAsync();

        // if (recipes.Count < 4)
        //     throw new DomainException("Za mało przepisów – potrzebne minimum 4.");

        var weekStart = DateOnly.FromDateTime(DateTime.Today);
        var menu = WeeklyMenu.Generate(weekStart, recipes, _randomizer);

        // await _menus.SaveAsync(menu, ct);

        return WeeklyMenuDto.From(menu);
    }
}