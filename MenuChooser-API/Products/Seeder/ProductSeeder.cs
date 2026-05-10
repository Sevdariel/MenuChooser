using Products.Dto;
using Products.Service;

namespace Products.Seeder;

public class ProductSeeder(IProductService productService)
{
    public async Task SeedAsync()
    {
        var existingProducts = await productService.GetProductsAsync();
        if (existingProducts.Any())
        {
            Console.WriteLine("Products already seeded. Skipping...");
            return;
        }

        var products = GetProducts();

        foreach (var product in products)
        {
            await productService.CreateProductAsync(product);
        }

        Console.WriteLine($"Seeded {products.Count} products");
    }

    private static List<CreateProductDto> GetProducts()
    {
        return new List<CreateProductDto>
        {
            new() { Name = "Jajko", Producent = "Farma Rodzinna", CreatedBy = "Seeder" },
            new() { Name = "Mleko", Producent = "Mleczarnia Polska", CreatedBy = "Seeder" },
            new() { Name = "Mąka", Producent = "Młyny Polskie", CreatedBy = "Seeder" },
            new() { Name = "Cukier", Producent = "Cukrownia", CreatedBy = "Seeder" },
            new() { Name = "Masło", Producent = "Mleczarnia Polska", CreatedBy = "Seeder" },
            new() { Name = "Sól", Producent = "Kopalnia Soli", CreatedBy = "Seeder" },
            new() { Name = "Pieprz", Producent = "Przyprawy Świata", CreatedBy = "Seeder" },
            new() { Name = "Kurczak", Producent = "Drobiex", CreatedBy = "Seeder" },
            new() { Name = "Ryż", Producent = "Ryżowe Pola", CreatedBy = "Seeder" },
            new() { Name = "Makaron", Producent = "Pasta Italiana", CreatedBy = "Seeder" },
            new() { Name = "Pomidor", Producent = "Warzywa Świeże", CreatedBy = "Seeder" },
            new() { Name = "Cebula", Producent = "Warzywa Świeże", CreatedBy = "Seeder" },
            new() { Name = "Czosnek", Producent = "Warzywa Świeże", CreatedBy = "Seeder" },
            new() { Name = "Ser żółty", Producent = "Serowar", CreatedBy = "Seeder" },
            new() { Name = "Szynka", Producent = "Masarnia Premium", CreatedBy = "Seeder" },
            new() { Name = "Boczek", Producent = "Masarnia Premium", CreatedBy = "Seeder" },
            new() { Name = "Jabłko", Producent = "Sad Polski", CreatedBy = "Seeder" },
            new() { Name = "Banan", Producent = "Owoce Tropikalne", CreatedBy = "Seeder" },
            new() { Name = "Czekolada", Producent = "Słodka Fabryka", CreatedBy = "Seeder" },
            new() { Name = "Olej", Producent = "Tłocznia Olejów", CreatedBy = "Seeder" }
        };
    }
}
