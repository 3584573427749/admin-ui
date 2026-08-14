````md
# Admin UI

Administrationsgränssnitt för Simning.ax.

Admin UI används för administration av användare, roller och andra funktioner i systemet via Auth Service och övriga backendtjänster.

## Funktionalitet

### Användare

- Skapa användare
- Redigera användare
- Ta bort användare
- Visa användare
- Tilldela roller
- Ta bort roller från användare

### Roller

- Skapa roll
- Redigera roll
- Ta bort roll
- Visa användare med vald roll
- Ta bort användare från roll

### Navigation

- Deep linking för användare
- Deep linking för roller
- Bokmärkningsbara URL:er
- Återställning av vald användare eller roll efter omladdning

## Teknikstack

- Vue 3
- Pinia
- Vue Router
- Vuetify
- Vite
- OpenAPI
- Vitest
- Playwright
- Docker
- Nginx

## Komma igång

### Förutsättningar

- Node.js 24
- npm

### Installera beroenden

```bash
npm install
```
````

### Starta utvecklingsserver

```bash
npm run dev
```

Applikationen startar normalt på:

```text
http://localhost:5173
```

## OpenAPI och typer

Frontendens modeller genereras från OpenAPI-specifikationen.

Generera typer:

```bash
npm run generate-types
```

Typerna skapas i:

```text
src/generated/types.ts
```

`openapi.yaml` är den primära källan för API-kontraktet.

## Tester

### Enhetstester och komponenttester

```bash
npm run test:unit
```

### End-to-end-tester

```bash
npm run test:e2e
```

### Samtliga tester

```bash
npm test
```

### Testområden

Applikationen innehåller tester för:

- Stores
- Services
- Vue-komponenter
- Dialoger
- Routing-relaterad logik

Exempel:

```text
userStore
roleStore
userService
roleService
ConfirmDialog
UserInfoTab
RoleInfoTab
RoleUsersTab
```

## Kodkvalitet

### ESLint

```bash
npm run lint
```

### Prettier

Formatera kod:

```bash
npm run format
```

Kontrollera formatering:

```bash
npm run format:check
```

## Docker

### Bygg image

```bash
docker build -t admin-ui .
```

### Starta container

```bash
docker run -p 8080:80 admin-ui
```

Applikationen blir tillgänglig via:

```text
http://localhost:8080
```

## Arkitektur

### State Management

Tillstånd hanteras med Pinia.

Stores:

```text
notificationStore
userStore
roleStore
```

### Notifieringar

Applikationen använder ett centralt toast-system.

Exempel:

```js
notifications.success('Användaren har skapats.');
notifications.error(error);
```

OpenAPI-fel översätts automatiskt till användarvänliga meddelanden i `notificationStore`.

### API-kommunikation

```text
openapi.yaml
        ↓
generated/types.ts
        ↓
Services
(userService, roleService)
        ↓
Stores
(userStore, roleStore)
        ↓
Vue-komponenter
```

### Routing

Vue Router används för navigation och deep linking.

Följande URL:er stöds:

```text
/
/anvandare
/anvandare/{id}

/roller
/roller/{id}

/anvandare/raderade
```

Vald användare eller roll kan nås direkt via URL och återställs vid omladdning av sidan.

### Komponentstruktur

Användar- och rollhantering är uppdelad i separata vyer och komponenter.

Exempel:

```text
UsersView
├── UserInfoTab

RolesView
├── RoleInfoTab
└── RoleUsersTab
```

Gemensamma komponenter:

```text
ConfirmDialog
ToastItem
```

## CI/CD

### CI

Pull requests valideras genom:

- OpenAPI-validering
- ESLint
- Enhets- och komponenttester
- Produktionsbyggning

### Release

Releaser skapas genom att pusha en versionsetikett:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Release-pipelinen bygger och publicerar Docker-imagen.

## Projektstruktur

```text
src/
├── assets/
├── components/
│   ├── roles/
│   ├── users/
│   ├── ConfirmDialog.vue
│   └── ToastItem.vue
├── generated/
├── layouts/
├── router/
├── services/
│   ├── apiService.js
│   ├── userService.js
│   └── roleService.js
├── stores/
│   ├── notificationStore.js
│   ├── userStore.js
│   └── roleStore.js
├── views/
│   ├── HomeView.vue
│   ├── UsersView.vue
│   ├── RolesView.vue
│   └── DeletedUsersView.vue

tests/
├── components/
├── e2e/
├── fixtures/
├── services/
└── stores/
```
