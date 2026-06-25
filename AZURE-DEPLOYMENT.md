# Wdrożenie MenuChooser na Azure — stan, plan dokończenia i instrukcja odtworzenia

Dokument opisuje:
1. Co już jest zrobione w Azure (stan na teraz).
2. Ograniczenia środowiska/subskrypcji i przyjęte obejścia.
3. Co zostało do zrobienia (z komendami).
4. Jak odtworzyć **całość od zera** (pełna sekwencja).
5. Diagnostykę problemu z backendem (HTTP 504).
6. Handoff: GitHub Actions / OIDC (wymaga uprawnień, których nie mam).

> Architektura: monorepo `MenuChooser-API/` (.NET 10) + `MenuChooser-Spa/` (Angular 21).
> Backend → obraz w ACR → Azure Container Apps. Frontend → Azure Static Web Apps.
> Baza: Azure Cosmos DB for MongoDB (serverless). Sekrety: Azure Key Vault. Telemetria: Application Insights.

---

## 1. Stan obecny (co już istnieje i działa)

Wszystko w grupie zasobów **`rg-mealplanner`**.

| Zasób | Nazwa | Region | Status |
|---|---|---|---|
| Resource Group | `rg-mealplanner` | westeurope | OK |
| Container Registry | `acrmealplanner30278` (`acrmealplanner30278.azurecr.io`) | westeurope | OK, **admin enabled**, jest obraz `mealplanner-api:latest` |
| Log Analytics | `law-mealplanner` | westeurope | OK |
| Application Insights | `ai-mealplanner` | westeurope | OK (workspace-based) |
| Container Apps Env | `cae-mealplanner` | **northeurope** | OK (Succeeded) |
| Cosmos DB (Mongo) | `cosmos-mealplanner-30278` | northeurope | OK, serverless, server 7.0 |
| Key Vault | `kv-mealplanner` | westeurope | OK, tryb access-policy; sekrety: `token-key`, `mongo-connstring` |
| Container App | `ca-mealplanner-api` | northeurope | Utworzona, **chodzi, ale zwraca HTTP 504** (do naprawy — patrz §5) |

- **Backend FQDN:** `https://ca-mealplanner-api.redrock-7f4dea71.northeurope.azurecontainerapps.io`
- **Managed identity Container App (principalId):** `a0e1dabb-3b78-45cd-a0d4-2289d3d0fd07`
- **Subskrypcja:** „Azure subscription 1" — `ff0d6210-f800-434d-b26e-b2681da3fda9`
- **Repo:** https://github.com/Sevdariel/MenuChooser (gałąź domyślna: `master`)
- **PR z poprawkami kodu:** https://github.com/Sevdariel/MenuChooser/pull/1 (gałąź `devin/1782403350-azure-deploy-fixes`)

### Co jest jeszcze NIE zrobione
- Backend nie odpowiada poprawnie (504) — wymaga diagnozy startu (§5).
- **Frontend (Static Web App) — nie utworzony i nie wdrożony** (§3.B).
- CORS backendu nie wskazuje jeszcze na URL frontendu (§3.B krok 4).
- GitHub Actions / OIDC — do zrobienia po Twojej stronie (§6).

---

## 2. Ograniczenia środowiska/subskrypcji i przyjęte obejścia

Te rzeczy „wywróciły" pierwotny plan i trzeba je znać przy odtwarzaniu:

1. **`az acr build` jest ZABLOKOWANY na tej subskrypcji** (`TasksOperationsNotAllowed` — ACR Tasks niedozwolone, typowe dla Free Trial/sponsorowanych).
   → **Obejście:** budujemy obraz lokalnie/w CI i `docker push`, albo przez .NET SDK (`dotnet publish -p:PublishProfile=DefaultContainer`, bez Dockera). Workflow `deploy-backend.yml` jest już przerobiony na `docker build` + `docker push`.
   → Żeby odblokować docelowo: upgrade subskrypcji na Pay-As-You-Go albo wniosek do https://aka.ms/azuresupport.

2. **West Europe — brak mocy dla Container Apps** (`ManagedEnvironmentCapacityHeavyUsageError` / „AKS heavy usage"). To była przyczyna wieszania się środowiska w stanie `Updating`.
   → **Obejście:** Container Apps Environment + Container App utworzone w **North Europe**. (Cosmos też w North Europe, blisko aplikacji. ACR/KV/LAW/AI zostały w West Europe — działa cross-region.)

3. **Service Principal, którym jestem zalogowany, ma tylko rolę `Contributor`** (brak Entra ID i brak prawa do role assignments).
   → Nie mogę: tworzyć aplikacji w Entra ID (OIDC), nadawać ról (AcrPull, Key Vault RBAC).
   → **Obejścia:** pull z ACR przez **admin user ACR**; sekrety wstrzyknięte wprost do Container App (wartości z KV/Cosmos) zamiast referencji `keyvaultref` przez managed identity; Key Vault w trybie **access policy**.

4. **Rozszerzenie Azure CLI `containerapp` nie instaluje się na tej maszynie (Windows, 32-bit Python — build zależności Rust/maturin się wiesza).**
   → **Obejście:** Container Apps Environment i Container App tworzone przez **szablony ARM** (`az deployment group create`), nie przez `az containerapp create`. Szablony są w §7.

5. **`az monitor app-insights component create` też próbuje doinstalować rozszerzenie i się wiesza.**
   → **Obejście:** App Insights tworzony przez ARM (§7).

---

## 3. Co zostało do zrobienia

### A. Naprawić backend (HTTP 504) — patrz pełna diagnostyka w §5
Najpierw obejrzyj logi startu aplikacji. Najczęstsze przyczyny: błąd połączenia z Cosmos przy starcie (`DatabaseInitialization()` rzuca wyjątek → kontener się restartuje), albo nasłuch na złym porcie.

Dodatkowo: w Container App ustawione są kolekcje `User, Recipe, Product`, a lokalny `docker-compose.yml` używa **czterech**: `Menu, User, Product, Recipe`. Warto wyrównać (dodać `Menu`) — komenda w §5.

### B. Frontend — Static Web App

```bash
# zmienne pomocnicze
RG=rg-mealplanner
BACKEND="https://ca-mealplanner-api.redrock-7f4dea71.northeurope.azurecontainerapps.io"

# 1) Zbuduj frontend (z katalogu repo)
cd MenuChooser-Spa
npm ci
npm run build -- --configuration production
# wynik: MenuChooser-Spa/dist/menu-chooser-spa/browser  (zawiera staticwebapp.config.json)

# 2) Utwórz Static Web App (Free)
az staticwebapp create -n swa-mealplanner -g $RG -l westeurope --sku Free
SWA_HOST=$(az staticwebapp show -n swa-mealplanner -g $RG --query defaultHostname -o tsv)
echo "Frontend: https://$SWA_HOST"

# 3) Pobierz token wdrożeniowy i wdroż zbudowane pliki (SWA CLI)
SWA_TOKEN=$(az staticwebapp secrets list -n swa-mealplanner -g $RG --query "properties.apiKey" -o tsv)
npx --yes @azure/static-web-apps-cli@latest deploy \
  ./dist/menu-chooser-spa/browser \
  --deployment-token "$SWA_TOKEN" \
  --env production

# 4) Po poznaniu URL frontendu — dodaj go do CORS backendu i zrestartuj rewizję
az containerapp update -n ca-mealplanner-api -g $RG \
  --set-env-vars "Cors__AllowedOrigins__0=https://$SWA_HOST"
# (jeśli rozszerzenie containerapp nie działa lokalnie — patrz §7, użyj ARM/REST)
```

> **Routing frontend → backend.** SPA woła względne `api/...`. Na Static Web Apps trzeba albo:
> - skonfigurować `staticwebapp.config.json` z `routes`/`navigationFallback` i ewentualnie proxy do backendu, albo
> - ustawić w buildzie Angulara bazowy URL API na `BACKEND` (environment.prod.ts) i polegać na CORS (krok 4 powyżej).
>
> Najprościej: ustaw w `MenuChooser-Spa/src/environments/environment.prod.ts` adres API na `BACKEND` i zostaw CORS. Sprawdź, jak frontend buduje URL (szukaj `environment` / `apiUrl` / `baseUrl`).

### C. Weryfikacja end-to-end
- `curl -i $BACKEND/` — ma zwrócić odpowiedź aplikacji (nie 504).
- Wejdź na `https://$SWA_HOST` — UI ma się załadować i odpytywać backend bez błędów CORS.

### D. Handoff GitHub Actions / OIDC — §6

---

## 4. Odtworzenie CAŁOŚCI od zera (pełna sekwencja)

> Wymaga zalogowanego `az` (Service Principal Contributor wystarczy). Na Windows/Git-Bash ustaw:
> `export MSYS_NO_PATHCONV=1` (żeby nie psuł ścieżek `/subscriptions/...`).
> Szablony ARM (`caenv.json`, `appinsights.json`, `containerapp2.json`) — treść w §7; zapisz je obok.

```bash
export MSYS_NO_PATHCONV=1
RG=rg-mealplanner
ACR=acrmealplanner30278            # globalnie unikalna; zmień jeśli zajęta
KV=kv-mealplanner
COSMOS=cosmos-mealplanner-30278    # globalnie unikalna; zmień jeśli zajęta
APP_REGION=northeurope             # Container Apps + Cosmos (West Europe bywa bez mocy)
CORE_REGION=westeurope             # ACR/KV/LAW/AI

# (opcjonalnie) pełne czyszczenie
# az group delete -n $RG --yes
# az keyvault purge -n $KV   # KV ma soft-delete; po usunięciu RG trzeba purge

# 0) Provider registration (raz na subskrypcję)
az provider register -n Microsoft.App
az provider register -n Microsoft.OperationalInsights
az provider register -n Microsoft.Insights
az provider register -n Microsoft.DocumentDB
az provider register -n Microsoft.KeyVault

# 1) RG + ACR (admin enabled, bo nie mamy prawa do AcrPull przez role assignment)
az group create -n $RG -l $CORE_REGION
az acr create -n $ACR -g $RG -l $CORE_REGION --sku Basic --admin-enabled true

# 2) Log Analytics + App Insights (App Insights przez ARM — patrz §7)
az monitor log-analytics workspace create -g $RG -n law-mealplanner -l $CORE_REGION
LAW_RID=$(az monitor log-analytics workspace show -g $RG -n law-mealplanner --query id -o tsv)
LAW_CID=$(az monitor log-analytics workspace show -g $RG -n law-mealplanner --query customerId -o tsv)
LAW_KEY=$(az monitor log-analytics workspace get-shared-keys -g $RG -n law-mealplanner --query primarySharedKey -o tsv)
AICONN=$(az deployment group create -g $RG -n ai-deploy --template-file appinsights.json \
  --parameters workspaceId="$LAW_RID" location=$CORE_REGION \
  --query "properties.outputs.connectionString.value" -o tsv)

# 3) Container Apps Environment (ARM; w North Europe)
ENVID=$(az deployment group create -g $RG -n cae-deploy --template-file caenv.json \
  --parameters customerId="$LAW_CID" sharedKey="$LAW_KEY" location=$APP_REGION \
  --query "properties.outputs.envId.value" -o tsv)

# 4) Cosmos DB for MongoDB (serverless)
az cosmosdb create -n $COSMOS -g $RG --kind MongoDB --server-version 7.0 \
  --capabilities EnableServerless --locations regionName=$APP_REGION
MONGO=$(az cosmosdb keys list -n $COSMOS -g $RG --type connection-strings \
  --query "connectionStrings[0].connectionString" -o tsv)

# 5) Key Vault + sekrety
az keyvault create -n $KV -g $RG -l $CORE_REGION --enable-rbac-authorization false
TOKENKEY=$(python -c "import secrets,base64;print(base64.urlsafe_b64encode(secrets.token_bytes(64)).decode().rstrip('='))")
az keyvault secret set --vault-name $KV --name token-key --value "$TOKENKEY"
az keyvault secret set --vault-name $KV --name mongo-connstring --value "$MONGO"

# 6) Budowa obrazu backendu (az acr build ZABLOKOWANY → .NET SDK bez Dockera)
ACR_USER=$(az acr credential show -n $ACR --query username -o tsv)
ACR_PW=$(az acr credential show -n $ACR --query "passwords[0].value" -o tsv)
cd MenuChooser-API
SDK_CONTAINER_REGISTRY_UNAME="$ACR_USER" SDK_CONTAINER_REGISTRY_PWORD="$ACR_PW" \
  dotnet publish MenuChooser/MenuChooser.csproj -c Release --os linux --arch x64 \
    -p:PublishProfile=DefaultContainer \
    -p:ContainerRegistry=$ACR.azurecr.io \
    -p:ContainerRepository=mealplanner-api \
    -p:ContainerImageTag=latest
cd ..
# Alternatywa (gdy masz Dockera): docker build -t $ACR.azurecr.io/mealplanner-api:latest MenuChooser-API && docker push ...

# 7) Container App (ARM; port 80, env z DatabaseConfiguration__*, sekrety, ACR admin)
az deployment group create -g $RG -n ca-deploy --template-file containerapp2.json \
  --parameters envId="$ENVID" location=$APP_REGION \
    image="$ACR.azurecr.io/mealplanner-api:latest" \
    acrServer="$ACR.azurecr.io" acrUser="$ACR_USER" acrPassword="$ACR_PW" \
    mongoConn="$MONGO" tokenKey="$TOKENKEY" aiConn="$AICONN"
# FQDN backendu:
az resource show -g $RG -n ca-mealplanner-api --resource-type Microsoft.App/containerApps \
  --query "properties.configuration.ingress.fqdn" -o tsv

# 8) Frontend — §3.B
```

> **Wymagane zmienne aplikacji** (ustawione w `containerapp2.json`, zgodne z `docker-compose.yml`):
> `ASPNETCORE_ENVIRONMENT=Production`, `ASPNETCORE_URLS=http://+:80`,
> `TokenKey` (secretRef), `DatabaseConfiguration__ConnectionString` (secretRef),
> `DatabaseConfiguration__DatabaseName=MenuChooser`,
> `DatabaseConfiguration__CollectionsNames__0..3 = Menu, User, Product, Recipe`,
> `APPLICATIONINSIGHTS_CONNECTION_STRING`, oraz docelowo `Cors__AllowedOrigins__0=<URL frontendu>`.

---

## 5. Diagnostyka backendu (HTTP 504)

Aplikacja przy starcie wykonuje `MongoDBContext.DatabaseInitialization()` — łączy się z Cosmos, tworzy bazę i kolekcje. Jeśli to rzuci wyjątek, kontener pada i ingress zwraca 504.

```bash
RG=rg-mealplanner
LAW_CID=$(az monitor log-analytics workspace show -g $RG -n law-mealplanner --query customerId -o tsv)

# Logi aplikacji (stdout) — szukaj "Initializing MongoDB connection", wyjątków, stack trace
az monitor log-analytics query -w "$LAW_CID" --analytics-query \
  "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'ca-mealplanner-api' | order by TimeGenerated desc | take 80 | project TimeGenerated, Log_s" -o table

# Logi systemowe (restarty, health probe, provisioning)
az monitor log-analytics query -w "$LAW_CID" --analytics-query \
  "ContainerAppSystemLogs_CL | where ContainerAppName_s == 'ca-mealplanner-api' | order by TimeGenerated desc | take 40 | project TimeGenerated, Reason_s, Log_s" -o table
```

Rzeczy do sprawdzenia po kolei:
1. **Połączenie z Cosmos.** Czy w logach jest wyjątek z MongoDB.Driver (TLS/timeout/auth)? Cosmos Mongo wymaga TLS — connstring z `az cosmosdb keys list --type connection-strings` ma `ssl=true`. Zweryfikuj, że sekret `mongo-connstring` w Container App ma pełny connstring (nie ucięty).
2. **Port nasłuchu.** Obraz z .NET SDK domyślnie ma `ASPNETCORE_HTTP_PORTS=8080`; nadpisaliśmy `ASPNETCORE_URLS=http://+:80`, a ingress `targetPort=80`. Potwierdź w logach „Now listening on: http://[::]:80". Jeśli nasłuchuje na 8080 — zmień `targetPort` na 8080 albo wymuś `ASPNETCORE_URLS`.
3. **Czas startu / health probe.** Jeśli start trwa długo (łączenie z Cosmos), dołóż startup/readiness probe albo zwiększ zasoby. Aktualnie `cpu=0.5, memory=1.0Gi, min=max=1 replica`.
4. **Wyrównanie kolekcji** (do zgodności z compose):
```bash
az containerapp update -n ca-mealplanner-api -g $RG --set-env-vars \
  "DatabaseConfiguration__CollectionsNames__0=Menu" \
  "DatabaseConfiguration__CollectionsNames__1=User" \
  "DatabaseConfiguration__CollectionsNames__2=Product" \
  "DatabaseConfiguration__CollectionsNames__3=Recipe"
```
(jeśli `containerapp` ext lokalnie nie działa — zrób update przez ARM/REST, patrz §7.)

Po każdej zmianie sprawdź:
```bash
curl -i https://ca-mealplanner-api.redrock-7f4dea71.northeurope.azurecontainerapps.io/
```

---

## 6. Handoff: GitHub Actions / OIDC (po Twojej stronie — wymaga Owner/Entra)

Mój SP (Contributor) nie może tworzyć aplikacji w Entra ID ani nadawać ról. Wykonaj w Azure Cloud Shell (konto z uprawnieniami Owner/Application Administrator):

```bash
RG=rg-mealplanner
SUB=$(az account show --query id -o tsv)
REPO="Sevdariel/MenuChooser"

# 1) Aplikacja + service principal
az ad app create --display-name gh-actions-mealplanner
APP_ID=$(az ad app list --display-name gh-actions-mealplanner --query "[0].appId" -o tsv)
az ad sp create --id $APP_ID

# 2) Federated credential dla brancha master
az ad app federated-credential create --id $APP_ID --parameters '{
  "name":"gh-master",
  "issuer":"https://token.actions.githubusercontent.com",
  "subject":"repo:'"$REPO"':ref:refs/heads/master",
  "audiences":["api://AzureADTokenExchange"]
}'

# 3) Rola na grupę zasobów (Contributor wystarcza do containerapp update + acr login/push)
az role assignment create --assignee $APP_ID --role Contributor \
  --scope /subscriptions/$SUB/resourceGroups/$RG

# 4) Wartości do sekretów GitHub
echo "AZURE_CLIENT_ID=$APP_ID"
echo "AZURE_TENANT_ID=$(az account show --query tenantId -o tsv)"
echo "AZURE_SUBSCRIPTION_ID=$SUB"
```

W repo → **Settings → Secrets and variables → Actions** dodaj:
- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` (z powyższego),
- `AZURE_STATIC_WEB_APPS_API_TOKEN` = token z `az staticwebapp secrets list -n swa-mealplanner -g rg-mealplanner --query "properties.apiKey" -o tsv`.

Workflowy są już w repo (`.github/workflows/deploy-backend.yml` — `docker build`/`push`; `deploy-frontend.yml` — build Angular + SWA deploy). Po dodaniu sekretów odpalą się na push do `master` (z filtrami ścieżek na `MenuChooser-API/**` i `MenuChooser-Spa/**`).

> Docelowo (gdy nadasz Owner): można przejść z ACR admin user + sekretów-wartości na **managed identity + AcrPull** i **Key Vault `keyvaultref`**. Managed identity Container App principalId: `a0e1dabb-3b78-45cd-a0d4-2289d3d0fd07`.

---

## 7. Szablony ARM (zapisz obok, używane w §4)

### `appinsights.json`
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": { "type": "string", "defaultValue": "westeurope" },
    "workspaceId": { "type": "string" }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/components",
      "apiVersion": "2020-02-02",
      "name": "ai-mealplanner",
      "location": "[parameters('location')]",
      "kind": "web",
      "properties": { "Application_Type": "web", "WorkspaceResourceId": "[parameters('workspaceId')]" }
    }
  ],
  "outputs": {
    "connectionString": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Insights/components','ai-mealplanner')).ConnectionString]"
    }
  }
}
```

### `caenv.json`
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": { "type": "string", "defaultValue": "northeurope" },
    "customerId": { "type": "string" },
    "sharedKey": { "type": "securestring" }
  },
  "resources": [
    {
      "type": "Microsoft.App/managedEnvironments",
      "apiVersion": "2024-03-01",
      "name": "cae-mealplanner",
      "location": "[parameters('location')]",
      "properties": {
        "appLogsConfiguration": {
          "destination": "log-analytics",
          "logAnalyticsConfiguration": {
            "customerId": "[parameters('customerId')]",
            "sharedKey": "[parameters('sharedKey')]"
          }
        }
      }
    }
  ],
  "outputs": {
    "envId": { "type": "string", "value": "[resourceId('Microsoft.App/managedEnvironments','cae-mealplanner')]" }
  }
}
```

### `containerapp2.json`
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": { "type": "string", "defaultValue": "northeurope" },
    "envId": { "type": "string" },
    "image": { "type": "string" },
    "acrServer": { "type": "string" },
    "acrUser": { "type": "string" },
    "acrPassword": { "type": "securestring" },
    "mongoConn": { "type": "securestring" },
    "tokenKey": { "type": "securestring" },
    "aiConn": { "type": "string" }
  },
  "resources": [
    {
      "type": "Microsoft.App/containerApps",
      "apiVersion": "2024-03-01",
      "name": "ca-mealplanner-api",
      "location": "[parameters('location')]",
      "identity": { "type": "SystemAssigned" },
      "properties": {
        "managedEnvironmentId": "[parameters('envId')]",
        "configuration": {
          "activeRevisionsMode": "Single",
          "ingress": { "external": true, "targetPort": 80, "transport": "auto", "allowInsecure": false },
          "registries": [
            { "server": "[parameters('acrServer')]", "username": "[parameters('acrUser')]", "passwordSecretRef": "acr-password" }
          ],
          "secrets": [
            { "name": "acr-password", "value": "[parameters('acrPassword')]" },
            { "name": "mongo-connstring", "value": "[parameters('mongoConn')]" },
            { "name": "token-key", "value": "[parameters('tokenKey')]" }
          ]
        },
        "template": {
          "containers": [
            {
              "name": "api",
              "image": "[parameters('image')]",
              "resources": { "cpu": 0.5, "memory": "1.0Gi" },
              "env": [
                { "name": "ASPNETCORE_ENVIRONMENT", "value": "Production" },
                { "name": "ASPNETCORE_URLS", "value": "http://+:80" },
                { "name": "APPLICATIONINSIGHTS_CONNECTION_STRING", "value": "[parameters('aiConn')]" },
                { "name": "TokenKey", "secretRef": "token-key" },
                { "name": "DatabaseConfiguration__ConnectionString", "secretRef": "mongo-connstring" },
                { "name": "DatabaseConfiguration__DatabaseName", "value": "MenuChooser" },
                { "name": "DatabaseConfiguration__CollectionsNames__0", "value": "Menu" },
                { "name": "DatabaseConfiguration__CollectionsNames__1", "value": "User" },
                { "name": "DatabaseConfiguration__CollectionsNames__2", "value": "Product" },
                { "name": "DatabaseConfiguration__CollectionsNames__3", "value": "Recipe" }
              ]
            }
          ],
          "scale": { "minReplicas": 1, "maxReplicas": 1 }
        }
      }
    }
  ],
  "outputs": {
    "fqdn": { "type": "string", "value": "[reference(resourceId('Microsoft.App/containerApps','ca-mealplanner-api')).configuration.ingress.fqdn]" }
  }
}
```

---

## 8. Skrót: kolejne kroki (TODO)
1. [ ] Zdiagnozować i naprawić HTTP 504 backendu (§5: logi → Cosmos/port).
2. [ ] Wyrównać kolekcje do `Menu, User, Product, Recipe` (§5 krok 4 / `containerapp2.json` już to ma).
3. [ ] Utworzyć i wdrożyć Static Web App; ustawić URL API w froncie; dodać CORS (§3.B).
4. [ ] Weryfikacja end-to-end (§3.C).
5. [ ] Po Twojej stronie: OIDC + sekrety GitHub, żeby ruszył automatyczny CI/CD (§6).
