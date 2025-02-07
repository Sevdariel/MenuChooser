using Microsoft.Extensions.DependencyInjection;
using Users.Service;

namespace Users.Extensions
{
    public static class UserServiceExtensions
    {
        public static IServiceCollection AddUserService(
            this IServiceCollection services)
        {
            services.AddSingleton<UserService>();

            return services;
        }
    }
}
