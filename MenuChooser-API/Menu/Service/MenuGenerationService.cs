using Menu.Dto;
using Menu.Entities;
using Menu.Mapper;
using Microsoft.Extensions.Logging;
using PdfCreator.Services;
using Recipes.Service;

namespace Menu.Service;

public class MenuGenerationService(
    IMealSlotRandomizer mealSlotRandomizer,
    IPdfCreatorService pdfCreatorService,
    IRecipeService recipeService,
    ILogger<MenuGenerationService> logger)
    : IMenuGenerationService
{
    private readonly ILogger<MenuGenerationService> _logger = logger;
    // private readonly IWeeklyMenuRepository _menus;

    public async Task<byte[]> GenerateAsync(MenuGenerateRequest menuGenerateRequest,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Starting menu generation");
            var recipes = await recipeService.GetRecipesAsync(cancellationToken);
            _logger.LogInformation("Retrieved {RecipeCount} recipes for menu generation", recipes.Count);

            cancellationToken.ThrowIfCancellationRequested();

            var weekStart = DateOnly.FromDateTime(DateTime.Today);
            var menu = WeeklyMenu.Generate(weekStart, recipes, mealSlotRandomizer, menuGenerateRequest.Meals);
            _logger.LogInformation("Weekly menu generated for week starting {WeekStart}", weekStart);

            var pdfDocument = MenuPdfMapper.ToPdfDocument(menu);
            var pdf = pdfCreatorService.Generate(pdfDocument);
            _logger.LogInformation("Menu PDF generated successfully");
            return pdf;
        }
        catch (OperationCanceledException)
        {
            _logger.LogWarning("Menu generation was cancelled");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during menu generation");
            throw;
        }
    }

    public async Task<MenuPreviewDto> PreviewAsync(MenuGenerateRequest menuGenerateRequest,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Starting menu preview generation");
            var recipes = await recipeService.GetRecipesAsync(cancellationToken);
            _logger.LogInformation("Retrieved {RecipeCount} recipes for menu preview", recipes.Count);

            cancellationToken.ThrowIfCancellationRequested();

            var weekStart = DateOnly.FromDateTime(DateTime.Today);
            var menu = WeeklyMenu.Generate(weekStart, recipes, mealSlotRandomizer, menuGenerateRequest.Meals);
            _logger.LogInformation("Weekly menu preview generated for week starting {WeekStart}", weekStart);

            return MenuPreviewMapper.ToPreviewDto(menu);
        }
        catch (OperationCanceledException)
        {
            _logger.LogWarning("Menu preview generation was cancelled");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during menu preview generation");
            throw;
        }
    }
}