using Database.Seeder.SeedData;
using Products.Service;
using Recipes.Service;
using Users.Service;

namespace Database.Seeder;

public class DatabaseSeeder(
    IProductService productService,
    IRecipeService recipeService,
    IUserService userService)
{
    public async Task SeedAsync()
    {
        await SeedUsersAsync();
        await SeedProductsAsync();
        await SeedRecipesAsync();
    }

    private async Task SeedUsersAsync()
    {
        var existingUsers = await userService.GetUsersAsync();
        if (existingUsers.Any())
        {
            Console.WriteLine("Users already seeded. Skipping...");
            return;
        }

        var users = UserSeedData.GetUsers();

        foreach (var user in users)
        {
            await userService.CreateUserAsync(user);
        }

        Console.WriteLine($"Seeded {users.Count} users");
    }

    private async Task SeedProductsAsync()
    {
        var existingProducts = await productService.GetProductsAsync();
        if (existingProducts.Any())
        {
            Console.WriteLine("Products already seeded. Skipping...");
            return;
        }

        var products = ProductSeedData.GetProducts();

        foreach (var product in products)
        {
            await productService.CreateProductAsync(product);
        }

        Console.WriteLine($"Seeded {products.Count} products");
    }

    private async Task SeedRecipesAsync()
    {
        var existingRecipes = await recipeService.GetRecipesAsync();
        if (existingRecipes.Any())
        {
            Console.WriteLine("Recipes already seeded. Skipping...");
            return;
        }

        var products = await productService.GetProductsAsync();
        var productDict = products.ToDictionary(p => p.Name, p => p.Id!);

        var recipes = RecipeSeedData.GetRecipes(productDict);

        foreach (var recipe in recipes)
        {
            await recipeService.CreateRecipeAsync(recipe);
        }

        Console.WriteLine($"Seeded {recipes.Count} recipes");
    }
}
