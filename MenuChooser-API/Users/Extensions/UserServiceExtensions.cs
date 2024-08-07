using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Users.Service;

namespace Users.Extensions
{
    public static class UserServiceExtensions
    {
        public static IServiceCollection AddUserService(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddSingleton<UserService>();

            return services;
        }
    }
}
