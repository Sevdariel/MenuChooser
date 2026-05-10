using System.Text.Json;
using Account.Extensions;
using Database.Extensions;
using Email.Extensions;
using Menu.Endpoints;
using Menu.Extensions;
using MenuChooser.Extensions;
using Microsoft.AspNetCore.Authorization;
using Products.Extensions;
using Products.Seeder;
using Recipes.Extensions;
using Recipes.Seeder;
using Users.Extensions;
using Users.Seeder;
using PdfCreator.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

builder.Services.AddDatabaseServices(builder.Configuration);
builder.Services.AddApplicationService(builder.Configuration);
builder.Services.AddAuthenticationService(builder.Configuration);
builder.Services.AddEmailServices(builder.Configuration);
builder.Services.AddUserService();
builder.Services.AddProductServices();
builder.Services.AddRecipeServices();
builder.Services.AddAccountServices();
builder.Services.AddPdfCreatorServices();
builder.Services.AddMenuServices();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddUserSeeder();
    builder.Services.AddProductSeeder();
    builder.Services.AddRecipeSeeder();
}

var app = builder.Build();

app.Services.AppInitializer();

if (app.Environment.IsDevelopment())
{
    await app.Services.SeedUsersAsync();
    await app.Services.SeedProductsAsync();
    await app.Services.SeedRecipesAsync();
}

if (!app.Environment.IsDevelopment())
{
    builder.Services.AddAuthorization(options =>
    {
        options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    });
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.RegisterMenuEndpoints();

app.MapControllers();

app.Run();
