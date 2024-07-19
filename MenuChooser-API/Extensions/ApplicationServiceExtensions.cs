using Email.Service;
using MenuChooser.Accounts.Services;
using MenuChooser.Data;
using MenuChooser.Email;
using MenuChooser.Repository;

namespace MenuChooser.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(
            this IServiceCollection services,
            IConfiguration configuration
            )
        {
            services.Configure<DatabaseSettings>(configuration.GetSection("UserStoreDatabase"));
            services.Configure<EmailConfiguration>(configuration.GetSection("EmailConfiguration"));
            services.AddSingleton<DatabaseContext>();
            services.AddSingleton<UserService>();
            services.AddSingleton<AccountService>();
            services.AddSingleton<EmailSender>();

            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
