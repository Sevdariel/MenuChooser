FROM mcr.microsoft.com/dotnet/sdk:8.0.412 AS build
WORKDIR /app

COPY ["Account/Account.csproj", "Account/"]
COPY ["Database/Database.csproj", "Database/"]
COPY ["Email/Email.csproj", "Email/"]
COPY ["Products/Products.csproj", "Products/"]
COPY ["Recipes/Recipes.csproj", "Recipes/"]
COPY ["Users/Users.csproj", "Users/"]
COPY ["MenuChooser/MenuChooser.csproj", "MenuChooser/"]

RUN dotnet restore "MenuChooser/MenuChooser.csproj"

COPY . .

CMD ["dotnet", "watch", "run", "--project", "MenuChooser/MenuChooser.csproj", "--urls", "http://0.0.0.0:7103"]
