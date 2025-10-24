FROM mcr.microsoft.com/dotnet/sdk:8.0.412
WORKDIR /app
COPY . .
RUN dotnet restore "MenuChooser/MenuChooser.csproj"
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:7103"]
