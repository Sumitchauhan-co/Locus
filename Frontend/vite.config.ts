import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), visualizer() as PluginOption],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('framer-motion')) {
                            return 'animations';
                        }
                        if (id.includes('leaflet')) {
                            return 'map';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
});
