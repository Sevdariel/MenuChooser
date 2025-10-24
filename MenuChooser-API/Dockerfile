# Etap 1: budowanie aplikacji
FROM mcr.microsoft.com/dotnet/sdk:8.0.412 AS build
WORKDIR /src

# Kopiowanie solution i wszystkich projektów
COPY ["Account/Account.csproj", "Account/"]
COPY ["Database/Database.csproj", "Database/"]
COPY ["Email/Email.csproj", "Email/"]
COPY ["Products/Products.csproj", "Products/"]
COPY ["Recipes/Recipes.csproj", "Recipes/"]
COPY ["Users/Users.csproj", "Users/"]
COPY ["MenuChooser/MenuChooser.csproj", "MenuChooser/"]

# # Kopiowanie kodu źródłowego
COPY . .

# RUN dotnet restore "MenuChooser/MenuChooser.csproj"
# # Publikacja aplikacji
RUN dotnet publish "MenuChooser/MenuChooser.csproj" -c Release -o /app

# # Obraz końcowy
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
EXPOSE 7103

ENTRYPOINT ["dotnet", "MenuChooser.dll"]
