using Menu.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Menu.Endpoints;

public static void RegisterMenuEndpoints(this WebApplication app)
{
    app.MapPost("/api/menus/generate", async (
        MenuGenerationService service,
        CancellationToken ct) =>
    {
        var pdf = await service.GenerateAsync(ct);
        return Results.File(pdf, "application/pdf", $"menu_{DateTime.Today:yyyy-MM-dd}.pdf");
    });
}