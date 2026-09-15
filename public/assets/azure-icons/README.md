# Ikony Azure w Legacy Dash

Gra rysuje gemy jako monogram (`CA`, `AOAI`, `KV`…). Jeśli w tym folderze znajdzie plik SVG o właściwej nazwie, sama podmienia go na prawdziwą ikonę. Brak pliku = zostaje monogram, nic się nie psuje.

## Skąd wziąć ikony

Oficjalny pakiet Microsoftu: **Azure architecture icons** na Microsoft Learn — szukaj „Azure architecture icons download". Pobierasz jeden ZIP z kompletem SVG.

Warunki licencji Microsoftu w skrócie: ikon wolno używać do diagramów architektury, materiałów szkoleniowych i dokumentacji. Nie wolno ich modyfikować, przebarwiać ani używać jako własnego logo. Gra rysuje je bez zmian, więc jesteś czysty — nie koloruj ich pod paletę.

## Włączenie

Po wrzuceniu plików znajdź w `siwek.cloud - home.dc.html` linijkę:

```js
const USE_AZURE_ICONS = false;
```

i ustaw ją na `true`. Dopóki jest `false`, gra nie wysyła żadnych zapytań o ikony i rysuje monogramy.

## Nazwy plików

Wypakuj z ZIP-a te ikony, przemianuj i wrzuć tutaj:

| Plik | Ikona w pakiecie Microsoftu |
|---|---|
| `container-apps.svg` | Container Apps |
| `azure-openai.svg` | Azure OpenAI |
| `key-vault.svg` | Key Vaults |
| `storage-accounts.svg` | Storage Accounts |
| `cosmos-db.svg` | Azure Cosmos DB |
| `front-door.svg` | Front Door and CDN Profiles |
| `service-bus.svg` | Service Bus |
| `log-analytics.svg` | Log Analytics Workspaces |
| `api-management.svg` | API Management Services |
| `function-apps.svg` | Function Apps |

Nazwy w pakiecie mają prefiksy numeryczne (np. `10841-icon-service-Container-Apps.svg`) — przemianuj je na powyższe.

## Jak zmienić listę usług

Tablica `SERVICES` w `siwek.cloud - home.dc.html`. Każdy wpis to `code` (monogram zapasowy), `name` (nazwa w HUD po zebraniu), `c` (kolor obramowania i poświaty) i `icon` (nazwa pliku). Dodanie usługi = jedna linijka.

## Uwagi techniczne

- Ikony ładują się asynchronicznie przy starcie; pierwsza klatka może pokazać monogram, potem podmienia się sama.
- Rysowane są z zachowaniem proporcji, wpisane w kafelek 32 px z 6 px marginesu.
- Kolorowa ramka i poświata zostają wokół ikony — to one niosą kod koloru, nie sama ikona.
- SVG wczytywane przez `Image` nie może mieć zewnętrznych referencji (fontów, obrazów). Ikony Microsoftu są samowystarczalne, więc działają.
