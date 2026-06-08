using Menu.Dto;
using Menu.Entities;
using Menu.Mapper;
using Menu.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using PdfCreator.Services;

namespace Menu.Endpoints;

public static class MenuEndpoints
{
    public static void RegisterMenuEndpoints(this WebApplication app)
    {
        app.MapPost("/api/menus/generate", async (
            MenuGenerateRequest request,
            IMenuGenerationService service,
            CancellationToken cancellationToken) =>
        {
            var pdf = await service.GenerateAsync(request, cancellationToken);
            return Results.File(pdf, "application/pdf", $"menu_{DateTime.Today:yyyy-MM-dd}.pdf");
        });

        app.MapPost("/api/menus/preview", async (
            MenuGenerateRequest request,
            IMenuGenerationService service,
            CancellationToken cancellationToken) =>
        {
            var preview = await service.PreviewAsync(request, cancellationToken);
            return Results.Ok(preview);
        });

        app.MapPost("/api/menus/generate-from-preview", (
            MenuPreviewDto preview,
            IPdfCreatorService pdfCreatorService) =>
        {
            var pdfDocument = MenuPdfMapper.ToPdfDocument(preview);
            var pdf = pdfCreatorService.Generate(pdfDocument);
            return Results.File(pdf, "application/pdf", $"menu_{DateTime.Today:yyyy-MM-dd}.pdf");
        });
    }
}
