using Menu.Entities;
using Menu.Mapper;
using PdfCreator.Services;
using Recipes.Service;

namespace Menu.Service;

public class MenuGenerationService(
    IMealSlotRandomizer mealSlotRandomizer,
    IPdfCreatorService pdfCreatorService,
    IRecipeService recipeService)
    : IMenuGenerationService
{
    // private readonly IWeeklyMenuRepository _menus;

    public async Task<byte[]> GenerateAsync(CancellationToken ct)
    {
        var recipes = await recipeService.GetRecipesAsync();

        var weekStart = DateOnly.FromDateTime(DateTime.Today);
        var menu = WeeklyMenu.Generate(weekStart, recipes, mealSlotRandomizer);

        var pdfDocument = MenuPdfMapper.ToPdfDocument(menu);
        return pdfCreatorService.Generate(pdfDocument);
    }
}