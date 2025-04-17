import { defineConfig } from 'rolldown';
import wasm from '@rollup/plugin-wasm';

export default defineConfig({
    input: 'src/index.js',
    output: {
        dir: 'dist',
        format: 'esm',
    },
    plugins: [
        wasm(),
    ],
});