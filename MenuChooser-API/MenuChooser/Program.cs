using System.Text.Json;
using Account.Extensions;
using Database.Extensions;
using Email.Extensions;
using MenuChooser.Extensions;
using Microsoft.AspNetCore.Authorization;
using Products.Extensions;
using Recipes.Extensions;
using Users.Extensions;

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

var app = builder.Build();

app.Services.AppInitializer();

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
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
