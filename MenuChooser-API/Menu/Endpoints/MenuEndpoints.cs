using Menu.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Menu.Endpoints;

public static class MenuEndpoints
{
    public static void RegisterMenuEndpoints(this WebApplication app)
    {
        app.MapPost("/api/menus/generate", async (
            IMenuGenerationService service,
            CancellationToken cancellationToken) =>
        {
            var pdf = await service.GenerateAsync(cancellationToken);
            return Results.File(pdf, "application/pdf", $"menu_{DateTime.Today:yyyy-MM-dd}.pdf");
        });
    }
}
