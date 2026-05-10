using Products.Service;
using Recipes.Dto;
using Recipes.Entities;
using Recipes.Service;

namespace Recipes.Seeder;

public class RecipeSeeder(IRecipeService recipeService, IProductService productService)
{
    public async Task SeedAsync()
    {
        var existingRecipes = await recipeService.GetRecipesAsync();
        if (existingRecipes.Any())
        {
            Console.WriteLine("Recipes already seeded. Skipping...");
            return;
        }

        var products = await productService.GetProductsAsync();
        var productDict = products.ToDictionary(p => p.Name, p => p.Id!);

        var recipes = GetRecipes(productDict);

        foreach (var recipe in recipes)
        {
            await recipeService.CreateRecipeAsync(recipe);
        }

        Console.WriteLine($"Seeded {recipes.Count} recipes");
    }

    private static List<CreateRecipeDto> GetRecipes(Dictionary<string, string> productDict)
    {
        return new List<CreateRecipeDto>
        {
            new()
            {
                Name = "Jajecznica",
                Duration = 10,
                MealType = MealType.Breakfast,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Jajko"], Quantity = 3, Unit = Unit.Piece },
                    new() { ProductId = productDict["Masło"], Quantity = 10, Unit = Unit.Gram }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Rozbij jajka do miski", Duration = 2 },
                    new() { Order = 2, Content = "Rozgrzej patelnię z masłem", Duration = 3 },
                    new() { Order = 3, Content = "Smaż jajka mieszając", Duration = 5 }
                }
            },
            new()
            {
                Name = "Naleśniki",
                Duration = 30,
                MealType = MealType.Breakfast,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Mąka"], Quantity = 200, Unit = Unit.Gram },
                    new() { ProductId = productDict["Mleko"], Quantity = 300, Unit = Unit.Milliliter },
                    new() { ProductId = productDict["Jajko"], Quantity = 2, Unit = Unit.Piece },
                    new() { ProductId = productDict["Cukier"], Quantity = 20, Unit = Unit.Gram }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Wymieszaj mąkę z mlekiem", Duration = 5 },
                    new() { Order = 2, Content = "Dodaj jajka i cukier", Duration = 3 },
                    new() { Order = 3, Content = "Smaż naleśniki", Duration = 22 }
                }
            },
            new()
            {
                Name = "Kurczak z ryżem",
                Duration = 45,
                MealType = MealType.Dinner,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Kurczak"], Quantity = 500, Unit = Unit.Gram },
                    new() { ProductId = productDict["Ryż"], Quantity = 200, Unit = Unit.Gram },
                    new() { ProductId = productDict["Cebula"], Quantity = 1, Unit = Unit.Piece },
                    new() { ProductId = productDict["Olej"], Quantity = 30, Unit = Unit.Milliliter }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Pokrój kurczaka", Duration = 10 },
                    new() { Order = 2, Content = "Podsmaż cebulę", Duration = 5 },
                    new() { Order = 3, Content = "Usmaż kurczaka", Duration = 20 },
                    new() { Order = 4, Content = "Ugotuj ryż", Duration = 10 }
                }
            },
            new()
            {
                Name = "Spaghetti Carbonara",
                Duration = 25,
                MealType = MealType.Dinner,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Makaron"], Quantity = 400, Unit = Unit.Gram },
                    new() { ProductId = productDict["Boczek"], Quantity = 200, Unit = Unit.Gram },
                    new() { ProductId = productDict["Jajko"], Quantity = 3, Unit = Unit.Piece },
                    new() { ProductId = productDict["Ser żółty"], Quantity = 100, Unit = Unit.Gram }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Ugotuj makaron", Duration = 10 },
                    new() { Order = 2, Content = "Podsmaż boczek", Duration = 7 },
                    new() { Order = 3, Content = "Wymieszaj z jajkami i serem", Duration = 8 }
                }
            },
            new()
            {
                Name = "Kanapki z szynką",
                Duration = 10,
                MealType = MealType.Lunch,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Szynka"], Quantity = 100, Unit = Unit.Gram },
                    new() { ProductId = productDict["Ser żółty"], Quantity = 50, Unit = Unit.Gram },
                    new() { ProductId = productDict["Pomidor"], Quantity = 1, Unit = Unit.Piece }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Pokrój pomidora", Duration = 3 },
                    new() { Order = 2, Content = "Przygotuj kanapki", Duration = 7 }
                }
            },
            new()
            {
                Name = "Sałatka owocowa",
                Duration = 15,
                MealType = MealType.Dessert,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Jabłko"], Quantity = 2, Unit = Unit.Piece },
                    new() { ProductId = productDict["Banan"], Quantity = 2, Unit = Unit.Piece }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Pokrój owoce", Duration = 10 },
                    new() { Order = 2, Content = "Wymieszaj", Duration = 5 }
                }
            },
            new()
            {
                Name = "Omlet z warzywami",
                Duration = 15,
                MealType = MealType.Breakfast,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Jajko"], Quantity = 3, Unit = Unit.Piece },
                    new() { ProductId = productDict["Pomidor"], Quantity = 1, Unit = Unit.Piece },
                    new() { ProductId = productDict["Cebula"], Quantity = 1, Unit = Unit.Piece },
                    new() { ProductId = productDict["Masło"], Quantity = 15, Unit = Unit.Gram }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Pokrój warzywa", Duration = 5 },
                    new() { Order = 2, Content = "Rozbij jajka", Duration = 2 },
                    new() { Order = 3, Content = "Smaż omlet z warzywami", Duration = 8 }
                }
            },
            new()
            {
                Name = "Pizza domowa",
                Duration = 60,
                MealType = MealType.Dinner,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Mąka"], Quantity = 300, Unit = Unit.Gram },
                    new() { ProductId = productDict["Pomidor"], Quantity = 3, Unit = Unit.Piece },
                    new() { ProductId = productDict["Ser żółty"], Quantity = 200, Unit = Unit.Gram },
                    new() { ProductId = productDict["Szynka"], Quantity = 150, Unit = Unit.Gram },
                    new() { ProductId = productDict["Olej"], Quantity = 20, Unit = Unit.Milliliter }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Przygotuj ciasto", Duration = 20 },
                    new() { Order = 2, Content = "Przygotuj sos pomidorowy", Duration = 10 },
                    new() { Order = 3, Content = "Dodaj dodatki i ser", Duration = 10 },
                    new() { Order = 4, Content = "Piecz w piekarniku", Duration = 20 }
                }
            },
            new()
            {
                Name = "Kotlety schabowe",
                Duration = 35,
                MealType = MealType.Dinner,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Jajko"], Quantity = 2, Unit = Unit.Piece },
                    new() { ProductId = productDict["Mąka"], Quantity = 100, Unit = Unit.Gram },
                    new() { ProductId = productDict["Olej"], Quantity = 100, Unit = Unit.Milliliter }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Przygotuj mięso", Duration = 10 },
                    new() { Order = 2, Content = "Panieruj w mące i jajku", Duration = 10 },
                    new() { Order = 3, Content = "Smaż kotlety", Duration = 15 }
                }
            },
            new()
            {
                Name = "Sernik",
                Duration = 90,
                MealType = MealType.Dessert,
                CreatedBy = "Seeder",
                RecipeProducts = new List<RecipeProduct>
                {
                    new() { ProductId = productDict["Ser żółty"], Quantity = 500, Unit = Unit.Gram },
                    new() { ProductId = productDict["Jajko"], Quantity = 4, Unit = Unit.Piece },
                    new() { ProductId = productDict["Cukier"], Quantity = 150, Unit = Unit.Gram },
                    new() { ProductId = productDict["Mąka"], Quantity = 50, Unit = Unit.Gram }
                },
                Steps = new List<Step>
                {
                    new() { Order = 1, Content = "Wymieszaj składniki", Duration = 15 },
                    new() { Order = 2, Content = "Przełóż do formy", Duration = 5 },
                    new() { Order = 3, Content = "Piecz w piekarniku", Duration = 70 }
                }
            }
        };
    }
}
