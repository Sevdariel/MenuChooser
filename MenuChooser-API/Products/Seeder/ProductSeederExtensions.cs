using Microsoft.Extensions.DependencyInjection;

namespace Products.Seeder;

public static class ProductSeederExtensions
{
    public static IServiceCollection AddProductSeeder(this IServiceCollection services)
    {
        services.AddScoped<ProductSeeder>();
        return services;
    }

    public static async Task SeedProductsAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var seeder = scope.ServiceProvider.GetRequiredService<ProductSeeder>();
        await seeder.SeedAsync();
    }
}
