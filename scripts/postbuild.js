/**
 * scripts/postbuild.js
 *
 * Ejecutado automáticamente por npm después de "vite build".
 *
 * Hace que docs/index.html y dist/index.html funcionen con file:// Y en GitHub Pages:
 *  1. Genera un identificador de compilación único (timestamp) para romper cachés automáticamente.
 *  2. Inyecta el CACHE_NAME versionado en docs/sw.js y dist/sw.js.
 *  3. Genera version.json en docs/, dist/ y public/ para auto-detección instantánea en el cliente.
 *  4. Inyecta query param de versión en el script bundle (<script defer src="./assets/app.js?v=...">).
 *  5. Quita type="module" y crossorigin del <script> del bundle para soporte 100% de file://.
 *  6. Sincroniza /docs con /dist.
 */

const fs   = require('fs');
const path = require('path');

const rootDir   = path.join(__dirname, '..');
const docsDir   = path.join(rootDir, 'docs');
const distDir   = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

// Asegurar directorios
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

// ─── 0. Generar ID único de compilación (timestamp) ───────────────────────────
const buildTimestamp = Date.now();
const versionData = JSON.stringify({
  buildTime: buildTimestamp,
  version: '1.0.0',
  builtAt: new Date().toISOString()
}, null, 2);

// Escribir version.json en public/, docs/ y dist/
fs.writeFileSync(path.join(publicDir, 'version.json'), versionData, 'utf8');
fs.writeFileSync(path.join(docsDir, 'version.json'), versionData, 'utf8');
fs.writeFileSync(path.join(distDir, 'version.json'), versionData, 'utf8');

// ─── 1. Copiar y versionar sw.js y archivos estáticos ─────────────────────────
let swSource = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');
swSource = swSource.replace(
  /CACHE_NAME\s*=\s*['"][^'"]+['"]/,
  `CACHE_NAME = 'eduaventura-build-${buildTimestamp}'`
);

fs.writeFileSync(path.join(docsDir, 'sw.js'), swSource, 'utf8');
fs.writeFileSync(path.join(distDir, 'sw.js'), swSource, 'utf8');

const filesToCopy = [
  ['manifest.json',  'manifest.json'],
  ['favicon.svg',    'favicon.svg'],
  ['favicon.png',    'favicon.png'],
  ['favicon-32.png', 'favicon-32.png'],
];

for (const [src, dest] of filesToCopy) {
  const srcPath = path.join(rootDir, src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(docsDir, dest));
    fs.copyFileSync(srcPath, path.join(distDir, dest));
  }
}

// Crear .nojekyll vacío para GitHub Pages
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// ─── 2. Parchear index.html para file:// y auto-busting de caché ──────────────
function patchHtml(targetDir) {
  const htmlPath = path.join(targetDir, 'index.html');
  if (!fs.existsSync(htmlPath)) return;
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Quitar type="module" y crossorigin del tag <script> del bundle y agregar defer con versión
  html = html.replace(
    /<script(?:\s+type="module")?(?:\s+crossorigin)?\s+src="([^"?]+)(?:\?v=[^"]*)?"><\/script>/g,
    `<script defer src="$1?v=${buildTimestamp}"></script>`
  );

  // Asegurar que scripts existentes tengan el versionado
  html = html.replace(
    /<script\s+defer\s+src="([^"?]+)(?:\?v=[^"]*)?"><\/script>/g,
    `<script defer src="$1?v=${buildTimestamp}"></script>`
  );

  // Quitar crossorigin del tag <link rel="stylesheet"> si existe
  html = html.replace(
    /<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+)">/g,
    '<link rel="stylesheet" href="$1">'
  );

  // Asegurar meta tags anti-caché en <head> si no existen
  if (!html.includes('http-equiv="Cache-Control"')) {
    html = html.replace(
      '<head>',
      `<head>\n    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n    <meta http-equiv="Pragma" content="no-cache" />\n    <meta http-equiv="Expires" content="0" />`
    );
  }

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
console.log(`   • Versión de compilación generada: ${buildTimestamp}`);
console.log('   • sw.js actualizado con nuevo CACHE_NAME único y Network-First');
console.log('   • version.json generado en public/, docs/ y dist/');
console.log('   • index.html parcheado con script versionado (?v=...) y meta anti-caché');
console.log('   • docs/ y dist/ sincronizados');
console.log('');
console.log('📂 Abre docs/index.html o dist/index.html directamente en el navegador (file://)');
console.log('🌐 O en GitHub Pages desde la carpeta /docs');
console.log('');
