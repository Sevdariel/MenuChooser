using Microsoft.Extensions.DependencyInjection;

namespace Users.Seeder;

public static class UserSeederExtensions
{
    public static IServiceCollection AddUserSeeder(this IServiceCollection services)
    {
        services.AddScoped<UserSeeder>();
        return services;
    }

    public static async Task SeedUsersAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var seeder = scope.ServiceProvider.GetRequiredService<UserSeeder>();
        await seeder.SeedAsync();
    }
}
