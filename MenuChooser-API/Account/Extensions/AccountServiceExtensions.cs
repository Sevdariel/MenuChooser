using Account.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Account.Extensions
{
    public static class AccountServiceExtensions
    {
        public static IServiceCollection AddAccountServices(
            this IServiceCollection services)
        {
            services.AddSingleton<AccountService>();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
