import fs from 'node:fs'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const version = fs.readFileSync('./VERSION', 'utf-8').trim()

export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(version)
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    plugins: [
        vue()
    ]
})