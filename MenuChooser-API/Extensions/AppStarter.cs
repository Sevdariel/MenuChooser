using MenuChooser.Data;

namespace MenuChooser.Extensions
{
    public static class AppStarter
    {
        public static IServiceProvider AppInitializer(
            this IServiceProvider services
            )
        {
            services.GetRequiredService<DatabaseInitializer>().CreateDatabaseConnection();

            return services;
        }
    }
}
