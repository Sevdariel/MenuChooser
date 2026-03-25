using Microsoft.Extensions.DependencyInjection;
using Products.Service;

namespace Products.Extensions
{
    public static class ProductServiceExtensions
    {
        public static IServiceCollection AddProductServices(
            this IServiceCollection services
        )
        {
            services.AddAutoMapper(cfg => cfg.AddProfile<ProductMappingProfile>());
            services.AddSingleton<IProductService, ProductService>();

            return services;
        }
    }
}
