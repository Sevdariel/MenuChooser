using Microsoft.Extensions.DependencyInjection;
using PdfCreator.Services;

namespace PdfCreator.Extensions;

public static class PdfCreatorExtensions
{
    public static IServiceCollection AddPdfCreatorServices(
        this IServiceCollection services
    )
    {
        services.AddSingleton<PdfCreatorService>();

        return services;
    }
}