import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const version = fs.readFileSync('./VERSION', 'utf-8').trim();

export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(version)
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },

    plugins: [vue()],

    server: {
        host: '0.0.0.0',
        port: 5173,
        watch: {
            usePolling: true
        },
        proxy: {
            '/auth': {
                target: 'http://auth:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/auth/, '')
            },

            '/group': {
                target: 'http://group:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/group/, '')
            }
        }
    },

    test: {
        environment: 'jsdom',
        include: ['tests/**/*.test.js'],
        coverage: {
            provider: 'v8'
        }
    }
});
