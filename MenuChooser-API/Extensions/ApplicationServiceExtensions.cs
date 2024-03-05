using MenuChooser.Data;
using System.Runtime.CompilerServices;

namespace MenuChooser.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services,
            IConfiguration configuration)
        {
            //services.AddDbContext<DataContext>(options =>
            //{
            //    options.
            //});

            return services;
        }
    }
}
