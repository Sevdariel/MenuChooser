using MenuChooser.Data;

namespace MenuChooser.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.Configure<MenuChooserDatabaseSettings>(configuration.GetSection("ConnectionStrings"));

            return services;
        }
    }
}
