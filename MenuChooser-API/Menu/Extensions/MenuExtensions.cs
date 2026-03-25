using Menu.Service;
using Microsoft.Extensions.DependencyInjection;

namespace Menu.Extensions;

public static class MenuExtensions
{
    public static IServiceCollection AddMenuServices(
        this IServiceCollection services
    )
    {
        services.AddSingleton<IMealSlotRandomizer, RandomMealSlotRandomizer>();
        services.AddSingleton<IMenuGenerationService, MenuGenerationService>();

        return services;
    }
}
