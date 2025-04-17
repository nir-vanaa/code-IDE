import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const ReactCompilerConfig = {
  target: '19'
};

// https://vite.dev/config/
export default defineConfig({
  preview: {
    port: 5173,
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
