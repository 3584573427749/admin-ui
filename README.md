# Admin UI

Administrationsgränssnitt för Simning.ax.

Admin UI används för administration av användare, roller och andra funktioner i systemet via Auth Service och övriga backendtjänster.

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

Exempel på stores:

```text
notificationStore
userStore
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
userService
        ↓
userStore
        ↓
Vue-komponenter
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
├── api/
├── components/
├── generated/
├── router/
├── services/
├── stores/
├── views/

tests/
├── components/
├── e2e/
├── fixtures/
└── stores/
```
