using Menu.Dto;
using Menu.Entities;
using Menu.Mapper;
using Menu.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PdfCreator.Services;

namespace Menu.Endpoints;

public static class MenuEndpoints
{
    public static void RegisterMenuEndpoints(this WebApplication app)
    {
        app.MapPost("/api/menus/generate", async (
            MenuGenerateRequest request,
            IMenuGenerationService service,
            CancellationToken cancellationToken,
            ILoggerFactory loggerFactory) =>
        {
            var logger = loggerFactory.CreateLogger("MenuEndpoints");
            logger.LogInformation("Menu generation request received");
            var pdf = await service.GenerateAsync(request, cancellationToken);
            logger.LogInformation("Menu PDF generated successfully");
            return Results.File(pdf, "application/pdf", $"menu_{DateTime.Today:yyyy-MM-dd}.pdf");
        });

        app.MapPost("/api/menus/preview", async (
            MenuGenerateRequest request,
            IMenuGenerationService service,
            CancellationToken cancellationToken,
            ILoggerFactory loggerFactory) =>
        {
            var logger = loggerFactory.CreateLogger("MenuEndpoints");
            logger.LogInformation("Menu preview request received");
            var preview = await service.PreviewAsync(request, cancellationToken);
            logger.LogInformation("Menu preview generated successfully");
            return Results.Ok(preview);
        });

        app.MapPost("/api/menus/generate-from-preview", (
            MenuPreviewDto preview,
            IPdfCreatorService pdfCreatorService,
            ILoggerFactory loggerFactory) =>
        {
            var logger = loggerFactory.CreateLogger("MenuEndpoints");
            logger.LogInformation("Menu generation from preview request received");
            var pdfDocument = MenuPdfMapper.ToPdfDocument(preview);
            var pdf = pdfCreatorService.Generate(pdfDocument);
            logger.LogInformation("Menu PDF generated from preview successfully");
            return Results.File(pdf, "application/pdf", $"menu_{DateTime.Today:yyyy-MM-dd}.pdf");
        });
    }
}
