import { defineConfig } from 'vite';

/**
 * Vite Configuration — EduAventura G4
 *
 * base: './' → rutas relativas para file:// y GitHub Pages
 * format: 'iife' → bundle clásico sin tipo "module", compatible con file://
 */
export default defineConfig({
  base: './',
  root: '.',
  publicDir: 'public',
  build: {
    // 'docs' → GitHub Pages puede servir desde /docs en la rama main
    // sin necesidad de GitHub Actions: Settings → Pages → /docs
    outDir: 'docs',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: './index.html',
      output: {
        // IIFE: no usa import/export → funciona en file:// sin bloqueo CORS
        format: 'iife',
        // Nombre del bundle global (requerido por iife)
        name: 'EduAventura',
        // Nombres de archivo sin hash para que el SW los pueda listar fácilmente
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
