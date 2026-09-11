/**
 * scripts/postbuild.js
 *
 * Ejecutado automáticamente por npm después de "vite build".
 *
 * Hace que docs/index.html y dist/index.html funcionen con file:// Y en GitHub Pages:
 *  1. Copia sw.js, manifest.json y .nojekyll a /docs y a /dist.
 *  2. Quita type="module" y crossorigin del <script> del bundle.
 *     → Los módulos ES no se pueden cargar en file:// por CORS,
 *       pero el bundle IIFE funciona perfectamente como script clásico.
 *  3. Sincroniza /docs con /dist para máxima comodidad del usuario.
 */

const fs   = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const distDir = path.join(__dirname, '..', 'dist');

// Asegurar directorios
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

// ─── 1. Copiar archivos de raíz al /docs y /dist ───────────────────────────────
const filesToCopy = [
  ['sw.js',        'sw.js'],
  ['manifest.json','manifest.json'],
];

for (const [src, dest] of filesToCopy) {
  const srcPath = path.join(__dirname, '..', src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(docsDir, dest));
    fs.copyFileSync(srcPath, path.join(distDir, dest));
  }
}

// Crear .nojekyll vacío para GitHub Pages
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// ─── 2. Parchear docs/index.html para file:// ──────────────────────────────────
function patchHtml(targetDir) {
  const htmlPath = path.join(targetDir, 'index.html');
  if (!fs.existsSync(htmlPath)) return;
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Quitar type="module" y crossorigin del tag <script> del bundle
  html = html.replace(
    /<script\s+type="module"\s+crossorigin\s+src="([^"]+)"><\/script>/g,
    '<script src="$1"></script>'
  );

  // Quitar crossorigin del tag <link rel="stylesheet"> si existe
  html = html.replace(
    /<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+)">/g,
    '<link rel="stylesheet" href="$1">'
  );

  fs.writeFileSync(htmlPath, html, 'utf8');
}

patchHtml(docsDir);

// ─── 3. Sincronizar docs/ a dist/ completamente ───────────────────────────────
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(docsDir, distDir);
patchHtml(distDir);

// ─── Reporte ──────────────────────────────────────────────────────────────────
console.log('');
console.log('✅ postbuild completado:');
console.log('   • sw.js, manifest.json, .nojekyll listos en docs/ y dist/');
console.log('   • index.html parcheado para soporte 100% nativo de file://');
console.log('   • docs/ y dist/ sincronizados');
console.log('');
console.log('📂 Abre docs/index.html o dist/index.html directamente en el navegador (file://)');
console.log('🌐 O en GitHub Pages desde la carpeta /docs');
console.log('');
