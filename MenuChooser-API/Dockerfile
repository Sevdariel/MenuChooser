# Etap 1: budowanie aplikacji
FROM mcr.microsoft.com/dotnet/sdk:10.0.201 AS build
WORKDIR /src

# Kopiowanie solution i wszystkich projektów
COPY ["Account/Account.csproj", "Account/"]
COPY ["Database/Database.csproj", "Database/"]
COPY ["Email/Email.csproj", "Email/"]
COPY ["Menu/Menu.csproj", "Menu/"]
COPY ["MenuChooser/MenuChooser.csproj", "MenuChooser/"]
COPY ["PdfCreator/PdfCreator.csproj", "PdfCreator/"]
COPY ["Products/Products.csproj", "Products/"]
COPY ["Recipes/Recipes.csproj", "Recipes/"]
COPY ["Users/Users.csproj", "Users/"]

# # Kopiowanie kodu źródłowego
COPY . .

# RUN dotnet restore "MenuChooser/MenuChooser.csproj"
# # Publikacja aplikacji
RUN dotnet publish "MenuChooser/MenuChooser.csproj" -c Debug -o /app

# # Obraz końcowy
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app ./

# Copy appsettings.development.json to final image
COPY ["MenuChooser/appsettings.development.json", "/app/"]

RUN apt-get update && apt-get install -y curl unzip && \
    curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l /vsdbg

ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Development
ENV DOTNET_USE_POLLING_FILE_WATCHER=1
EXPOSE 80
EXPOSE 7103

ENTRYPOINT ["dotnet", "MenuChooser.dll"]
