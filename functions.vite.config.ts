import {defineConfig} from 'vite';
import glob from 'glob';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  build: {
    outDir: './netlify/edge-functions',
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync('src/functions/*.ts').map(file =>
          [path.basename(file, path.extname(file)), file]
        )
      ),
      output: {
        entryFileNames: '[name].js',
      }
    }
  }
});
