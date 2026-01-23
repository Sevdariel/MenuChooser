using Microsoft.Extensions.DependencyInjection;
using Recipes.Mappers;
using Recipes.Service;

namespace Recipes.Extensions
{
    public static class RecipeServiceExtensions
    {
        public static IServiceCollection AddRecipeServices(
            this IServiceCollection services
        )
        {
            services.AddAutoMapper(typeof(RecipeMappingProfile));
            services.AddSingleton<RecipeService>();

            return services;
        }
    }
}
