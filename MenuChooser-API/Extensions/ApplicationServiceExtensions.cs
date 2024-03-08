using MenuChooser.Data;
using MenuChooser.Repository;

namespace MenuChooser.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.Configure<MenuChooserDatabaseSettings>(configuration.GetSection("UserStoreDatabase"));
            services.AddSingleton<UserService>();

            return services;
        }
    }
}
