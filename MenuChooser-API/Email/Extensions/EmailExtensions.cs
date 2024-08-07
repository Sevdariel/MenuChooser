using Email.Entities;
using Email.Interface;
using Email.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Email.Extensions
{
    public static class EmailExtensions
    {
        public static IServiceCollection AddEmailServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.Configure<EmailConfiguration>(configuration.GetSection("EmailConfiguration"));

            services.AddSingleton<EmailSender>();

            services.AddScoped<IEmailSender, EmailSender>();

            return services;
        }
    }
}
