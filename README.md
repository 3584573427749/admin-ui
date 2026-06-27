# Vue Web UI Template

En mall för att snabbt skapa administrativa webbgränssnitt med Vue 3.

Mallen innehåller en färdig grundstruktur för:

* autentisering
* routing
* applikationslayout
* navigering
* tema-hantering
* API-kommunikation
* Docker-distribution

Syftet är att ge en konsekvent startpunkt för alla webbgränssnitt inom plattformen.

***

## Innehåll

* Vue 3
* Vite
* Pinia
* Vue Router
* Vuetify 3
* Responsiv navigering (desktop och touch)
* Ljust/mörkt tema baserat på webbläsarens inställningar
* AppLayout med:
    * Header
    * Navigering
    * Main Content
    * Footer
* Auth Store
* API Service
* Route Guards
* VERSION-fil
* Docker-image (Nginx)
* ESLint
* Prettier

***

## Projektstruktur

```text
src
├── assets
│   ├── base.css
│   └── main.css
│
├── components
│   └── NavBar.vue
│
├── layouts
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   └── AppLayout.vue
│
├── router
│   ├── index.js
│   └── guard.js
│
├── services
│   ├── apiService.js
│   └── appVersion.js
│
├── stores
│   └── auth.js
│
├── views
│   ├── HomeView.vue
│   ├── LoginView.vue
│   └── 404View.vue
│
└── App.vue
```

***

## Routing

Mallen innehåller stöd för:

* publik inloggningssida
* skyddade rutter
* 404-hantering

Exempel:

```text
/login
/
/about
/jibberish
```

Alla applikationsrutter är avsedda att skyddas av auth-guard.

***

## Teman

Mallen stödjer:

* Light Theme
* Dark Theme

Tema väljs automatiskt utifrån användarens operativsystem/webbläsare via:

```css
prefers-color-scheme
```

Färgvariabler definieras i:

```text
src/assets/base.css
```

***

## Utveckling

Installera beroenden:

```bash
npm install
```

Starta utvecklingsserver:

```bash
npm run dev
```

Standardadress:

```text
http://localhost:5173
```

***

## Bygg

Skapa produktionsbuild:

```bash
npm run build
```

Förhandsgranska build:

```bash
npm run preview
```

***

## Docker

Bygg image:

```bash
docker build -t web-ui .
```

Kör lokalt:

```bash
docker run -p 8080:80 web-ui
```

***

## Versionshantering

Applikationsversion hämtas från filen:

```text
VERSION
```

Versionen exponeras i användargränssnittet via:

```js
APP_VERSION
```

***

## Anpassning

Efter att ett nytt projekt skapats från mallen bör minst följande uppdateras:

* Projektnamn
* Menystruktur
* API-endpoints
* Auth-flöde
* Färgtema
* Docker-image-namn
