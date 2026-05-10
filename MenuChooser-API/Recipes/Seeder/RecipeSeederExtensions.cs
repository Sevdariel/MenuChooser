using Microsoft.Extensions.DependencyInjection;

namespace Recipes.Seeder;

public static class RecipeSeederExtensions
{
    public static IServiceCollection AddRecipeSeeder(this IServiceCollection services)
    {
        services.AddScoped<RecipeSeeder>();
        return services;
    }

    public static async Task SeedRecipesAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var seeder = scope.ServiceProvider.GetRequiredService<RecipeSeeder>();
        await seeder.SeedAsync();
    }
}
