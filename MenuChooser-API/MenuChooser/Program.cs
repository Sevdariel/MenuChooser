using System.Text.Json;
using Account.Extensions;
using Database.Extensions;
using Email.Extensions;
using MenuChooser.Extensions;
using Users.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

builder.Services.AddAuthenticationService(builder.Configuration);
builder.Services.AddEmailServices(builder.Configuration);
builder.Services.AddUserService(builder.Configuration);
builder.Services.AddAccountServices();
builder.Services.AddDatabaseServices(builder.Configuration);
builder.Services.AddApplicationService(builder.Configuration);

var app = builder.Build();

app.Services.AppInitializer();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
