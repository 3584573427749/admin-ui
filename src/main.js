import './assets/base.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme() {
    document.documentElement.setAttribute('data-theme', prefersDark.matches ? 'dark' : 'light');
}

applyTheme();

prefersDark.addEventListener('change', applyTheme);