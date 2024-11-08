namespace MenuChooser.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(
            this IServiceCollection services,
            IConfiguration configuration
            )
        {
            services.AddCors();
            
            return services;
        }
    }
}
