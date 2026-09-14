/**
 * @file main.js — EduAventura G4 · Controlador Principal "Duolingo × Brawl Stars" v2.5
 * Menú Principal (Lobby) · Modo Aventura (Islas) · Modo Libre (Contrarreloj) · Minitienda
 * Pantalla Completa Permanente · CERO Alertas de Navegador · Anti-Farming de Monedas
 */

import { loadSave, saveSave, resetSave } from './core/storage.js';
import { initState, transition, getCurrentState, getSaveData, setSaveData } from './core/state.js';
import {
  playPop,
  playClick,
  playCorrect,
  playCoin,
  playStar,
  playError,
  playVictory,
  playGuide,
  playWhoosh,
  playTick,
  playBuy,
  playUnlock,
  startBGM,
  setBgmTheme,
  setBgmSpeed,
  setSfxEnabled,
  isSfxEnabled,
  setMusicEnabled,
  isMusicEnabled,
} from './core/audio.js';
import {
  showDidacticGuideModal,
  showVictoryModal,
  showGameOverModal,
  showPauseModal,
  showProfileModal,
  showAchievementsModal,
  showTasksModal,
  showSettingsModal,
  showConfirmModal,
  showToast,
  showFreeModeBriefingModal,
  showCloudModal,
  attachPersistentScrollbar,
} from './ui/modals.js';
import {
  cleanStudentId,
  loginStudent,
  registerStudent,
  logoutStudent,
  saveProgressToCloud,
  fetchProgressFromCloud,
  smartMergeSave,
} from './core/firebase.js';
import { getClaimableTasksCount } from './data/tasks_data.js';
import { getDidacticGuide, shouldAutoShowGuide } from './data/didactic_guides.js';
import { STORE_ITEMS, RARITIES, getAvatarRarity, getTitleRarity } from './data/store_items.js';
import { showRouletteModal, isFreeSpinAvailable, getTimeUntilNextFreeSpin, ROULETTE_TYPES } from './ui/roulette.js';

// ─── Configuración de Módulos (Sin etiquetas de "Grado") ─────────────────────
const MODS = {
  m1_multiplicacion: {
    n: 1,
    name: 'Módulo 1',
    topic: 'Multiplicación',
    sub: 'Tablas y Grupos Iguales',
    dioramaClass: 'diorama--jungle',
    emoji: '🦁',
    mathHint: '3 × 4 = 12',
    color: '#2ECC71',
    dark: '#27AE60',
    totalLevels: 20,
    freeModeBaseTime: 15,
  },
  m2_division: {
    n: 2,
    name: 'Módulo 2',
    topic: 'División',
    sub: 'Repartos y Algoritmos',
    dioramaClass: 'diorama--desert',
    emoji: '🏺',
    mathHint: '24 ÷ 6 = 4',
    color: '#E67E22',
    dark: '#D35400',
    totalLevels: 20,
    freeModeBaseTime: 20,
  },
  m3_fracciones_intro: {
    n: 3,
    name: 'Módulo 3',
    topic: 'Fracciones I',
    sub: 'Noción y Representación',
    dioramaClass: 'diorama--farm',
    emoji: '🌾',
    mathHint: '1/2 y 1/4',
    color: '#9B59B6',
    dark: '#8E44AD',
    totalLevels: 20,
    freeModeBaseTime: 25,
  },
  m4_fracciones_ops: {
    n: 4,
    name: 'Módulo 4',
    topic: 'Fracciones II',
    sub: 'Operaciones Homogéneas',
    dioramaClass: 'diorama--space',
    emoji: '🚀',
    mathHint: '2/5 + 1/5 = 3/5',
    color: '#3498DB',
    dark: '#2980B9',
    totalLevels: 20,
    freeModeBaseTime: 30,
  },
};

const AVATAR_QUOTES = [
  '¡Hola! Soy tu compañero de aventuras. ¡Vamos a ganar estrellas hoy! ⭐',
  '¡Cada error te hace más inteligente! Analiza y supéralo con calma. 🧠💪',
  '¡El Modo Libre es genial para entrenar velocidad y ganar monedas! ⚡🪙',
  '¡Visita la Minitienda para desbloquear avatares y lemas legendarios! 🛍️',
  '¡La perseverancia vence cualquier desafío matemático! 🚀',
  '💡 Multiplicar por 4: ¡Duplica dos veces! Ej: 6 × 4 = 12 × 2 = 24. 🎯',
  '💡 Todo número por 0 da 0, ¡y por 1 da el mismo número! 0️⃣',
  '💡 Multiplicar por 5: Saca la mitad y añade un cero al final. 🖐️',
  '💡 Tabla del 9: Las cifras del resultado siempre suman 9. Ej: 9 × 7 = 63. 🧩',
  '💡 Dividir es repartir en partes iguales sin que nadie sobre. ⚖️',
  '💡 Criterio del 3: Si las cifras suman 3, 6 o 9, ¡se puede dividir por 3! ✨',
  '💡 Fracciones: Numerador (arriba) y Denominador (partes totales). 🍰',
  '💡 Fracciones: Si numerador y denominador son iguales, ¡tienes 1 entero! 🌟',
  '💡 Fracciones: Con igual denominador, ¡solo se suman los de arriba! ➕',
  '💡 Cálculo mental: Para 28 + 15, suma 28 + 10 = 38 y luego suma 5 = 43. ⚡',
  '💡 Doble y mitad: Duplica un factor y divide el otro: 4 × 15 = 2 × 30 = 60. 🔄',
  '¡Estás entrenando tu mente como un auténtico campeón! 🏅',
  '¿Sabías que las matemáticas están en la música y los videojuegos? 🎮🎶',
  '¡Respira antes de responder! La calma te da máxima puntería mental. 🧘',
  '¡Una racha de x5 o x10 en Modo Libre multiplica tus monedas! 🪙🔥',
  '¡Si completas los 20 niveles de una isla, ganas la corona dorada! 👑',
  '¡En el Colegio Laureano Gómez nos formamos con excelencia! 🏫',
  '¡Un gran matemático nunca se rinde ante un desafío difícil! 🛡️',
  '💡 Resta rápida: Piensa cuánto le falta al menor para llegar al mayor. 🎯',
  '💡 Conmutativa: El orden de los factores no altera el producto: 7 × 8 = 56. 🔄',
  '💡 División inversa: ¿Qué número por el divisor da el total? 🧩',
  '¡Tu esfuerzo constante te llevará a resolver retos asombrosos! ✨',
  '💡 Equivalencias: 1/2 es lo mismo que 2/4 y que 4/8. ¡Misma porción! 🍕',
  '¡Pon a prueba tu récord en el Modo Libre y supera tu marca! ⏱️',
  '¡Tócame cuando quieras un nuevo consejo matemático! 🐾',
  '💡 Multiplicar decenas: Para 40 × 6, calcula 4 × 6 = 24 y pon el cero: 240. 🚀',
  '💡 Dividir decenas: Para 240 ÷ 4, calcula 24 ÷ 4 = 6 y pon el cero: 60. 🎯',
  '¡La curiosidad es el motor del aprendizaje! Sigue explorando. 🗺️',
  '¡Cada nivel completado es una victoria para tu futuro! 🌟',
  '💡 Números pares: Terminados en 0, 2, 4, 6 u 8 se dividen por 2. ✌️',
];

let _lastQuoteIndex = -1;
function _getNextAvatarQuote() {
  if (!AVATAR_QUOTES || AVATAR_QUOTES.length === 0) return '';
  if (AVATAR_QUOTES.length === 1) return AVATAR_QUOTES[0];
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * AVATAR_QUOTES.length);
  } while (nextIndex === _lastQuoteIndex);
  _lastQuoteIndex = nextIndex;
  return AVATAR_QUOTES[nextIndex];
}

// Estado global de sesión
let _currentCombo = 0;
let _freeModeActiveTopic = null;
let _freeModeTimerInterval = null;
let _freeModeKeyHandler = null;
let _freeModeStoreCategory = 'avatar';
let _storeRarityFilter = 'basic';
let _rouletteTicker = null;

// ─── Control Permanente de Pantalla Completa (Cruceta Normal / Invertida) ──────
function _getFullscreenSvg(isFull) {
  if (isFull) {
    // Cruceta invertida apuntando hacia adentro (minimizar/restaurar)
    return `<svg class="fullscreen-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h5V4m6 0v5h5m0 6h-5v5m-6 0v-5H4"/></svg>`;
  }
  // Cruceta apuntando hacia afuera (agrandar pantalla completa)
  return `<svg class="fullscreen-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
}

function _updateFullscreenButtons() {
  const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  document.querySelectorAll('.btn-fullscreen-toggle').forEach((btn) => {
    btn.innerHTML = _getFullscreenSvg(isFull);
    btn.title = isFull ? 'Salir de pantalla completa' : 'Pantalla completa';
  });
  if (document.body) {
    if (isFull) {
      document.body.classList.add('is-fullscreen');
    } else {
      document.body.classList.remove('is-fullscreen');
    }
  }
  if (document.documentElement) {
    if (isFull) {
      document.documentElement.classList.add('is-fullscreen');
    } else {
      document.documentElement.classList.remove('is-fullscreen');
    }
  }
}

function _toggleFullscreen() {
  playPop();
  const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  if (!isFull) {
    const docEl = document.documentElement;
    const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    if (req) {
      req.call(docEl).catch(() => {});
    }
  } else {
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (exit) {
      exit.call(document).catch(() => {});
    }
  }
}

document.addEventListener('fullscreenchange', _updateFullscreenButtons);
document.addEventListener('webkitfullscreenchange', _updateFullscreenButtons);
document.addEventListener('mozfullscreenchange', _updateFullscreenButtons);
document.addEventListener('MSFullscreenChange', _updateFullscreenButtons);
window.addEventListener('resize', _updateFullscreenButtons);

// ─── Service Worker ───────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then((r) => console.log('[SW Activo]', r.scope))
      .catch((e) => console.warn('[SW Offline]', e.message));
  });
}

// ─── Orientación de Pantalla (Bloqueo en Vertical y Adaptación Responsiva) ────
const checkOrient = () => {
  const rotateEl = document.getElementById('rotate-screen');
  const isPortrait = (
    window.innerHeight > window.innerWidth ||
    (window.screen?.orientation?.type ? window.screen.orientation.type.startsWith('portrait') : false) ||
    (window.matchMedia ? window.matchMedia('(orientation: portrait)').matches : false)
  );

  if (rotateEl) {
    rotateEl.style.display = isPortrait ? 'flex' : 'none';
  }

  if (document.documentElement) {
    if (isPortrait) {
      document.documentElement.classList.add('is-portrait');
      document.documentElement.classList.remove('is-landscape');
    } else {
      document.documentElement.classList.remove('is-portrait');
      document.documentElement.classList.add('is-landscape');
    }
  }

  if (document.body) {
    if (isPortrait) {
      document.body.classList.add('is-portrait');
      document.body.classList.remove('is-landscape');
    } else {
      document.body.classList.remove('is-portrait');
      document.body.classList.add('is-landscape');
    }
  }
};
window.addEventListener('resize', checkOrient, { passive: true });
window.addEventListener('orientationchange', () => {
  checkOrient();
  setTimeout(checkOrient, 50);
  setTimeout(checkOrient, 150);
  setTimeout(checkOrient, 350);
}, { passive: true });
if (window.screen && window.screen.orientation) {
  window.screen.orientation.addEventListener('change', checkOrient);
}

// ─── FSM Render Dispatcher ───────────────────────────────────────────────────
window.addEventListener('eduaventura:statechange', (e) => {
  _renderState(e.detail.to, e.detail.context);
});

// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR DE RENDER
// ═══════════════════════════════════════════════════════════════════════════════

function _renderState(state, ctx = {}) {
  const app = document.getElementById('app-container');
  if (!app) return;

  // Actualizar tema musical procedural según pantalla
  switch (state) {
    case 'WELCOME':
    case 'LOBBY':
    case 'MODULE_SELECT':
      setBgmTheme('lobby');
      break;
    case 'LEVEL_BOARD':
    case 'GAMEPLAY':
      setBgmTheme('gameplay');
      break;
    case 'FREE_MODE':
      setBgmTheme('freemode');
      break;
    case 'STORE':
      setBgmTheme('store');
      break;
  }

  // Limpiar timers activos de Modo Libre si salimos y reiniciar velocidad
  if (state !== 'FREE_MODE') {
    _stopFreeModeTimer();
    setBgmSpeed(1.0);
  }

  app.querySelectorAll('.screen--dynamic').forEach((s) => {
    s.style.transition = 'opacity .18s ease';
    s.style.opacity = '0';
    s.style.pointerEvents = 'none';
    setTimeout(() => s.remove(), 200);
  });

  const screen = document.createElement('div');
  screen.className = 'screen screen--dynamic';
  screen.style.opacity = '0';
  screen.style.transition = 'opacity .22s ease';

  switch (state) {
    case 'WELCOME':       screen.innerHTML = _tplWelcome();          break;
    case 'LOBBY':         screen.innerHTML = _tplLobby();            break;
    case 'MODULE_SELECT': screen.innerHTML = _tplOverworld();        break;
    case 'LEVEL_BOARD':   screen.innerHTML = _tplLevelBoard(ctx.mk); break;
    case 'GAMEPLAY':      screen.innerHTML = _tplGameplay(ctx);      break;
    case 'FREE_MODE':     screen.innerHTML = _tplFreeMode(ctx);      break;
    case 'STORE':         screen.innerHTML = _tplStore();            break;
    default: screen.innerHTML = `<div style="padding:2rem;color:#fff">Estado: ${state}</div>`;
  }

  app.appendChild(screen);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    screen.style.opacity = '1';
    screen.classList.add('screen--active');
    _bind(state, screen, ctx);
  }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLANTILLAS HTML
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Sincronización Global de Botones de Audio en HUD y Modales ──────────────
function _syncHudAudioButtons() {
  const sfxBtn = document.getElementById('hud-btn-sfx');
  const musicBtn = document.getElementById('hud-btn-music');
  if (sfxBtn) {
    const sfxOn = isSfxEnabled();
    sfxBtn.className = `btn-round-brawl ${sfxOn ? '' : 'btn-round-brawl--muted'}`;
    sfxBtn.innerHTML = sfxOn ? '🔊' : '<span class="icon-music-slash">🔊</span>';
  }
  if (musicBtn) {
    const musicOn = isMusicEnabled();
    musicBtn.className = `btn-round-brawl ${musicOn ? '' : 'btn-round-brawl--muted'}`;
    musicBtn.innerHTML = musicOn ? '🎵' : '<span class="icon-music-slash">🎵</span>';
  }
}

// ─── Barra HUD Reutilizable (CERO Iconos + / ✖ Flotantes) ─────────────────────
function _renderHud({ title = '', sub = '', showBack = false, backTarget = 'LOBBY', bannerVariant = '' } = {}) {
  const save = _s();
  const isFull = !!document.fullscreenElement;

  return `
  <div class="hud-brawl">
    <div class="hud-left">
      ${showBack ? `
        <button class="btn btn-blue btn-sm" id="hud-btn-back" data-target="${backTarget}">
          ◀ Volver
        </button>
      ` : `
        <button class="btn-round-brawl ${isSfxEnabled() ? '' : 'btn-round-brawl--muted'}" id="hud-btn-sfx" title="Sonido">
          ${isSfxEnabled() ? '🔊' : '<span class="icon-music-slash">🔊</span>'}
        </button>
        <button class="btn-round-brawl ${isMusicEnabled() ? '' : 'btn-round-brawl--muted'}" id="hud-btn-music" title="Música">
          ${isMusicEnabled() ? '🎵' : '<span class="icon-music-slash">🎵</span>'}
        </button>
      `}
    </div>

    <div class="hud-center">
      <div class="brawl-logo-banner ${bannerVariant ? `brawl-logo-banner--${bannerVariant}` : ''}">
        <div class="brawl-logo-title">
          <span class="brawl-logo-main">${title || 'EduAventura'}</span>
          <span class="brawl-logo-sub">${sub || 'Aventura Matemática'}</span>
        </div>
      </div>
    </div>

    <div class="hud-right">
      <div class="hud-currencies-wrap">
        <div class="brawl-currency-pill" id="hud-coins-pill">
          <div class="currency-icon-badge">🪙</div>
          <span class="currency-amount" id="hud-coins-txt">${save.user.coins}</span>
        </div>
        <div class="brawl-currency-pill brawl-currency-pill--gems" id="hud-gems-pill">
          <div class="currency-icon-badge">💎</div>
          <span class="currency-amount" id="hud-gems-txt">${save.user.gems ?? 10}</span>
        </div>
        ${save.user?.student_id ? `
          <button class="btn-round-brawl btn-round-brawl--blue" id="hud-btn-cloud" title="Nube Conectada (Doc: ${save.user.student_id})">
            <span class="hud-cloud-icon">☁️</span>
            ${!save.user?.cloud_synced ? '<span class="hud-cloud-dot"></span>' : ''}
          </button>
        ` : ''}
      </div>
      <button class="btn-round-brawl btn-round-brawl--fullscreen btn-fullscreen-toggle" title="${isFull ? 'Salir de pantalla completa' : 'Pantalla completa'}">
        ${_getFullscreenSvg(isFull)}
      </button>
      <button class="btn-round-brawl btn-round-brawl--teal" id="hud-btn-settings" title="Ajustes">
        <span class="hud-icon-gear">⚙️</span>
      </button>
    </div>
  </div>`;
}

// ─── 1. Welcome ───────────────────────────────────────────────────────────────
function _tplWelcome() {
  const save = _s();
  const alias = save.user.alias !== 'Estudiante' ? save.user.alias : '';
  const currentAvatar = save.user.avatar || '🧒';

  return `
<div class="ow-bg">
  <div class="bg-sun"></div>
  <div class="bg-cloud-bottom"></div>

  <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:1rem;position:relative;z-index:10">
    <div class="modal-box modal-box--welcome" style="text-align:center;align-items:center">
      <div class="modal-ribbon modal-ribbon--victory">
        <span>🎒 ¡BIENVENIDO A EDUAVENTURA!</span>
      </div>

      <div class="modal-scroll-body" style="width:100%;align-items:center;text-align:center">
        <div style="font-size:clamp(38px,5vw,54px);margin:.7rem 0 .1rem;animation:dioramaFloat 3s ease-in-out infinite">
          ${currentAvatar}
        </div>

        <h1 style="font-size:clamp(17px,2.5vw,23px);font-weight:900;color:#0F172A;line-height:1.2">
          EduAventura G4
        </h1>
        <p style="font-size:clamp(10.5px,1.3vw,13px);color:#0284C7;font-weight:800;margin-bottom:.5rem">
          Aventuras Matemáticas · 4.° Grado Primaria
        </p>

        <!-- Pestañas: Crear Cuenta / Iniciar Sesión -->
        <div class="cloud-tabs-nav" style="width:100%;margin-bottom:.5rem">
          <button class="cloud-tab-btn cloud-tab-btn--active" id="wc-tab-reg">
            🌟 Crear cuenta
          </button>
          <button class="cloud-tab-btn" id="wc-tab-login">
            🔑 Ya tengo cuenta
          </button>
        </div>

        <!-- Panel: Crear Cuenta (por defecto) -->
        <div class="cloud-tab-panel" id="wc-panel-reg" style="width:100%">
          <div class="cloud-input-group">
            <label for="wc-reg-name" class="cloud-label">Primer Nombre y Primer Apellido:</label>
            <input id="wc-reg-name" class="prof-alias-input" type="text" maxlength="30"
                   placeholder="Ej: Juan Pérez" value="${_esc(alias)}" style="width:100%;text-align:center" />
          </div>

          <div class="cloud-input-group" style="margin-top:.45rem">
            <label for="wc-reg-id" class="cloud-label">Tarjeta de Identidad / Cédula:</label>
            <input id="wc-reg-id" class="prof-alias-input" type="text" inputmode="numeric"
                   placeholder="Solo números (ej: 1098765432)" style="width:100%;text-align:center" />
          </div>

          <div id="wc-reg-err" class="cloud-err-msg" style="display:none"></div>

          <div class="modal-actions modal-actions--stacked" style="width:100%;margin-top:.6rem">
            <button id="wc-btn-reg" class="btn btn-orange btn-lg" style="width:100%">
              🚀 ¡CREAR CUENTA Y JUGAR!
            </button>
          </div>
        </div>

        <!-- Panel: Iniciar Sesión -->
        <div class="cloud-tab-panel" id="wc-panel-login" style="width:100%;display:none">
          <div class="cloud-input-group">
            <label for="wc-login-id" class="cloud-label">Tarjeta de Identidad / Cédula:</label>
            <input id="wc-login-id" class="prof-alias-input" type="text" inputmode="numeric"
                   placeholder="Ingresa tu documento (ej: 1098765432)" style="width:100%;text-align:center" />
          </div>

          <div id="wc-login-err" class="cloud-err-msg" style="display:none"></div>

          <div class="modal-actions modal-actions--stacked" style="width:100%;margin-top:.6rem">
            <button id="wc-btn-login" class="btn btn-green btn-lg" style="width:100%">
              📥 ¡ENTRAR Y CARGAR MI AVANCE!
            </button>
          </div>
        </div>

        <div style="margin-top:.65rem">
          <button id="wc-btn-guest" class="btn-guest-link">
            🕹️ Entrar sin cuenta (Modo Invitado Offline)
          </button>
        </div>

        <div style="font-size:clamp(8.5px,1.1vw,11px);color:#94A3B8;margin-top:.55rem;font-weight:600">
          I.E. Técnico Industrial Laureano Gómez Castro · Sincronización en la Nube
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ─── 2. Pantalla Principal (Lobby Central / Hub) ──────────────────────────────
function _tplLobby() {
  const save = _s();
  const avatar = save.user.avatar || '🧒';
  const title = save.user.title || 'Novato Matemático';
  const randomQuote = _getNextAvatarQuote();
  const claimableTasksCount = getClaimableTasksCount(save);

  return `
<div class="ow-bg">
  <div class="bg-sun"></div>
  <div class="bg-cloud-bottom"></div>

  ${_renderHud({ bannerVariant: 'lobby' })}

  <div class="lobby-content-wrap">
    <div class="lobby-hero-grid">
      <!-- Tarjeta 1: Modo Aventura -->
      <div class="lobby-card lobby-card--adventure" id="lobby-btn-adventure">
        <div class="lobby-card-badge lobby-card-badge--green">Campaña Principal</div>
        <div class="lobby-card-icon">🗺️</div>
        <div class="lobby-card-title">Modo Aventura</div>
        <div class="lobby-card-desc">4 Módulos temáticos · 80 Niveles con Guías Didácticas Ninja</div>
        <button class="btn btn-green btn-md" style="width:100%">
          ¡EXPLORAR MUNDOS!
        </button>
      </div>

      <!-- Tarjeta 2: Modo Libre Contrarreloj -->
      <div class="lobby-card lobby-card--freemode" id="lobby-btn-freemode">
        <div class="lobby-card-badge lobby-card-badge--orange">Farmeo de Monedas</div>
        <div class="lobby-card-icon">⏱️</div>
        <div class="lobby-card-title">Modo Libre</div>
        <div class="lobby-card-desc">Speedrun contra el reloj. ¡Acumula combos y gana monedas legítimas!</div>
        <button class="btn btn-orange btn-md" style="width:100%">
          ¡DESAFÍO VELOZ!
        </button>
      </div>

      <!-- Tarjeta 3: Minitienda -->
      <div class="lobby-card lobby-card--store" id="lobby-btn-store">
        <div class="lobby-card-badge lobby-card-badge--purple">Personalización</div>
        <div class="lobby-card-icon">🛍️</div>
        <div class="lobby-card-title">Minitienda</div>
        <div class="lobby-card-desc">Desbloquea avatares épicos, títulos legendarios y accesorios</div>
        <button class="btn btn-purple btn-md" style="width:100%">
          ¡IR A LA TIENDA!
        </button>
      </div>
    </div>
  </div>

  <!-- Barra Inferior del Lobby -->
  <div class="ow-bottom-bar lobby-bottom-bar">
    <div class="lobby-bottom-actions">
      <div class="lobby-btn-tasks-wrap">
        <button class="btn btn-blue btn-sm" id="lobby-btn-tasks" title="Ver tareas y misiones">
          📋 Tareas
          ${claimableTasksCount > 0 ? `<span class="task-notif-badge" id="lobby-tasks-badge">${claimableTasksCount}</span>` : ''}
        </button>
      </div>
      <div class="lobby-profile-stars-row">
        <button class="btn btn-gold btn-sm" id="lobby-btn-profile" title="Ver perfil de aventurero">
          👤 Mi Perfil
        </button>
        <div class="lobby-stars-badge" style="font-size:clamp(10.5px,1.35vw,13.5px);font-weight:900;color:#0F172A">
          ⭐ ${save.user.stars_total} Estrellas Totales
        </div>
      </div>
    </div>

    <!-- Avatar Interactivo con bocadillo -->
    <div class="avatar-mascot-anchor" id="lobby-avatar-mascot" title="Haz clic en tu avatar">
      <div class="avatar-speech-bubble" id="lobby-mascot-bubble">
        ${randomQuote}
      </div>
      <div class="avatar-floating-unit">
        ${getAvatarRarity(avatar) === 'basic' ? `
          <div class="avatar-waving-figure avatar-emoji-bordered" data-avatar="${avatar}">
            ${avatar}
          </div>
        ` : `
          <div class="avatar-aura-wrap avatar-aura--${getAvatarRarity(avatar)}">
            <span class="aura-spark"></span>
            <span class="aura-spark"></span>
            <span class="aura-spark"></span>
            <span class="aura-spark"></span>
            <span class="aura-spark"></span>
            <span class="aura-front-sheen"></span>
            <div class="avatar-waving-figure avatar-emoji-bordered" data-avatar="${avatar}">
              ${avatar}
            </div>
          </div>
        `}
      </div>
    </div>
  </div>
</div>`;
}

// ─── 3. Overworld (Selector de Módulos 1, 2, 3, 4) ─────────────────────────────
function _tplOverworld() {
  const save = _s();

  const cardsHtml = Object.entries(MODS).map(([key, m]) => {
    const mod = save.modules[key] || { unlocked: false, completed: false, levels: {} };
    const levels = Object.values(mod.levels || {});
    const cleared = levels.filter((l) => l.cleared).length;
    const total = m.totalLevels;
    const pct = Math.round((cleared / total) * 100);
    const locked = !mod.unlocked;

    const starsSum = levels.reduce((acc, l) => acc + (l.stars || 0), 0);
    const starsShow = Math.min(3, Math.floor((starsSum / (total * 3)) * 3 + 0.5));

    return `
<div class="island-card island-card--${key} ${locked ? 'island-card--locked' : ''}" data-mk="${key}" tabindex="${locked ? '-1' : '0'}" role="button">
  <div class="island-diorama ${m.dioramaClass}">
    <div class="diorama-badge-pill">${m.name}</div>
    <div class="diorama-scenery">
      <div class="diorama-emoji-main">${locked ? '🔒' : m.emoji}</div>
    </div>
    <div class="diorama-math-hint">${m.mathHint}</div>
  </div>

  <div class="island-body">
    <div class="island-grade-title" style="color:${m.dark}">${m.topic}</div>
    <div class="island-grade-sub">${m.sub}</div>

    <div class="island-stats-row">
      <div class="island-level-badge">
        <span class="island-level-num">${cleared}</span>
        <span class="island-level-lbl">Niveles</span>
      </div>
      <div class="island-prog-wrap">
        <div class="island-prog-track">
          <div class="island-prog-fill" style="width:${pct}%;background:${m.color}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:900;color:#64748B">
          <span>${pct}%</span>
          <span>${cleared}/${total}</span>
        </div>
      </div>
    </div>

    <div class="island-stars-row">
      ${'⭐'.repeat(starsShow)}${'☆'.repeat(3 - starsShow)}
    </div>

    <button class="island-btn-cta ${locked ? 'island-btn-cta--locked' : 'island-btn-cta--unlocked'}"
            data-mk="${key}" ${locked ? 'disabled' : ''}>
      ${locked ? '🔒 BLOQUEADO' : 'EXPLORAR'}
    </button>
  </div>
</div>`;
  }).join('');

  return `
<div class="ow-bg">
  <div class="bg-sun"></div>

  ${_renderHud({ title: '🗺️ Módulos de Aventura', sub: 'Selección de la Isla', showBack: true, backTarget: 'LOBBY' })}

  <div class="ow-content-wrap">
    <h2 class="ow-callout-title">¡Elige un Módulo para Entrenar tu Mente!</h2>
    <div class="islands-container">${cardsHtml}</div>
  </div>

  <div class="ow-bottom-bar">
    <div class="ow-bottom-actions">
      <button class="btn btn-orange btn-md" id="ow-btn-freemode-quick">
        Ir a Modo Libre
      </button>
      <button class="btn btn-blue btn-md" id="ow-btn-store-quick">
        🛍️ Minitienda
      </button>
    </div>

    <div class="ow-stars-hint" style="font-size:clamp(10px,1.3vw,13px);font-weight:800;color:#FFFFFF;text-shadow:0 2px 4px rgba(0,0,0,0.4)">
      ⭐ Completa niveles para ganar estrellas y desbloquear el siguiente módulo
    </div>
  </div>
</div>`;
}

// ─── 4. Level Board (4 Bloques con Guías Didácticas Indexadas) ─────────────────
function _tplLevelBoard(mk) {
  const m = MODS[mk] || MODS.m1_multiplicacion;
  const save = _s();
  const mod = save.modules[mk] || { levels: {} };
  const levels = mod.levels || {};
  const cleared = Object.values(levels).filter((l) => l.cleared).length;

  let nextAvail = 1;
  for (let i = 1; i <= 20; i++) {
    if (!levels[`l${i}`]?.cleared) {
      nextAvail = i;
      break;
    }
  }

  // 4 Tiers con 1 Guía y 5 Niveles cada uno (total 24 botones indexados)
  const tiersHtml = [1, 2, 3, 4].map((tierIdx) => {
    const guideMilestoneLv = (tierIdx - 1) * 5 + 1; // 1, 6, 11, 16
    const guideLocked = tierIdx > 1 && !levels[`l${(tierIdx - 1) * 5}`]?.cleared;

    const guideBtnHtml = `
      <button class="lvl-btn-chunky lvl-btn-guide"
              data-guide-idx="${tierIdx}" data-guide-lv="${guideMilestoneLv}" data-mk="${mk}"
              title="Abrir Guía Didáctica ${tierIdx}"
              ${guideLocked ? 'disabled style="filter:grayscale(.7) opacity(.6);cursor:default"' : ''}>
        <span class="lvl-btn-guide-icon">${guideLocked ? '🔒' : '💡'}</span>
        <span class="lvl-btn-guide-lbl">Guía ${tierIdx}</span>
      </button>
    `;

    const levelsHtml = Array.from({ length: 5 }, (_, j) => {
      const lv = (tierIdx - 1) * 5 + j + 1;
      const lk = `l${lv}`;
      const lvl = levels[lk];
      const isCleared = lvl?.cleared;
      const stars = lvl?.stars || 0;
      const locked = lv > 1 && !levels[`l${lv - 1}`]?.cleared;
      const isNext = lv === nextAvail && !isCleared && !locked;
      const isMaster = lv === 20;

      const bg = isCleared ? '#E8F8F5' : locked ? '#ECEFF1' : isMaster ? '#FFF9C4' : '#FFFFFF';
      const border = locked ? '#B0BEC5' : isCleared ? '#2ECC71' : isMaster ? '#F59E0B' : '#00B4D8';
      const shad = locked ? '#90A4AE' : isCleared ? '#27AE60' : isMaster ? '#B45309' : '#0077B6';
      const col = locked ? '#90A4AE' : isMaster ? '#B45309' : '#0F172A';

      return `
      <button class="lvl-btn-chunky ${isNext ? 'lvl-pulse-next' : ''}"
              data-lv="${lv}" data-mk="${mk}"
              style="--lvl-bg:${bg};--lvl-shad:${shad};--lvl-col:${col};border-color:${border}"
              ${locked ? 'disabled' : ''}>
        <span class="lvl-chunky-num">${locked ? '🔒' : isMaster ? '👑' : lv}</span>
        ${isCleared ? `<span class="lvl-chunky-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>` : ''}
      </button>`;
    }).join('');

    return `
      <div class="lb-tier-row">
        ${guideBtnHtml}
        ${levelsHtml}
      </div>
    `;
  }).join('');

  return `
<div class="ow-bg">
  <div class="bg-sun"></div>

  ${_renderHud({ title: `${m.emoji} ${m.name}: ${m.topic}`, sub: `${cleared}/20 Niveles`, showBack: true, backTarget: 'MODULE_SELECT' })}

  <div class="lb-wrap">
    <div class="lb-legend-bar">
      <span>💡 Guías Didácticas</span>
      <span>👑 Desafío Maestro</span>
      <button class="btn btn-orange btn-sm" id="lb-btn-freemode-this" data-mk="${mk}">
        Modo Libre de este tema
      </button>
    </div>
    <div class="lb-tiers-container">${tiersHtml}</div>
  </div>
</div>`;
}

// ─── 5. Gameplay y Modos Interactivos de Campaña ──────────────────────────────
function _renderPizzaSvg(totalSlices) {
  const cx = 120, cy = 120, r = 98;
  const wedges = [];
  const delta = (2 * Math.PI) / totalSlices;

  for (let i = 0; i < totalSlices; i++) {
    const a1 = i * delta - Math.PI / 2;
    const a2 = (i + 1) * delta - Math.PI / 2;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);

    const am = (a1 + a2) / 2;
    const px = cx + (r * 0.58) * Math.cos(am);
    const py = cy + (r * 0.58) * Math.sin(am);

    const largeArc = delta > Math.PI ? 1 : 0;
    const pathD = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

    wedges.push(`
      <g class="gp-pizza-wedge" data-slice="${i}">
        <path class="gp-pizza-slice" d="${pathD}" />
        <circle class="gp-pepperoni" cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="9" />
      </g>
    `);
  }

  return `
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="114" fill="#D97706" stroke="#92400E" stroke-width="3" />
      <circle cx="${cx}" cy="${cy}" r="104" fill="#FDE68A" />
      ${wedges.join('')}
      <circle cx="${cx}" cy="${cy}" r="4" fill="#B45309" />
    </svg>
  `;
}

function _renderInteractiveZone(ex) {
  switch (ex.type) {
    case 'tiles': {
      const slots = Array.from({ length: ex.slotsCount }, (_, i) => `
        <div class="gp-tile-slot" data-slot="${i}" tabindex="0">
          <span class="gp-tile-slot-ph">?</span>
        </div>
      `).join('');

      const tiles = ex.tiles.map((t, i) => {
        const isOp = ['+', '-', '×', '÷', '='].includes(t);
        return `
          <button class="gp-tile ${isOp ? 'is-operator' : ''}" draggable="true" data-tile-id="${i}" data-val="${t}">
            ${t}
          </button>
        `;
      }).join('');

      return `
        <div class="gp-tiles-wrapper">
          <div class="gp-tiles-label">
            🧩 <strong>Arma la Operación:</strong> Toca o arrastra las fichas para armar la igualdad:
          </div>
          <div class="gp-slots-container" id="gp-slots-container">
            ${slots}
          </div>
          <div class="gp-tray-container" id="gp-tray-container">
            ${tiles}
          </div>
          <div style="display:flex;justify-content:center">
            <button class="btn btn-outline btn-sm" id="gp-btn-reset-tiles" style="font-size:11px;padding:.2rem .6rem">
              🔄 Reiniciar Fichas
            </button>
          </div>
        </div>
        <div class="gp-input-row" style="margin-top:.4rem">
          <button class="btn btn-green btn-lg" id="gp-btn-check">
            ✅ COMPROBAR
          </button>
          <button class="btn btn-gold btn-lg" id="gp-btn-hint" title="Pedir Pista">
            💡 Pista
          </button>
        </div>
      `;
    }

    case 'factors': {
      const factorBtns = ex.options.map((val, i) => `
        <button class="gp-factor-btn" data-idx="${i}" data-val="${val}">
          ${val}
        </button>
      `).join('');

      return `
        <div class="gp-factors-wrapper">
          <div class="gp-target-badge">
            🎯 PRODUCTO OBJETIVO: <span class="gp-target-num">${ex.target}</span>
          </div>
          <div class="gp-factors-instruction">
            Toca los <strong>2 factores</strong> que multiplicados dan exactamente ${ex.target}:
          </div>
          <div class="gp-factors-grid" id="gp-factors-grid">
            ${factorBtns}
          </div>
          <div class="gp-factors-selection-status" id="gp-factors-status">
            Factores elegidos: <strong id="gp-factors-count">0</strong> / 2
          </div>
        </div>
        <div class="gp-input-row" style="margin-top:.4rem">
          <button class="btn btn-green btn-lg" id="gp-btn-check">
            ✅ COMPROBAR
          </button>
          <button class="btn btn-gold btn-lg" id="gp-btn-hint" title="Pedir Pista">
            💡 Pista
          </button>
        </div>
      `;
    }

    case 'match_quotient': {
      const quotientCards = ex.options.map((opt, i) => `
        <button class="gp-choice-card" data-idx="${i}">
          <span class="gp-choice-letter">${String.fromCharCode(65 + i)}</span>
          <span class="gp-choice-expr">${opt}</span>
        </button>
      `).join('');

      return `
        <div class="gp-choice-wrapper">
          <div class="gp-target-badge">
            🎯 COCIENTE OBJETIVO: <span class="gp-target-num">${ex.targetQuotient}</span>
          </div>
          <div class="gp-choice-instruction">
            ¿Cuál de las siguientes divisiones da exactamente como resultado <strong>${ex.targetQuotient}</strong>?
          </div>
          <div class="gp-choice-grid" id="gp-choice-grid">
            ${quotientCards}
          </div>
        </div>
        <div class="gp-input-row" style="margin-top:.4rem">
          <button class="btn btn-green btn-lg" id="gp-btn-check">
            ✅ COMPROBAR
          </button>
          <button class="btn btn-gold btn-lg" id="gp-btn-hint" title="Pedir Pista">
            💡 Pista
          </button>
        </div>
      `;
    }

    case 'slices': {
      return `
        <div class="gp-pizza-wrapper">
          <div class="gp-target-badge">
            🍕 OBJETIVO: Colorea <span class="gp-target-num">${ex.targetNumerator} / ${ex.totalSlices}</span>
          </div>
          <div class="gp-pizza-instruction">
            Toca las porciones de pizza para seleccionarlas:
          </div>
          <div class="gp-pizza-svg-container" id="gp-pizza-container">
            ${_renderPizzaSvg(ex.totalSlices)}
          </div>
          <div class="gp-pizza-counter" id="gp-pizza-counter">
            Porciones pintadas: <strong id="gp-slices-count">0</strong> / ${ex.totalSlices}
          </div>
        </div>
        <div class="gp-input-row" style="margin-top:.4rem">
          <button class="btn btn-green btn-lg" id="gp-btn-check">
            ✅ COMPROBAR
          </button>
          <button class="btn btn-gold btn-lg" id="gp-btn-hint" title="Pedir Pista">
            💡 Pista
          </button>
        </div>
      `;
    }

    case 'balance': {
      const balanceCards = ex.options.map((opt, i) => `
        <button class="gp-choice-card" data-idx="${i}">
          <span class="gp-choice-letter">${String.fromCharCode(65 + i)}</span>
          <span class="gp-choice-expr">${opt}</span>
        </button>
      `).join('');

      return `
        <div class="gp-balance-wrapper">
          <div class="gp-balance-visual">
            <div class="gp-scale-pan gp-scale-pan-left">
              <div class="gp-pan-label">Platillo Izquierdo</div>
              <div class="gp-pan-expr">${ex.leftExpr}</div>
            </div>
            <div class="gp-scale-pivot">⚖️</div>
            <div class="gp-scale-pan gp-scale-pan-right" id="gp-pan-right">
              <div class="gp-pan-label">Platillo Derecho</div>
              <div class="gp-pan-expr" id="gp-pan-right-val">?</div>
            </div>
          </div>
          <div class="gp-choice-instruction">
            Elige la pesa fraccionaria que equilibra la balanza:
          </div>
          <div class="gp-choice-grid" id="gp-choice-grid">
            ${balanceCards}
          </div>
        </div>
        <div class="gp-input-row" style="margin-top:.4rem">
          <button class="btn btn-green btn-lg" id="gp-btn-check">
            ✅ COMPROBAR
          </button>
          <button class="btn btn-gold btn-lg" id="gp-btn-hint" title="Pedir Pista">
            💡 Pista
          </button>
        </div>
      `;
    }

    case 'master_choice': {
      const masterCards = ex.options.map((opt, i) => `
        <button class="gp-choice-card" data-idx="${i}">
          <span class="gp-choice-letter">${String.fromCharCode(65 + i)}</span>
          <span class="gp-choice-expr">${opt}</span>
        </button>
      `).join('');

      return `
        <div class="gp-master-wrapper">
          <div class="gp-master-header">
            👑 <strong>DESAFÍO MAESTRO</strong>
          </div>
          <div class="gp-master-question">
            ${ex.question}
          </div>
          <div class="gp-choice-grid" id="gp-choice-grid">
            ${masterCards}
          </div>
        </div>
        <div class="gp-input-row" style="margin-top:.4rem">
          <button class="btn btn-green btn-lg" id="gp-btn-check">
            ✅ COMPROBAR
          </button>
          <button class="btn btn-gold btn-lg" id="gp-btn-hint" title="Pedir Pista">
            💡 Pista
          </button>
        </div>
      `;
    }

    case 'classic':
    default: {
      return `
        <div class="gp-equation-box" data-ans="${ex.answer}">
          ${ex.display}
        </div>

        <div class="gp-input-row">
          <input id="gp-inp-ans" class="gp-answer-input" type="number" min="0" max="9999"
                 placeholder="?" autocomplete="off" />
          <button class="btn btn-green btn-lg" id="gp-btn-check">
            ✅ COMPROBAR
          </button>
          <button class="btn btn-gold btn-lg" id="gp-btn-hint" title="Pedir Pista">
            💡 Pista
          </button>
        </div>
      `;
    }
  }
}

function _tplGameplay({ mk, lv }) {
  const m = MODS[mk] || MODS.m1_multiplicacion;
  const isMaster = lv === 20;
  const ex = _genExercise(mk, lv);
  const save = _s();
  const avatar = save.user.avatar || '🧒';
  const isAlreadyCleared = !!save.modules[mk]?.levels[`l${lv}`]?.cleared;

  return `
<div class="ow-bg">
  <div class="bg-sun"></div>

  ${_renderHud({ title: `${m.emoji} Nivel ${lv}`, sub: m.topic, showBack: true, backTarget: 'LEVEL_BOARD' })}

  <div class="gp-container">
    <div class="gp-card-brawl" id="gp-card">
      <div class="gp-header-bar">
        <div class="gp-header-left">
          <div class="gp-avatar-mascot avatar-emoji-bordered" data-avatar="${avatar}">${avatar}</div>
          <div>
            <div class="gp-level-title">
              ${isMaster ? '👑 ¡Desafío Maestro Final!' : `Nivel ${lv} · ${m.topic}`}
            </div>
            ${isAlreadyCleared ? `
              <span style="font-size:10px;font-weight:800;color:#64748B;background:#F1F5F9;padding:.1rem .4rem;border-radius:4px">
                ✓ Nivel ya completado (Reintento para estrellas)
              </span>
            ` : ''}
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:.6rem">
          <button class="btn btn-gold btn-sm" id="gp-btn-guide-instant">
            💡 Ver Guía
          </button>
          <div class="gp-lives-row" id="gp-hearts-box">
            <span class="gp-heart">❤️</span>
            <span class="gp-heart">❤️</span>
            <span class="gp-heart">❤️</span>
          </div>
        </div>
      </div>

      <div class="gp-context-box">${ex.context}</div>

      ${_renderInteractiveZone(ex)}

      <div id="gp-feedback-container" style="min-height:30px;text-align:center"></div>
    </div>
  </div>
</div>`;
}

// ─── 6. Modo Libre Contrarreloj (Pre-selección y Juego) ────────────────────────
function _tplFreeMode(ctx = {}) {
  if (!ctx.activePlaying) {
    return _tplFreeModeSelect();
  }
  return _tplFreeModePlay(ctx.mk || _freeModeActiveTopic);
}

function _tplFreeModeSelect() {
  const save = _s();
  const highscores = save.user.highscores || {};

  const cardsHtml = Object.entries(MODS).map(([k, mod]) => {
    const isUnlocked = !!(save.modules[k]?.unlocked);
    const isSel = !!(_freeModeActiveTopic && k === _freeModeActiveTopic && isUnlocked);
    const hs = highscores[k] || 0;

    if (!isUnlocked) {
      return `
        <div class="free-select-card free-select-card--locked" data-topic="${k}" role="button" tabindex="-1" title="¡Desbloquéalo en el Modo Aventura!">
          <div class="free-select-icon">🔒</div>
          <div class="free-select-title">${mod.topic}</div>
          <div class="free-select-desc">Bloqueado en Aventura</div>
          <div class="free-select-stat" style="color:#94A3B8">Completa el módulo previo</div>
          <div style="font-size:clamp(8px,1vw,11px);font-weight:900;color:#DC2626;margin-top:.15rem">
            🔒 No disponible
          </div>
        </div>
      `;
    }

    return `
      <div class="free-select-card ${isSel ? 'free-select-card--active' : ''}" data-topic="${k}" role="button" tabindex="0">
        <div class="free-select-icon">${mod.emoji}</div>
        <div class="free-select-title">${mod.topic}</div>
        <div class="free-select-desc">${mod.sub}</div>
        <div class="free-select-stat">🏆 Récord: <strong>${hs} pts</strong></div>
        <div style="font-size:clamp(8px,1vw,11px);font-weight:900;color:#0284C7;margin-top:.15rem">
          ⏱️ Tiempo base: ${mod.freeModeBaseTime}s
        </div>
      </div>
    `;
  }).join('');

  return `
<div class="ow-bg">
  <div class="bg-sun"></div>

  ${_renderHud({ title: 'Modo Libre Contrarreloj', sub: 'Selecciona tu Desafío', showBack: true, backTarget: 'LOBBY', bannerVariant: 'freemode' })}

  <div class="free-mode-wrap">
    <div style="text-align:center;margin-bottom:clamp(.5rem, 1.8vh, 1rem)">
      <h2 style="font-size:clamp(14px, 2vw, 21px);font-weight:900;color:#FFFFFF;text-shadow:0 2px 4px rgba(0,0,0,0.4)">
        ¡Elige tu Desafío Matemático Contrarreloj!
      </h2>
      <p style="font-size:clamp(10px, 1.25vw, 13px);font-weight:800;color:#0F172A;margin-top:.25rem">
        Cada acierto REINICIA el reloj. ¡A mayor racha de combos, más rápido deberás responder!
      </p>
    </div>

    <div class="free-select-grid">
      ${cardsHtml}
    </div>

    <div style="display:flex;gap:.8rem;align-items:center;justify-content:center;margin-top:.4rem">
      <button class="btn btn-green btn-lg" id="fm-btn-start-challenge">
        ¡EMPEZAR DESAFÍO!
      </button>
      <button class="btn btn-blue btn-md" id="fm-btn-select-back">
        🏠 Menú Principal
      </button>
    </div>
  </div>
</div>`;
}

function _tplFreeModePlay(mk) {
  _freeModeActiveTopic = mk;
  const m = MODS[mk] || MODS.m1_multiplicacion;
  const baseTime = _getFreeModeTargetTime(mk, 0);

  return `
<div class="ow-bg">
  <div class="bg-sun"></div>

  ${_renderHud({ title: `⚡ ${m.emoji} ${m.topic}`, sub: 'Modo Contrarreloj', showBack: false, bannerVariant: 'freemode' })}

  <div class="free-mode-wrap" id="fm-play-wrapper">
    <!-- Barra superior de Modo Libre -->
    <div style="display:flex;align-items:center;justify-content:space-between;width:min(680px,96%);margin-bottom:.2rem">
      <button class="btn btn-blue btn-sm" id="fm-btn-change-topic">
        ◀ Cambiar Modo
      </button>
      <div style="display:flex;gap:.5rem;align-items:center">
        <div class="reward-pill" style="background:#FFF9C4;border-color:#F59E0B">
          <span>🏆</span>
          <strong id="fm-score-txt" style="font-size:15px;color:#B45309">0</strong>
        </div>
        <div class="reward-pill" style="background:#E0F2FE;border-color:#0284C7">
          <span>🔥</span>
          <strong id="fm-combo-txt" style="font-size:15px;color:#0369A1">x0</strong>
        </div>
        <div class="reward-pill" style="background:#DCFCE7;border-color:#16A34A">
          <span>🪙</span>
          <strong id="fm-coins-farmed-txt" style="font-size:15px;color:#15803D">+0</strong>
        </div>
      </div>
    </div>

    <!-- Barra de Temporizador Decreciente -->
    <div class="timer-bar-container">
      <div class="timer-bar-fill" id="fm-timer-fill" style="width:100%"></div>
      <div class="timer-text-display" id="fm-timer-text">⏱️ ${baseTime.toFixed(1)}s</div>
    </div>

    <!-- Tarjeta de Ejercicio Dinámico (100% Random con Selección Táctil) -->
    <div class="gp-card-brawl" style="width:min(680px,96%);padding:.5rem 1rem" id="fm-card">
      <div style="text-align:center;font-size:clamp(10.5px,1.25vw,13.5px);font-weight:800;color:#64748B" id="fm-context-txt">
        ¡Toca la opción correcta antes de que expire el tiempo!
      </div>

      <div class="gp-equation-box" id="fm-equation-display" style="margin:.15rem 0">
        ...
      </div>

      <!-- Cuadraditos de Respuesta Rápida (Selección Táctil Toca-y-Juega) -->
      <div class="fm-options-grid" id="fm-options-grid"></div>

      <!-- Barra de Poderes del Avatar Equipado (Auto-Acierto y Descarte Mítico) -->
      <div class="fm-avatar-power-bar" id="fm-avatar-power-bar"></div>

      <div id="fm-feedback-box" style="min-height:22px;text-align:center"></div>
    </div>
  </div>
</div>`;
}

// ─── 7. Minitienda de Aventuras (Compacta, 45+ Avatares, Lemas, Gemas y Ruletas) ─────────
function _tplStore() {
  const save = _s();
  const unlockedAvatars = save.user.unlocked_avatars || ['🧒', '👧'];
  const unlockedTitles = save.user.unlocked_titles || ['Novato Matemático'];
  const currentAvatar = save.user.avatar || '🧒';
  const currentTitle = save.user.title || 'Novato Matemático';

  const allAvatarItems = STORE_ITEMS.filter((it) => it.type === 'avatar');
  const allTitleItems = STORE_ITEMS.filter((it) => it.type === 'title');

  const totalAvatarsCount = allAvatarItems.length;
  const ownedAvatarsCount = unlockedAvatars.length;
  const totalTitlesCount = allTitleItems.length;
  const ownedTitlesCount = unlockedTitles.length;

  const isAvatarMode = _freeModeStoreCategory === 'avatar';
  const isTitleMode = _freeModeStoreCategory === 'title';
  const isGemsMode = _freeModeStoreCategory === 'gems';
  const isRouletteMode = _freeModeStoreCategory === 'roulette';

  let bodyContentHtml = '';

  if (isAvatarMode || isTitleMode) {
    let items = STORE_ITEMS.filter((it) => it.type === _freeModeStoreCategory);
    if (_storeRarityFilter) {
      items = items.filter((it) => it.rarity === _storeRarityFilter);
    }

    const itemsHtml = items.map((it) => {
      const isUnlocked = isAvatarMode ? unlockedAvatars.includes(it.value) : unlockedTitles.includes(it.value);
      const isEquipped = isAvatarMode ? currentAvatar === it.value : currentTitle === it.value;
      const canAfford = save.user.coins >= it.price;
      const rar = RARITIES[it.rarity] || RARITIES.common;

      let btnHtml = '';
      if (isEquipped) {
        btnHtml = `<button class="btn btn-green btn-sm" disabled style="width:100%">✅ Equipado</button>`;
      } else if (isUnlocked) {
        btnHtml = `<button class="btn btn-blue btn-sm store-btn-equip" data-id="${it.id}" style="width:100%">⭐ Equipar</button>`;
      } else if (canAfford) {
        btnHtml = `<button class="btn btn-gold btn-sm store-btn-buy" data-id="${it.id}" style="width:100%;color:#FFFFFF !important">🪙 Comprar</button>`;
      } else {
        btnHtml = `<button class="btn btn-gray btn-sm" disabled style="width:100%">🔒 ${it.price === 0 ? 'Gratis' : `${it.price} 🪙`}</button>`;
      }

      if (isAvatarMode) {
        let powerBadgeText = 'Sin poder especial';
        let powerBadgeClass = 'store-avatar-power--none';
        let powerBadgeTooltip = 'Modo Libre: Sin habilidades activas';
        if (it.rarity === 'mythic') {
          powerBadgeText = '⚡ 5 Aciertos + 🔮 Descarte';
          powerBadgeClass = 'store-avatar-power--mythic';
          powerBadgeTooltip = 'Modo Libre: ⚡ 5 Auto-Aciertos + 🔮 1 Descarte Mítico (-2 opciones)';
        } else if (it.rarity === 'epic') {
          powerBadgeText = '⚡ 5 Auto-Aciertos';
          powerBadgeClass = 'store-avatar-power--epic';
          powerBadgeTooltip = 'Modo Libre: ⚡ 5 Auto-Aciertos por partida';
        } else if (it.rarity === 'advanced') {
          powerBadgeText = '⚡ 1 Auto-Acierto';
          powerBadgeClass = 'store-avatar-power--advanced';
          powerBadgeTooltip = 'Modo Libre: ⚡ 1 Auto-Acierto por partida';
        }

        const avBorder = 'avatar-emoji-bordered';

        return `
        <div class="store-avatar-card store-avatar-card--${it.rarity}">
          <span class="rarity-pill" style="color:${rar.color};background:${rar.bg}">
            ${rar.name}
          </span>
          <div class="store-avatar-preview-wrap">
            ${it.rarity === 'basic' ? `
              <div class="store-avatar-emoji ${avBorder}" data-avatar="${it.value}">${it.value}</div>
            ` : `
              <div class="avatar-aura-wrap avatar-aura--${it.rarity}">
                <span class="aura-spark"></span>
                <span class="aura-spark"></span>
                <span class="aura-spark"></span>
                <span class="aura-spark"></span>
                <span class="aura-spark"></span>
                <span class="aura-front-sheen"></span>
                <div class="store-avatar-emoji ${avBorder}" data-avatar="${it.value}">${it.value}</div>
              </div>
            `}
          </div>
          <div class="store-avatar-name" title="${it.name}">${it.name}</div>
          <div class="store-avatar-power ${powerBadgeClass}" title="${powerBadgeTooltip}">
            ${powerBadgeText}
          </div>
          <div style="font-size:8.5px;font-weight:900;color:#B45309;margin-bottom:.15rem">
            ${it.price === 0 ? '¡Gratis!' : `🪙 ${it.price}`}
          </div>
          ${btnHtml}
        </div>`;
      } else {
        return `
        <div class="store-title-card store-title-card--${it.rarity}">
          <div class="store-title-info">
            <div style="display:flex;align-items:center;gap:.3rem;margin-bottom:.1rem">
              <span class="rarity-pill" style="color:${rar.color};background:${rar.bg}">
                ${rar.name}
              </span>
              <span class="store-title-text">${it.name}</span>
            </div>
            <div class="store-title-desc">${it.description}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.2rem;flex-shrink:0;min-width:92px">
            <span style="font-size:9px;font-weight:900;color:#B45309">
              ${it.price === 0 ? '¡Gratis!' : `🪙 ${it.price} Monedas`}
            </span>
            ${btnHtml}
          </div>
        </div>`;
      }
    }).join('');

    bodyContentHtml = `
      <!-- Barra de Filtros por Rareza (Básicos, Comunes, Avanzados, Épicos, Míticos) -->
      <div class="store-filter-bar">
        <button class="store-filter-chip ${_storeRarityFilter === 'basic' ? 'store-filter-chip--active' : ''}" data-rar="basic">
          ${_storeRarityFilter === 'basic' ? '⚪' : '⚫'} Básicos
        </button>
        <button class="store-filter-chip ${_storeRarityFilter === 'common' ? 'store-filter-chip--active' : ''}" data-rar="common">
          🟢 Comunes
        </button>
        <button class="store-filter-chip ${_storeRarityFilter === 'advanced' ? 'store-filter-chip--active' : ''}" data-rar="advanced">
          🔵 Avanzados
        </button>
        <button class="store-filter-chip ${_storeRarityFilter === 'epic' ? 'store-filter-chip--active' : ''}" data-rar="epic">
          🟣 Épicos
        </button>
        <button class="store-filter-chip ${_storeRarityFilter === 'mythic' ? 'store-filter-chip--active' : ''}" data-rar="mythic">
          🟡 Míticos
        </button>
      </div>

      <!-- Contenedor según categoría -->
      <div class="${isAvatarMode ? 'store-avatars-grid' : 'store-titles-grid'}">
        ${itemsHtml}
      </div>
    `;
  } else if (isGemsMode) {
    bodyContentHtml = `
      <div style="text-align:center;margin:.3rem 0 .7rem">
        <h3 style="font-size:clamp(13px,1.8vw,17px);font-weight:900;color:#FFFFFF;text-shadow:0 2px 4px rgba(0,0,0,0.4)">
          Tienda de Gemas
        </h3>
      </div>

      <div class="store-gems-grid">
        <!-- 10 Gemas: 1 gema sola -->
        <div class="store-gem-card">
          <div class="store-gem-icon-cluster cluster--10">
            <span class="gem-single">💎</span>
          </div>
          <div class="store-gem-amount">10 Gemas</div>
          <button class="btn btn-gold btn-md store-btn-buy-gems" data-gems="10" data-cost="120" style="width:100%">
            🪙 120
          </button>
        </div>

        <!-- 25 Gemas: 1 gema principal + 1 más chiquita superpuesta -->
        <div class="store-gem-card">
          <div class="store-gem-icon-cluster cluster--25">
            <span class="gem-main">💎</span>
            <span class="gem-sub-small">💎</span>
          </div>
          <div class="store-gem-amount">25 Gemas</div>
          <button class="btn btn-gold btn-md store-btn-buy-gems" data-gems="25" data-cost="280" style="width:100%">
            🪙 280
          </button>
        </div>

        <!-- 60 Gemas: 3 gemas (central erguida, dos laterales recostadas) -->
        <div class="store-gem-card">
          <div class="store-gem-icon-cluster cluster--60">
            <span class="gem-tilted-left">💎</span>
            <span class="gem-center-upright">💎</span>
            <span class="gem-tilted-right">💎</span>
          </div>
          <div class="store-gem-amount">60 Gemas</div>
          <button class="btn btn-gold btn-md store-btn-buy-gems" data-gems="60" data-cost="650" style="width:100%">
            🪙 650
          </button>
        </div>

        <!-- 150 Gemas: Montañita de 5 gemas -->
        <div class="store-gem-card">
          <div class="store-gem-icon-cluster cluster--150">
            <span class="gem-pile p1">💎</span>
            <span class="gem-pile p2">💎</span>
            <span class="gem-pile p3">💎</span>
            <span class="gem-pile p4">💎</span>
            <span class="gem-pile p-center">💎</span>
          </div>
          <div class="store-gem-amount">150 Gemas</div>
          <button class="btn btn-gold btn-md store-btn-buy-gems" data-gems="150" data-cost="1500" style="width:100%">
            🪙 1,500
          </button>
        </div>
      </div>
    `;
  } else if (isRouletteMode) {
    const rouletteCards = [
      {
        type: 'coins',
        title: 'Ruleta de Monedas',
        icon: '🪙',
        desc: 'Gana entre 5 y 1,000 monedas.',
      },
      {
        type: 'avatars',
        title: 'Ruleta de Avatares',
        icon: '🐾',
        desc: 'Desbloquea personajes de todas las rarezas.',
      },
      {
        type: 'titles',
        title: 'Ruleta de Lemas',
        icon: '👑',
        desc: 'Gana lemas para tu perfil.',
      },
    ].map((r) => {
      const isFree = isFreeSpinAvailable(r.type, save);
      const timeLeft = getTimeUntilNextFreeSpin(r.type, save);
      const btnColor = r.type === 'coins' ? 'btn-gold' : r.type === 'avatars' ? 'btn-purple' : 'btn-red';

      return `
        <div class="store-roulette-card store-roulette-card--${r.type}">
          <div class="store-roulette-icon">${r.icon}</div>
          <div class="store-roulette-title">${r.title}</div>
          <div class="store-roulette-desc">${r.desc}</div>
          ${!isFree ? `
            <div class="store-roulette-status store-roulette-status--${r.type}">
              <span class="store-roulette-status-label">Giro gratis disponible en:</span>
              <span class="store-roulette-status-timer" data-roulette-timer="${r.type}">${timeLeft}</span>
            </div>
          ` : ''}
          ${isFree
            ? `<button class="btn ${btnColor} btn-md store-btn-open-roulette" data-type="${r.type}" style="width:100%">
                 🎁 ¡GIRAR GRATIS!
               </button>`
            : `<button class="btn ${btnColor} btn-md store-btn-open-roulette" data-type="${r.type}" style="width:100%">
                 💎 Girar (6 Gemas)
               </button>`
          }
        </div>
      `;
    }).join('');

    bodyContentHtml = `
      <div style="text-align:center;margin:.3rem 0 .7rem">
        <h3 style="font-size:clamp(13px,1.8vw,17px);font-weight:900;color:#FFFFFF;text-shadow:0 2px 4px rgba(0,0,0,0.4)">
          Ruletas Diarias
        </h3>
      </div>

      <div class="store-roulette-grid">
        ${rouletteCards}
      </div>
    `;
  }

  return `
<div class="ow-bg">
  <div class="bg-sun"></div>

  ${_renderHud({ title: '🛍️ Minitienda de Aventuras', sub: 'Desbloquear Recompensas', showBack: true, backTarget: 'LOBBY' })}

  <div class="store-container">
    <!-- Pestañas de la tienda -->
    <div class="store-tabs">
      <button class="store-tab-btn ${_freeModeStoreCategory === 'avatar' ? 'store-tab-btn--active' : ''}" data-cat="avatar">
        👤 Avatares (${ownedAvatarsCount}/${totalAvatarsCount})
      </button>
      <button class="store-tab-btn ${_freeModeStoreCategory === 'title' ? 'store-tab-btn--active' : ''}" data-cat="title">
        🏷️ Lemas (${ownedTitlesCount}/${totalTitlesCount})
      </button>
      <button class="store-tab-btn ${_freeModeStoreCategory === 'gems' ? 'store-tab-btn--active' : ''}" data-cat="gems">
        💎 Gemas
      </button>
      <button class="store-tab-btn ${_freeModeStoreCategory === 'roulette' ? 'store-tab-btn--active' : ''}" data-cat="roulette">
        🎰 Ruletas
      </button>
    </div>

    ${bodyContentHtml}
  </div>
</div>`;
}

// ─── Lógica de Dificultad y Ejercicios 100% Aleatorios en Modo Libre ──────────
function _getFreeModeTargetTime(topic, solvedCount = 0) {
  const tier = Math.floor(Math.max(0, solvedCount) / 2);
  let base = 15;
  let step = 2;
  switch (topic) {
    case 'm1_multiplicacion':
      base = 15;
      step = 2; // Tier 0 (0-1): 15s | Tier 1 (2-3): 13s | Tier 2 (4-5): 11s | Tier 3 (6-7): 9s | Tier 4 (8-9): 7s | Tier 5+ (10+): 5s (MÍNIMO)
      break;
    case 'm2_division':
      base = 20;
      step = 3; // Tier 0 (0-1): 20s | Tier 1 (2-3): 17s | Tier 2 (4-5): 14s | Tier 3 (6-7): 11s | Tier 4 (8-9): 8s | Tier 5+ (10+): 5s (MÍNIMO)
      break;
    case 'm3_fracciones_intro':
      base = 25;
      step = 4; // Tier 0 (0-1): 25s | Tier 1 (2-3): 21s | Tier 2 (4-5): 17s | Tier 3 (6-7): 13s | Tier 4 (8-9): 9s | Tier 5+ (10+): 5s (MÍNIMO)
      break;
    case 'm4_fracciones_ops':
      base = 30;
      step = 5; // Tier 0 (0-1): 30s | Tier 1 (2-3): 25s | Tier 2 (4-5): 20s | Tier 3 (6-7): 15s | Tier 4 (8-9): 10s | Tier 5+ (10+): 5s (MÍNIMO)
      break;
    default:
      base = 15;
      step = 2;
  }
  return Math.max(5.0, base - (tier * step));
}

// ─── Progresión Dinámica de Opciones en Modo Libre (3, 4, 5, hasta 6 máx) ─────
function _getFreeModeNumOptions(solvedCount = 0) {
  if (solvedCount < 3) return 3;   // Ejercicios 1 a 3 (0 a 2 resueltos): 3 opciones
  if (solvedCount < 6) return 4;   // Ejercicios 4 a 6 (3 a 5 resueltos): 4 opciones
  if (solvedCount < 9) return 5;   // Ejercicios 7 a 9 (6 a 8 resueltos): 5 opciones
  return 6;                       // Ejercicios 10+ (9+ resueltos): 6 opciones (MÁXIMO)
}

/**
 * Calcula las monedas acumuladas en Modo Libre según la regla del usuario:
 * Exactamente 1 moneda por cada acierto logrado (15 aciertos = 15 monedas).
 * @param {number} solved
 * @returns {number}
 */
function _calcFreeModeCoins(solved) {
  return Math.max(0, solved);
}

/**
 * Calcula el total canónico exacto de estrellas de todos los módulos.
 * Garantiza que al rejugar niveles y mejorar estrellas, se acumulen siempre correctamente.
 * @param {any} save
 * @returns {number}
 */
function _calcCanonicalTotalStars(save) {
  if (!save?.modules) return 0;
  let total = 0;
  for (const mKey of Object.keys(save.modules)) {
    const lvls = save.modules[mKey]?.levels || {};
    for (const lKey of Object.keys(lvls)) {
      const lvl = lvls[lKey];
      if (lvl?.cleared && typeof lvl.stars === 'number') {
        total += lvl.stars;
      }
    }
  }
  return total;
}

function _genFreeModeChoices(correctAnswer, count) {
  const choices = new Set([correctAnswer]);
  const candidates = [];

  // Variaciones numéricas cercanas (±1, ±2, ±3)
  candidates.push(correctAnswer + 1);
  if (correctAnswer - 1 > 0) candidates.push(correctAnswer - 1);
  candidates.push(correctAnswer + 2);
  if (correctAnswer - 2 > 0) candidates.push(correctAnswer - 2);
  candidates.push(correctAnswer + 3);
  if (correctAnswer - 3 > 0) candidates.push(correctAnswer - 3);

  // Variaciones decimales o decenas
  if (correctAnswer >= 20) {
    candidates.push(correctAnswer + 10);
    if (correctAnswer - 10 > 0) candidates.push(correctAnswer - 10);
    candidates.push(correctAnswer + 5);
    if (correctAnswer - 5 > 0) candidates.push(correctAnswer - 5);
  }

  // Saltos de tablas frecuentes
  if (correctAnswer > 6) {
    candidates.push(correctAnswer + 6);
    if (correctAnswer - 6 > 0) candidates.push(correctAnswer - 6);
    candidates.push(correctAnswer + 4);
    if (correctAnswer - 4 > 0) candidates.push(correctAnswer - 4);
  }

  // Transposición de dígitos (ej. 24 -> 42, 35 -> 53)
  if (correctAnswer >= 12 && correctAnswer <= 98 && correctAnswer % 10 !== 0) {
    const s = String(correctAnswer);
    const rev = Number(s[1] + s[0]);
    if (rev !== correctAnswer && rev > 0) {
      candidates.push(rev);
    }
  }

  candidates.sort(() => Math.random() - 0.5);
  for (const c of candidates) {
    if (choices.size >= count) break;
    if (c > 0 && !choices.has(c)) {
      choices.add(c);
    }
  }

  // Generador suplementario de respaldo si faltan opciones
  let spread = 2;
  let attempts = 0;
  while (choices.size < count && attempts < 60) {
    attempts++;
    const delta = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * spread) + 1);
    const c = correctAnswer + delta;
    if (c > 0 && !choices.has(c)) {
      choices.add(c);
    }
    spread += 2;
  }

  const arr = Array.from(choices);
  return arr.sort(() => Math.random() - 0.5);
}

const _recentFreeExerciseSignatures = [];

function _genRandomFreeExercise(topic, streak) {
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateCandidate = () => {
    switch (topic) {
      case 'm1_multiplicacion': {
        const type = Math.floor(Math.random() * 8);
        switch (type) {
          case 0: {
            // Multiplicación clásica con progresión de racha
            let a, b;
            if (streak <= 3) {
              a = randInt(2, 9);
              b = randInt(2, 8);
            } else if (streak <= 7) {
              a = randInt(3, 12);
              b = randInt(3, 11);
            } else {
              a = randInt(4, 15);
              b = randInt(4, 12);
            }
            return {
              context: '⚡ Multiplicación Veloz',
              display: `${a} × ${b} = ?`,
              answer: a * b,
            };
          }
          case 1: {
            // Factor faltante segundo
            const a = randInt(2, 11);
            const b = randInt(2, 10);
            return {
              context: '⚡ ¿Qué número multiplicado falta?',
              display: `${a} × ? = ${a * b}`,
              answer: b,
            };
          }
          case 2: {
            // Factor faltante primero
            const a = randInt(2, 10);
            const b = randInt(2, 11);
            return {
              context: '⚡ ¿Qué número multiplicado falta?',
              display: `? × ${b} = ${a * b}`,
              answer: a,
            };
          }
          case 3: {
            // Cálculo mental con decenas
            const a = randInt(2, 9);
            const b = randInt(2, 9);
            const tensFirst = Math.random() < 0.5;
            const display = tensFirst ? `${a * 10} × ${b} = ?` : `${a} × ${b * 10} = ?`;
            return {
              context: '⚡ Cálculo Mental con Decenas',
              display,
              answer: a * b * 10,
            };
          }
          case 4: {
            // Doble, triple o cuádruple
            const mult = pickOne([2, 3, 4]);
            const base = randInt(3, 15);
            const label = mult === 2 ? '¿El doble de' : mult === 3 ? '¿El triple de' : '¿El cuádruple de';
            return {
              context: `⚡ ${label} ${base}?`,
              display: `${mult} × ${base} = ?`,
              answer: mult * base,
            };
          }
          case 5: {
            // Operación combinada (multiplicación + suma/resta)
            const a = randInt(2, 7);
            const b = randInt(2, 6);
            const isAdd = Math.random() < 0.6;
            if (isAdd) {
              const c = randInt(1, 15);
              return {
                context: '⚡ Operación Combinada Rápida',
                display: `${a} × ${b} + ${c} = ?`,
                answer: (a * b) + c,
              };
            } else {
              const prod = a * b;
              const c = randInt(1, Math.max(1, prod - 1));
              return {
                context: '⚡ Operación Combinada Rápida',
                display: `${a} × ${b} - ${c} = ?`,
                answer: prod - c,
              };
            }
          }
          case 6: {
            // Tres factores mentales pequeños
            const a = randInt(2, 4);
            const b = randInt(2, 4);
            const c = randInt(2, 5);
            return {
              context: '⚡ Multiplicación de 3 Factores',
              display: `${a} × ${b} × ${c} = ?`,
              answer: a * b * c,
            };
          }
          case 7:
          default: {
            // Cuadrados exactos
            const n = randInt(2, 12);
            return {
              context: '⚡ Cuadrados Rápidos (Mismo número)',
              display: `${n} × ${n} = ?`,
              answer: n * n,
            };
          }
        }
      }

      case 'm2_division': {
        const type = Math.floor(Math.random() * 8);
        switch (type) {
          case 0: {
            // División directa exacta
            let b, q;
            if (streak <= 3) {
              b = randInt(2, 8);
              q = randInt(2, 8);
            } else if (streak <= 7) {
              b = randInt(3, 11);
              q = randInt(3, 11);
            } else {
              b = randInt(4, 14);
              q = randInt(4, 13);
            }
            const a = b * q;
            return {
              context: '⚡ División Rápida',
              display: `${a} ÷ ${b} = ?`,
              answer: q,
            };
          }
          case 1: {
            // Dividendo desconocido
            const b = randInt(2, 9);
            const q = randInt(2, 10);
            return {
              context: '⚡ ¿Qué número dividido da el resultado?',
              display: `? ÷ ${b} = ${q}`,
              answer: b * q,
            };
          }
          case 2: {
            // Divisor desconocido
            const b = randInt(2, 10);
            const q = randInt(2, 10);
            return {
              context: '⚡ ¿Entre cuánto se dividió?',
              display: `${b * q} ÷ ? = ${q}`,
              answer: b,
            };
          }
          case 3: {
            // División de decenas redondas
            const b = randInt(2, 8);
            const q = randInt(2, 9);
            const dividend = (b * q) * 10;
            return {
              context: '⚡ División Rápida con Decenas',
              display: `${dividend} ÷ ${b} = ?`,
              answer: q * 10,
            };
          }
          case 4: {
            // Mitad, tercera o cuarta parte
            const fracType = pickOne([
              { div: 2, name: 'mitad' },
              { div: 3, name: 'tercera parte' },
              { div: 4, name: 'cuarta parte' },
            ]);
            const q = randInt(3, 15);
            const val = fracType.div * q;
            return {
              context: `⚡ ¿La ${fracType.name} de ${val}?`,
              display: `${val} ÷ ${fracType.div} = ?`,
              answer: q,
            };
          }
          case 5: {
            // Problema relámpago de reparto
            const kids = randInt(2, 6);
            const perKid = randInt(2, 8);
            const total = kids * perKid;
            return {
              context: `⚡ Repartir ${total} dulces entre ${kids} amigos`,
              display: `${total} ÷ ${kids} = ?`,
              answer: perKid,
            };
          }
          case 6: {
            // Operación combinada con división
            const b = randInt(2, 6);
            const q = randInt(2, 7);
            const isAdd = Math.random() < 0.5;
            if (isAdd) {
              const c = randInt(1, 10);
              return {
                context: '⚡ Operación Combinada Rápida',
                display: `${b * q} ÷ ${b} + ${c} = ?`,
                answer: q + c,
              };
            } else {
              const c = randInt(1, Math.max(1, q - 1));
              return {
                context: '⚡ Operación Combinada Rápida',
                display: `${b * q} ÷ ${b} - ${c} = ?`,
                answer: q - c,
              };
            }
          }
          case 7:
          default: {
            // División encadenada rápida
            const a = randInt(2, 4);
            const b = randInt(2, 3);
            const c = randInt(2, 5);
            const total = a * b * c;
            return {
              context: '⚡ Doble Reparto',
              display: `${total} ÷ ${a} ÷ ${b} = ?`,
              answer: c,
            };
          }
        }
      }

      case 'm3_fracciones_intro': {
        const type = Math.floor(Math.random() * 8);
        switch (type) {
          case 0: {
            // Identifica el numerador
            const den = randInt(3, 12);
            const num = randInt(1, den - 1);
            return {
              context: '⚡ Identifica el NUMERADOR (el de arriba)',
              display: `${num} / ${den}`,
              answer: num,
            };
          }
          case 1: {
            // Identifica el denominador
            const den = randInt(3, 12);
            const num = randInt(1, den - 1);
            return {
              context: '⚡ Identifica el DENOMINADOR (el de abajo)',
              display: `${num} / ${den}`,
              answer: den,
            };
          }
          case 2: {
            // Fracción complementaria a 1 entero
            const den = randInt(3, 10);
            const num = randInt(1, den - 1);
            const needed = den - num;
            return {
              context: `⚡ ¿Qué numerador falta para 1 entero (${den}/${den})?`,
              display: `${num}/${den} + ?/${den} = ${den}/${den}`,
              answer: needed,
            };
          }
          case 3: {
            // Fracción equivalente (amplificación de numerador)
            const den = randInt(2, 6);
            const num = randInt(1, den - 1);
            const k = randInt(2, 4);
            return {
              context: `⚡ Fracción Equivalente: ¿Nuevo numerador si amplificas por ${k}?`,
              display: `${num}/${den} = ?/${den * k}`,
              answer: num * k,
            };
          }
          case 4: {
            // Fracción equivalente (encontrar denominador)
            const den = randInt(2, 5);
            const num = randInt(1, den - 1);
            const k = randInt(2, 4);
            return {
              context: '⚡ Fracción Equivalente: ¿Cuál es el denominador?',
              display: `${num}/${den} = ${num * k}/?`,
              answer: den * k,
            };
          }
          case 5: {
            // Fracción unitaria de una cantidad
            const den = randInt(2, 6);
            const k = randInt(2, 8);
            const total = den * k;
            return {
              context: `⚡ Fracción de una cantidad: ¿Cuánto es 1/${den} de ${total}?`,
              display: `1/${den} de ${total} = ?`,
              answer: k,
            };
          }
          case 6: {
            // Fracción de una cantidad con numerador > 1
            const den = pickOne([3, 4, 5]);
            const num = randInt(2, den - 1);
            const k = randInt(2, 5);
            const total = den * k;
            return {
              context: `⚡ Fracción de una cantidad: ¿Cuánto es ${num}/${den} de ${total}?`,
              display: `${num}/${den} de ${total} = ?`,
              answer: num * k,
            };
          }
          case 7:
          default: {
            // Rebanadas restantes de una unidad
            const den = randInt(4, 10);
            const eaten = randInt(1, den - 1);
            const left = den - eaten;
            return {
              context: `⚡ De ${den} porciones iguales se consumieron ${eaten}: ¿cuántas quedan?`,
              display: `${den} - ${eaten} = ?`,
              answer: left,
            };
          }
        }
      }

      case 'm4_fracciones_ops': {
        const type = Math.floor(Math.random() * 8);
        switch (type) {
          case 0: {
            // Suma simple homogénea (numerador)
            const den = randInt(4, 12);
            const n1 = randInt(1, den - 2);
            const n2 = randInt(1, den - n1 - 1);
            return {
              context: '⚡ Suma Homogénea: ¿Cuál es el NUMERADOR?',
              display: `${n1}/${den} + ${n2}/${den} = ?/${den}`,
              answer: n1 + n2,
            };
          }
          case 1: {
            // Resta homogénea (numerador)
            const den = randInt(3, 12);
            const n1 = randInt(2, den - 1);
            const n2 = randInt(1, n1 - 1);
            return {
              context: '⚡ Resta Homogénea: ¿Cuál es el NUMERADOR?',
              display: `${n1}/${den} - ${n2}/${den} = ?/${den}`,
              answer: n1 - n2,
            };
          }
          case 2: {
            // Suma de 3 fracciones homogéneas
            const den = randInt(6, 14);
            const n1 = randInt(1, 3);
            const n2 = randInt(1, 3);
            const n3 = randInt(1, 3);
            return {
              context: '⚡ Suma de 3 Fracciones Homogéneas: ¿Numerador?',
              display: `${n1}/${den} + ${n2}/${den} + ${n3}/${den} = ?/${den}`,
              answer: n1 + n2 + n3,
            };
          }
          case 3: {
            // Resta desde la unidad (1 entero = den/den)
            const den = randInt(3, 12);
            const num = randInt(1, den - 1);
            return {
              context: `⚡ Resta de la unidad (1 = ${den}/${den}): ¿Numerador?`,
              display: `1 - ${num}/${den} = ?/${den}`,
              answer: den - num,
            };
          }
          case 4: {
            // Operación combinada (suma y resta homogénea)
            const den = randInt(6, 12);
            const n1 = randInt(2, 5);
            const n2 = randInt(2, 4);
            const n3 = randInt(1, Math.min(3, n1 + n2 - 1));
            return {
              context: '⚡ Operación Homogénea Combinada: ¿Numerador?',
              display: `${n1}/${den} + ${n2}/${den} - ${n3}/${den} = ?/${den}`,
              answer: n1 + n2 - n3,
            };
          }
          case 5: {
            // Término faltante en suma
            const den = randInt(4, 10);
            const n1 = randInt(1, den - 2);
            const n2 = randInt(1, den - n1 - 1);
            return {
              context: '⚡ ¿Qué numerador falta en la suma?',
              display: `${n1}/${den} + ?/${den} = ${n1 + n2}/${den}`,
              answer: n2,
            };
          }
          case 6: {
            // Término faltante en resta
            const den = randInt(4, 10);
            const total = randInt(3, den - 1);
            const sub = randInt(1, total - 1);
            return {
              context: '⚡ ¿Qué numerador se restó?',
              display: `${total}/${den} - ?/${den} = ${total - sub}/${den}`,
              answer: sub,
            };
          }
          case 7:
          default: {
            // Número mixto a fracción impropia
            const den = randInt(2, 8);
            const num = randInt(1, den - 1);
            return {
              context: `⚡ Número Mixto a Impropia: ¿Numerador? (1 = ${den}/${den})`,
              display: `1 y ${num}/${den} = ?/${den}`,
              answer: den + num,
            };
          }
        }
      }

      default: {
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        return { context: '⚡ Contrarreloj', display: `${a} × ${b} = ?`, answer: a * b };
      }
    }
  };

  let candidate = generateCandidate();
  let tries = 0;
  while (_recentFreeExerciseSignatures.includes(candidate.display) && tries < 15) {
    candidate = generateCandidate();
    tries++;
  }

  _recentFreeExerciseSignatures.push(candidate.display);
  if (_recentFreeExerciseSignatures.length > 15) {
    _recentFreeExerciseSignatures.shift();
  }

  return candidate;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR DE EJERCICIOS
// ═══════════════════════════════════════════════════════════════════════════════

function _genExercise(mk, lv) {
  const seed = Object.keys(MODS).indexOf(mk) * 100 + lv;
  const rng = _makeRng(seed);
  const ri = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
  const shuffle = (arr) => {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  };

  switch (mk) {
    case 'm1_multiplicacion': {
      if (lv <= 5) {
        // Nivel 1-5: Factores básicos 2 al 5 (Clásico)
        const a = ri(2, 5);
        const b = ri(2, 6);
        return {
          type: 'classic',
          context: `En la huerta organizaron ${a} hileras con ${b} semillas de maíz cada una. ¿Cuántas semillas sembraron?`,
          display: `${a} × ${b} = ?`,
          answer: a * b,
          hint: `Suma ${a} una cantidad de ${b} veces (${a} + ${a}...).`,
        };
      } else if (lv <= 10) {
        // Nivel 6-10: Arma la Operación (Fichas arrastrables con conmutatividad)
        const dataByLv = {
          6: { a: 4, b: 5, c: 20, distractors: [] },
          7: { a: 6, b: 7, c: 42, distractors: [] },
          8: { a: 8, b: 8, c: 64, distractors: [] },
          9: { a: 7, b: 9, c: 63, distractors: ['54'] },
          10: { a: 12, b: 4, c: 48, distractors: ['36'] },
        };
        const cur = dataByLv[lv] || { a: 5, b: 6, c: 30, distractors: [] };
        const rawTiles = [`${cur.a}`, '×', `${cur.b}`, '=', `${cur.c}`, ...cur.distractors];
        let tiles = shuffle(rawTiles);
        if (tiles.join(',') === `${cur.a},×,${cur.b},=,${cur.c}`) {
          tiles = [tiles[2], tiles[0], tiles[1], tiles[3], tiles[4]];
        }
        const validCombos = [
          `${cur.a},×,${cur.b},=,${cur.c}`,
          `${cur.b},×,${cur.a},=,${cur.c}`,
          `${cur.c},=,${cur.a},×,${cur.b}`,
          `${cur.c},=,${cur.b},×,${cur.a}`,
        ];
        return {
          type: 'tiles',
          context: `🧩 Nivel ${lv}: Arma la igualdad matemática correcta colocando las fichas en orden.`,
          slotsCount: 5,
          tiles,
          validCombos,
          hint: `Recuerda: factor × factor = producto. Ejemplo: ${cur.a} × ${cur.b} = ${cur.c}.`,
        };
      } else if (lv <= 15) {
        // Nivel 11-15: Cazador de Factores (Selecciona los 2 factores del producto)
        const factorsByLv = {
          11: { target: 42, correct: [6, 7], options: [6, 7, 5, 8, 9, 4] },
          12: { target: 48, correct: [6, 8], options: [6, 8, 7, 5, 9, 4] },
          13: { target: 63, correct: [7, 9], options: [7, 9, 6, 8, 5, 12] },
          14: { target: 60, correct: [5, 12], options: [5, 12, 6, 7, 8, 10] },
          15: { target: 84, correct: [7, 12], options: [7, 12, 6, 8, 9, 11] },
        };
        const cur = factorsByLv[lv] || { target: 36, correct: [4, 9], options: [4, 9, 5, 6, 7, 8] };
        return {
          type: 'factors',
          context: `🏹 Cazador de Factores: Encuentra los dos números que multiplicados forman el objetivo.`,
          target: cur.target,
          options: shuffle(cur.options),
          hint: `Busca en las tablas: ¿qué par de números da ${cur.target}?`,
        };
      } else {
        // Nivel 16-20: Desafío Maestro Multirretos (Problemas de razonamiento con 4 opciones)
        const masterByLv = {
          16: {
            context: `👑 Nivel 16: Operaciones combinadas en una granja.`,
            question: `En un establo hay 6 corrales con 8 ovejas cada uno. Luego traen 12 ovejas más. ¿Cuántas ovejas hay en total? (6 × 8) + 12`,
            options: ['60 ovejas', '58 ovejas', '62 ovejas', '50 ovejas'],
            correctIndex: 0,
            hint: `Primero multiplica 6 × 8 = 48, y luego súmale 12.`,
          },
          17: {
            context: `👑 Nivel 17: Propiedades y relaciones de multiplicación.`,
            question: `Si sabemos que 15 × 6 = 90, ¿cuánto es 15 × 12 aprovechando que 12 es el doble de 6?`,
            options: ['180', '150', '200', '165'],
            correctIndex: 0,
            hint: `Como el factor 6 se duplicó a 12, el resultado también se duplica: 90 × 2 = 180.`,
          },
          18: {
            context: `👑 Nivel 18: Desafío de producción agrícola.`,
            question: `Un huerto tiene 14 surcos con 9 matas de fresa cada uno. Si se dañaron 16 matas, ¿cuántas sanas quedan?`,
            options: ['110 matas', '116 matas', '126 matas', '100 matas'],
            correctIndex: 0,
            hint: `Multiplica 14 × 9 = 126, y réstale las 16 matas dañadas.`,
          },
          19: {
            context: `👑 Nivel 19: Doble producto combinado.`,
            question: `Calcula el valor exacto de la expresión: (25 × 4) + (8 × 7) = ?`,
            options: ['156', '146', '166', '170'],
            correctIndex: 0,
            hint: `25 × 4 = 100, y 8 × 7 = 56. Suma ambos valores.`,
          },
          20: {
            context: `👑 Desafío Maestro Final Nivel 20: Gran logística de suministros.`,
            question: `Un convoy lleva 18 cajas grandes. Cada caja tiene 12 estuches, y cada estuche contiene 5 lápices. ¿Cuántos lápices hay en total?`,
            options: ['1080 lápices', '960 lápices', '1200 lápices', '1180 lápices'],
            correctIndex: 0,
            hint: `Multiplica 18 × 12 = 216, luego 216 × 5 = 1080 lápices.`,
          },
        };
        const cur = masterByLv[lv] || masterByLv[20];
        return {
          type: 'master_choice',
          ...cur,
        };
      }
    }

    case 'm2_division': {
      if (lv <= 5) {
        // Nivel 1-5: Divisiones exactas con divisores 2 al 5 (Clásico)
        const b = ri(2, 5);
        const q = ri(2, 5);
        const a = b * q;
        return {
          type: 'classic',
          context: `Se repartieron ${a} galletas entre ${b} amigos por partes iguales. ¿Cuántas galletas recibió cada uno?`,
          display: `${a} ÷ ${b} = ?`,
          answer: q,
          hint: `¿Qué número multiplicado por ${b} da ${a}?`,
        };
      } else if (lv <= 10) {
        // Nivel 6-10: Arma la Operación (Fichas con divisores y cocientes)
        const dataByLv = {
          6: { a: 24, b: 6, c: 4, distractors: [] },
          7: { a: 35, b: 5, c: 7, distractors: [] },
          8: { a: 56, b: 8, c: 7, distractors: [] },
          9: { a: 72, b: 9, c: 8, distractors: ['6'] },
          10: { a: 96, b: 8, c: 12, distractors: ['14'] },
        };
        const cur = dataByLv[lv] || { a: 30, b: 5, c: 6, distractors: [] };
        const rawTiles = [`${cur.a}`, '÷', `${cur.b}`, '=', `${cur.c}`, ...cur.distractors];
        let tiles = shuffle(rawTiles);
        if (tiles.join(',') === `${cur.a},÷,${cur.b},=,${cur.c}`) {
          tiles = [tiles[2], tiles[0], tiles[1], tiles[3], tiles[4]];
        }
        const validCombos = [
          `${cur.a},÷,${cur.b},=,${cur.c}`,
          `${cur.a},÷,${cur.c},=,${cur.b}`,
          `${cur.c},=,${cur.a},÷,${cur.b}`,
          `${cur.b},=,${cur.a},÷,${cur.c}`,
        ];
        return {
          type: 'tiles',
          context: `🧩 Nivel ${lv}: Arma la división colocando el dividendo, divisor y cociente en orden.`,
          slotsCount: 5,
          tiles,
          validCombos,
          hint: `Dividendo ÷ Divisor = Cociente. Ejemplo: ${cur.a} ÷ ${cur.b} = ${cur.c}.`,
        };
      } else if (lv <= 15) {
        // Nivel 11-15: Emparejador de Cocientes (Selecciona la división correcta)
        const quotientsByLv = {
          11: {
            target: 6,
            options: ['48 ÷ 8', '45 ÷ 5', '35 ÷ 7', '54 ÷ 6'],
            correctIndex: 0,
            hint: '48 dividido entre 8 es exactamente 6.',
          },
          12: {
            target: 7,
            options: ['56 ÷ 8', '48 ÷ 6', '63 ÷ 7', '40 ÷ 5'],
            correctIndex: 0,
            hint: '56 dividido entre 8 es 7 (7 × 8 = 56).',
          },
          13: {
            target: 8,
            options: ['72 ÷ 9', '54 ÷ 9', '63 ÷ 7', '42 ÷ 6'],
            correctIndex: 0,
            hint: '72 dividido entre 9 es 8 (8 × 9 = 72).',
          },
          14: {
            target: 9,
            options: ['81 ÷ 9', '70 ÷ 10', '48 ÷ 6', '36 ÷ 6'],
            correctIndex: 0,
            hint: '81 dividido entre 9 es 9 (9 × 9 = 81).',
          },
          15: {
            target: 12,
            options: ['84 ÷ 7', '90 ÷ 10', '77 ÷ 7', '96 ÷ 12'],
            correctIndex: 0,
            hint: '84 dividido entre 7 es 12 (12 × 7 = 84).',
          },
        };
        const cur = quotientsByLv[lv] || quotientsByLv[11];
        const optsWithIdx = cur.options.map((opt, i) => ({ opt, isCorrect: i === cur.correctIndex }));
        const shuffledOpts = shuffle(optsWithIdx);
        const correctIndex = shuffledOpts.findIndex(o => o.isCorrect);
        return {
          type: 'match_quotient',
          context: `🔍 Emparejador de Cocientes: Encuentra la tarjeta con el resultado exacto.`,
          targetQuotient: cur.target,
          options: shuffledOpts.map(o => o.opt),
          correctIndex,
          hint: cur.hint,
        };
      } else {
        // Nivel 16-20: Desafío Maestro Multirretos
        const masterByLv = {
          16: {
            context: `👑 Nivel 16: División y suma combinada.`,
            question: `Calcula el resultado de la siguiente expresión: (120 ÷ 4) + 15 = ?`,
            options: ['45', '40', '50', '35'],
            correctIndex: 0,
            hint: `120 ÷ 4 = 30; luego 30 + 15 = 45.`,
          },
          17: {
            context: `👑 Nivel 17: Distribución equitativa escolar.`,
            question: `Un profesor reparte 98 lápices entre 7 equipos por igual. ¿Cuántos lápices recibe cada equipo?`,
            options: ['14 lápices', '12 lápices', '16 lápices', '15 lápices'],
            correctIndex: 0,
            hint: `98 ÷ 7: 7 cabe en 9 una vez (sobran 2), y 7 cabe en 28 cuatro veces = 14.`,
          },
          18: {
            context: `👑 Nivel 18: Adivinanza con operaciones inversas.`,
            question: `Si a un número secreto lo dividimos entre 9 y le sumamos 8 obtenemos 16. ¿Cuál es el número secreto?`,
            options: ['72', '63', '81', '54'],
            correctIndex: 0,
            hint: `Resta 16 - 8 = 8; luego multiplica 8 × 9 = 72.`,
          },
          19: {
            context: `👑 Nivel 19: Doble división multiplicada.`,
            question: `Calcula el valor exacto: (144 ÷ 12) × (80 ÷ 10) = ?`,
            options: ['96', '88', '108', '92'],
            correctIndex: 0,
            hint: `144 ÷ 12 = 12, y 80 ÷ 10 = 8. Multiplica 12 × 8 = 96.`,
          },
          20: {
            context: `👑 Desafío Maestro Final Nivel 20: Empaque de repostería.`,
            question: `Una fábrica produjo 450 galletas. Apartó 30 galletas defectuosas y empacó el resto en cajas de 15 galletas. ¿Cuántas cajas llenó?`,
            options: ['28 cajas', '30 cajas', '26 cajas', '32 cajas'],
            correctIndex: 0,
            hint: `450 - 30 = 420 galletas aptas. 420 ÷ 15 = 28 cajas.`,
          },
        };
        const cur = masterByLv[lv] || masterByLv[20];
        return {
          type: 'master_choice',
          ...cur,
        };
      }
    }

    case 'm3_fracciones_intro': {
      if (lv <= 5) {
        // Nivel 1-5: Numerador de fracciones visuales básicas (Clásico)
        const den = ri(3, 5);
        const num = ri(1, den - 1);
        return {
          type: 'classic',
          context: `Una pizza se dividió en ${den} porciones iguales. Si comiste ${num} porciones, ¿cuál es el NUMERADOR de la fracción comida?`,
          display: `${num} / ${den}`,
          answer: num,
          hint: `El numerador es el número que va arriba (${num}).`,
        };
      } else if (lv <= 10) {
        // Nivel 6-10: Arma la Operación de la Unidad (Fichas)
        const dataByLv = {
          6: { a: '1/4', b: '3/4', c: '4/4', distractors: [] },
          7: { a: '2/5', b: '3/5', c: '5/5', distractors: [] },
          8: { a: '3/6', b: '3/6', c: '6/6', distractors: [] },
          9: { a: '5/8', b: '3/8', c: '8/8', distractors: ['7/8'] },
          10: { a: '4/10', b: '6/10', c: '10/10', distractors: ['9/10'] },
        };
        const cur = dataByLv[lv] || { a: '1/3', b: '2/3', c: '3/3', distractors: [] };
        const rawTiles = [cur.a, '+', cur.b, '=', cur.c, ...cur.distractors];
        let tiles = shuffle(rawTiles);
        if (tiles.join(',') === `${cur.a},+,${cur.b},=,${cur.c}`) {
          tiles = [tiles[2], tiles[0], tiles[1], tiles[3], tiles[4]];
        }
        const validCombos = [
          `${cur.a},+,${cur.b},=,${cur.c}`,
          `${cur.b},+,${cur.a},=,${cur.c}`,
          `${cur.c},=,${cur.a},+,${cur.b}`,
          `${cur.c},=,${cur.b},+,${cur.a}`,
        ];
        return {
          type: 'tiles',
          context: `🧩 Nivel ${lv}: Arma la suma de fracciones que completa 1 unidad entera.`,
          slotsCount: 5,
          tiles,
          validCombos,
          hint: `Suma los numeradores con igual denominador: ${cur.a} + ${cur.b} = ${cur.c}.`,
        };
      } else if (lv <= 15) {
        // Nivel 11-15: Pizza Fraccionaria Interactiva (Toca las rebanadas)
        const slicesByLv = {
          11: { total: 4, num: 3 },
          12: { total: 6, num: 4 },
          13: { total: 6, num: 5 },
          14: { total: 8, num: 5 },
          15: { total: 8, num: 7 },
        };
        const cur = slicesByLv[lv] || { total: 6, num: 3 };
        return {
          type: 'slices',
          context: `🍕 Nivel ${lv}: Toca la cantidad exacta de porciones para representar la fracción indicada.`,
          targetNumerator: cur.num,
          totalSlices: cur.total,
          hint: `Debes pintar exactamente ${cur.num} de las ${cur.total} porciones de la pizza.`,
        };
      } else {
        // Nivel 16-20: Desafío Maestro Multirretos
        const masterByLv = {
          16: {
            context: `👑 Nivel 16: Fracciones equivalentes.`,
            question: `¿Cuál de las siguientes fracciones es equivalente a 2/3? (Multiplica numerador y denominador por 3)`,
            options: ['6/9', '4/5', '5/8', '6/8'],
            correctIndex: 0,
            hint: `(2 × 3) / (3 × 3) = 6/9. Ambas representan la misma porción.`,
          },
          17: {
            context: `👑 Nivel 17: Comparación con igual denominador.`,
            question: `¿Cuál de las siguientes fracciones es la MAYOR de todas?`,
            options: ['7/8', '5/8', '3/8', '1/8'],
            correctIndex: 0,
            hint: `Con igual denominador, la mayor fracción es la que tiene mayor numerador (7 > 5 > 3 > 1).`,
          },
          18: {
            context: `👑 Nivel 18: Fracción de una cantidad total.`,
            question: `En una fiesta hay 36 caramelos y se reparten 3/4 del total. ¿Cuántos caramelos se repartieron?`,
            options: ['27 caramelos', '24 caramelos', '30 caramelos', '18 caramelos'],
            correctIndex: 0,
            hint: `Divide 36 entre 4 = 9, y luego multiplica por 3 = 27 caramelos.`,
          },
          19: {
            context: `👑 Nivel 19: Fracciones impropias.`,
            question: `¿Cuál de las siguientes es una fracción IMPROPIA (numerador mayor que el denominador)?`,
            options: ['9/7', '5/6', '3/4', '7/8'],
            correctIndex: 0,
            hint: `En una fracción impropia el numerador es mayor que el denominador: 9 > 7.`,
          },
          20: {
            context: `👑 Desafío Maestro Final Nivel 20: Reparto en el banquete.`,
            question: `Tres amigos comieron de una pizza: Ana comió 2/8, Beto 3/8 y Clara 1/8. ¿Qué fracción de la pizza sobró?`,
            options: ['2/8 (o 1/4)', '3/8', '1/8', '4/8'],
            correctIndex: 0,
            hint: `Comieron en total: 2/8 + 3/8 + 1/8 = 6/8. Sobró 8/8 - 6/8 = 2/8.`,
          },
        };
        const cur = masterByLv[lv] || masterByLv[20];
        return {
          type: 'master_choice',
          ...cur,
        };
      }
    }

    case 'm4_fracciones_ops': {
      if (lv <= 5) {
        // Nivel 1-5: Operaciones homogéneas simples (Clásico)
        const den = ri(4, 7);
        const n1 = ri(1, den - 2);
        const n2 = ri(1, den - n1 - 1);
        return {
          type: 'classic',
          context: `Lucía pintó ${n1}/${den} de un mural y Carlos pintó ${n2}/${den}. ¿Cuál es el numerador de la suma total pintada?`,
          display: `${n1}/${den} + ${n2}/${den} = ?/${den}`,
          answer: n1 + n2,
          hint: `Mismo denominador (${den}): solo suma los numeradores ${n1} + ${n2}.`,
        };
      } else if (lv <= 10) {
        // Nivel 6-10: Arma la Operación (Fichas de suma o resta)
        const dataByLv = {
          6: { a: '2/6', op: '+', b: '3/6', c: '5/6', distractors: [] },
          7: { a: '6/8', op: '-', b: '2/8', c: '4/8', distractors: [] },
          8: { a: '3/10', op: '+', b: '4/10', c: '7/10', distractors: [] },
          9: { a: '9/12', op: '-', b: '4/12', c: '5/12', distractors: ['6/12'] },
          10: { a: '4/15', op: '+', b: '7/15', c: '11/15', distractors: ['10/15'] },
        };
        const cur = dataByLv[lv] || { a: '2/5', op: '+', b: '1/5', c: '3/5', distractors: [] };
        const rawTiles = [cur.a, cur.op, cur.b, '=', cur.c, ...cur.distractors];
        let tiles = shuffle(rawTiles);
        if (tiles.join(',') === `${cur.a},${cur.op},${cur.b},=,${cur.c}`) {
          tiles = [tiles[2], tiles[0], tiles[1], tiles[3], tiles[4]];
        }
        const validCombos = cur.op === '+' ? [
          `${cur.a},+,${cur.b},=,${cur.c}`,
          `${cur.b},+,${cur.a},=,${cur.c}`,
          `${cur.c},=,${cur.a},+,${cur.b}`,
          `${cur.c},=,${cur.b},+,${cur.a}`,
        ] : [
          `${cur.a},-,${cur.b},=,${cur.c}`,
          `${cur.c},=,${cur.a},-,${cur.b}`,
        ];
        return {
          type: 'tiles',
          context: `🧩 Nivel ${lv}: Arma la operación fraccionaria colocando los términos y el resultado.`,
          slotsCount: 5,
          tiles,
          validCombos,
          hint: `Opera numeradores conservando el mismo denominador: ${cur.a} ${cur.op} ${cur.b} = ${cur.c}.`,
        };
      } else if (lv <= 15) {
        // Nivel 11-15: Balanza de Fracciones (Equilibra la balanza)
        const balanceByLv = {
          11: {
            left: '2/7 + 3/7',
            correct: '5/7',
            options: ['5/7', '4/7', '6/7', '3/7'],
            hint: '2/7 + 3/7 = 5/7.',
          },
          12: {
            left: '7/9 - 3/9',
            correct: '4/9',
            options: ['4/9', '5/9', '3/9', '2/9'],
            hint: '7/9 - 3/9 = 4/9.',
          },
          13: {
            left: '3/10 + 5/10',
            correct: '8/10',
            options: ['8/10', '7/10', '9/10', '6/10'],
            hint: '3/10 + 5/10 = 8/10.',
          },
          14: {
            left: '1 - 4/8',
            correct: '4/8',
            options: ['4/8', '3/8', '5/8', '2/8'],
            hint: '1 entero es 8/8. 8/8 - 4/8 = 4/8.',
          },
          15: {
            left: '2/11 + 4/11 + 3/11',
            correct: '9/11',
            options: ['9/11', '8/11', '10/11', '7/11'],
            hint: '2 + 4 + 3 = 9/11.',
          },
        };
        const cur = balanceByLv[lv] || balanceByLv[11];
        const optsWithIdx = cur.options.map((opt, i) => ({ opt, isCorrect: opt === cur.correct }));
        const shuffledOpts = shuffle(optsWithIdx);
        const correctIndex = shuffledOpts.findIndex(o => o.isCorrect);
        return {
          type: 'balance',
          context: `⚖️ Nivel ${lv}: Coloca la pesa fraccionaria en el platillo derecho para equilibrar la balanza.`,
          leftExpr: cur.left,
          options: shuffledOpts.map(o => o.opt),
          correctIndex,
          hint: cur.hint,
        };
      } else {
        // Nivel 16-20: Desafío Maestro Multirretos
        const masterByLv = {
          16: {
            context: `👑 Nivel 16: Suma y resta combinada.`,
            question: `Calcula la operación combinada: (5/12 + 4/12) - 3/12 = ?`,
            options: ['6/12', '4/12', '7/12', '8/12'],
            correctIndex: 0,
            hint: `5/12 + 4/12 = 9/12; luego 9/12 - 3/12 = 6/12.`,
          },
          17: {
            context: `👑 Nivel 17: Receta y complemento a la unidad.`,
            question: `Una receta necesita 1 kilo de harina (8/8). Si agregas 3/8 y luego 2/8 de kilo, ¿qué fracción falta agregar?`,
            options: ['3/8', '4/8', '2/8', '5/8'],
            correctIndex: 0,
            hint: `Has agregado 3/8 + 2/8 = 5/8. Para 8/8 faltan 8/8 - 5/8 = 3/8.`,
          },
          18: {
            context: `👑 Nivel 18: Comparación de distancias recorridas.`,
            question: `Mateo recorrió 7/15 de la pista y Sofía recorrió 11/15. ¿Cuánto más recorrió Sofía que Mateo?`,
            options: ['4/15', '3/15', '5/15', '6/15'],
            correctIndex: 0,
            hint: `Resta la distancia de Sofía menos la de Mateo: 11/15 - 7/15 = 4/15.`,
          },
          19: {
            context: `👑 Nivel 19: Flujo de agua en depósito.`,
            question: `Un tanque lleno tiene 12/12. Se gastan 4/12 de mañana y 5/12 de tarde, pero la lluvia aporta 2/12. ¿Cuánta agua queda?`,
            options: ['5/12', '4/12', '6/12', '7/12'],
            correctIndex: 0,
            hint: `12/12 - 4/12 - 5/12 + 2/12 = 5/12.`,
          },
          20: {
            context: `👑 Desafío Maestro Final Nivel 20: Terreno agrícola.`,
            question: `En un terreno de 500 m², 3/10 se destinan a maíz y 4/10 a frijol. El resto se deja a hortalizas. ¿Cuántos m² son de hortalizas?`,
            options: ['150 m² (3/10)', '200 m² (4/10)', '100 m² (2/10)', '175 m²'],
            correctIndex: 0,
            hint: `Hortalizas: 10/10 - 7/10 = 3/10. 3/10 de 500 m² = (500 ÷ 10) × 3 = 150 m².`,
          },
        };
        const cur = masterByLv[lv] || masterByLv[20];
        return {
          type: 'master_choice',
          ...cur,
        };
      }
    }

    default:
      return {
        type: 'classic',
        context: 'Práctica general',
        display: '3 × 3 = ?',
        answer: 9,
        hint: '3 veces 3.',
      };
  }
}

function _makeRng(seed) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BINDING DE EVENTOS
// ═══════════════════════════════════════════════════════════════════════════════

function _bind(state, scr, ctx) {
  const $ = (sel) => scr.querySelector(sel);

  if (_rouletteTicker && state !== 'STORE') {
    clearInterval(_rouletteTicker);
    _rouletteTicker = null;
  }

  let busy = false;
  const go = (fn) => {
    if (busy) return;
    busy = true;
    fn();
    setTimeout(() => (busy = false), 320);
  };

  // Botón Fullscreen en cualquier pantalla
  scr.querySelectorAll('.btn-fullscreen-toggle').forEach((btn) => {
    btn.addEventListener('click', _toggleFullscreen);
  });

  // Botón Volver genérico del HUD
  $('#hud-btn-back')?.addEventListener('click', (e) => {
    playPop();
    const target = e.currentTarget.dataset.target || 'LOBBY';
    transition(target, ctx);
  });

  // Audio toggles del HUD
  $('#hud-btn-sfx')?.addEventListener('click', () => {
    playPop();
    const now = isSfxEnabled();
    const next = !now;
    setSfxEnabled(next);
    const save = _s();
    save.user.sfx_enabled = next;
    _persist(save);
    _syncHudAudioButtons();
  });
  $('#hud-btn-music')?.addEventListener('click', () => {
    playPop();
    const now = isMusicEnabled();
    const next = !now;
    setMusicEnabled(next);
    if (next) startBGM();
    const save = _s();
    save.user.music_enabled = next;
    _persist(save);
    _syncHudAudioButtons();
  });
  $('#hud-btn-cloud')?.addEventListener('click', () => {
    playClick();
    _openCloudDialog();
  });
  $('#hud-btn-settings')?.addEventListener('click', () => {
    playClick();
    _openSettingsDialog();
  });

  switch (state) {
    /* ─── WELCOME (LOGIN / REGISTRO / INVITADO) ───────────────────────────── */
    case 'WELCOME': {
      attachPersistentScrollbar($('#screen .modal-box--welcome'));

      const tabLogin = $('#wc-tab-login');
      const tabReg = $('#wc-tab-reg');
      const panelLogin = $('#wc-panel-login');
      const panelReg = $('#wc-panel-reg');

      tabLogin?.addEventListener('click', () => {
        playClick();
        tabLogin.classList.add('cloud-tab-btn--active');
        tabReg?.classList.remove('cloud-tab-btn--active');
        if (panelLogin) panelLogin.style.display = 'block';
        if (panelReg) panelReg.style.display = 'none';
        $('#wc-login-id')?.focus();
      });

      tabReg?.addEventListener('click', () => {
        playClick();
        tabReg.classList.add('cloud-tab-btn--active');
        tabLogin?.classList.remove('cloud-tab-btn--active');
        if (panelLogin) panelLogin.style.display = 'none';
        if (panelReg) panelReg.style.display = 'block';
        $('#wc-reg-name')?.focus();
      });

      // Iniciar Sesión con Tarjeta de Identidad
      $('#wc-btn-login')?.addEventListener('click', async () => {
        playPop();
        const idInp = $('#wc-login-id');
        const errEl = $('#wc-login-err');
        const btn = $('#wc-btn-login');
        const studentId = cleanStudentId(idInp?.value);

        if (!studentId || studentId.length < 4) {
          if (errEl) {
            errEl.textContent = 'Ingresa tu documento de identidad (mínimo 4 números).';
            errEl.style.display = 'block';
          }
          return;
        }

        if (btn) {
          btn.disabled = true;
          btn.textContent = '⏳ Conectando...';
        }
        if (errEl) errEl.style.display = 'none';

        const res = await loginStudent(studentId);
        if (!res.ok) {
          if (btn) {
            btn.disabled = false;
            btn.textContent = '📥 ¡ENTRAR Y CARGAR MI AVANCE!';
          }
          if (errEl) {
            errEl.textContent = res.error || 'Error al iniciar sesión.';
            errEl.style.display = 'block';
          }
          return;
        }

        // Descargar partida de Firestore
        const cloudRes = await fetchProgressFromCloud();
        let save = _s();
        if (cloudRes.ok && cloudRes.data) {
          save = smartMergeSave(save, cloudRes.data);
        } else {
          // Primera sincronización
          await saveProgressToCloud(save);
        }

        save.user.student_id = studentId;
        save.user.alias = res.user.displayName || save.user.alias;
        save.user.cloud_synced = true;
        save.diagnostics.pretest_score = 0;
        _persist(save, true);

        startBGM();
        playVictory();
        showToast(`¡Bienvenido de nuevo, ${save.user.alias}! 🎒☁️`, 'ok', '👋');
        transition('LOBBY');
      });

      // Crear Cuenta con Nombre y Tarjeta de Identidad
      $('#wc-btn-reg')?.addEventListener('click', async () => {
        playPop();
        const nameInp = $('#wc-reg-name');
        const idInp = $('#wc-reg-id');
        const errEl = $('#wc-reg-err');
        const btn = $('#wc-btn-reg');

        const fullName = (nameInp?.value || '').trim();
        const studentId = cleanStudentId(idInp?.value);

        if (!fullName || fullName.length < 2) {
          if (errEl) {
            errEl.textContent = 'Por favor escribe tu primer nombre y primer apellido.';
            errEl.style.display = 'block';
          }
          return;
        }

        if (!studentId || studentId.length < 4) {
          if (errEl) {
            errEl.textContent = 'Ingresa tu documento de identidad (mínimo 4 números).';
            errEl.style.display = 'block';
          }
          return;
        }

        if (btn) {
          btn.disabled = true;
          btn.textContent = '⏳ Creando cuenta...';
        }
        if (errEl) errEl.style.display = 'none';

        const res = await registerStudent(studentId, fullName);
        if (!res.ok) {
          if (btn) {
            btn.disabled = false;
            btn.textContent = '🚀 ¡CREAR CUENTA Y JUGAR!';
          }
          if (errEl) {
            errEl.textContent = res.error || 'No se pudo crear la cuenta.';
            errEl.style.display = 'block';
          }
          return;
        }

        const save = _s();
        save.user.student_id = studentId;
        save.user.alias = fullName;
        save.user.cloud_synced = true;
        save.diagnostics.pretest_score = 0;
        await saveProgressToCloud(save);
        _persist(save, true);

        startBGM();
        playVictory();
        showToast('¡Cuenta creada y partida en la nube! 🎉', 'ok', '🚀');
        transition('LOBBY');
      });

      // Continuar como Invitado Offline (sin red)
      $('#wc-btn-guest')?.addEventListener('click', () => go(() => {
        playPop();
        startBGM();
        const save = _s();
        save.user.alias = save.user.alias !== 'Estudiante' ? save.user.alias : 'Aventurero';
        save.diagnostics.pretest_score = 0;
        _persist(save);
        transition('LOBBY');
      }));
      break;
    }

    /* ─── LOBBY (PANTALLA PRINCIPAL HUB) ─────────────────────────────────── */
    case 'LOBBY': {
      $('#lobby-btn-adventure')?.addEventListener('click', () => go(() => {
        playPop();
        transition('MODULE_SELECT');
      }));

      $('#lobby-btn-freemode')?.addEventListener('click', () => go(() => {
        playPop();
        _freeModeActiveTopic = null;
        transition('FREE_MODE', { activePlaying: false });
      }));

      $('#lobby-btn-store')?.addEventListener('click', () => go(() => {
        playPop();
        transition('STORE');
      }));

      $('#lobby-btn-tasks')?.addEventListener('click', () => {
        _openTasksDialog();
      });

      $('#lobby-btn-profile')?.addEventListener('click', () => {
        _openProfileDialog();
      });

      $('#lobby-avatar-mascot')?.addEventListener('click', () => {
        playGuide();
        const bubble = $('#lobby-mascot-bubble');
        if (bubble) {
          bubble.textContent = _getNextAvatarQuote();
          bubble.classList.remove('bubble-pop');
          void bubble.offsetWidth;
          bubble.classList.add('bubble-pop');
          setTimeout(() => {
            bubble.classList.remove('bubble-pop');
          }, 260);
        }
        const unit = $('#lobby-avatar-mascot .avatar-floating-unit');
        if (unit) {
          unit.classList.remove('avatar-tap-squish');
          void unit.offsetWidth;
          unit.classList.add('avatar-tap-squish');
          setTimeout(() => {
            unit.classList.remove('avatar-tap-squish');
          }, 360);
        }
      });
      break;
    }

    /* ─── OVERWORLD (SELECTOR DE ISLAS) ─────────────────────────────────── */
    case 'MODULE_SELECT': {
      scr.querySelectorAll('.island-card:not(.island-card--locked)').forEach((card) => {
        card.addEventListener('click', () => go(() => {
          playPop();
          transition('LEVEL_BOARD', { mk: card.dataset.mk });
        }));
      });

      scr.querySelectorAll('.island-btn-cta--unlocked').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          go(() => {
            playPop();
            transition('LEVEL_BOARD', { mk: btn.dataset.mk });
          });
        });
      });

      scr.querySelectorAll('.island-card--locked').forEach((card) => {
        card.addEventListener('click', () => {
          playError();
          showToast('🔒 ¡Completa los 20 niveles del módulo anterior para desbloquear este mundo!', 'err', '🗺️');
        });
      });

      $('#ow-btn-freemode-quick')?.addEventListener('click', () => go(() => {
        playPop();
        _freeModeActiveTopic = null;
        transition('FREE_MODE', { activePlaying: false });
      }));

      $('#ow-btn-store-quick')?.addEventListener('click', () => go(() => {
        playPop();
        transition('STORE');
      }));
      break;
    }

    /* ─── LEVEL BOARD ────────────────────────────────────────────────────── */
    case 'LEVEL_BOARD': {
      $('#lb-btn-freemode-this')?.addEventListener('click', () => go(() => {
        playPop();
        _freeModeActiveTopic = null;
        transition('FREE_MODE', { activePlaying: false });
      }));

      // Botones de Guías Didácticas indexadas (Guía 1 a 4)
      scr.querySelectorAll('.lvl-btn-guide:not(:disabled)').forEach((btn) => {
        btn.addEventListener('click', () => {
          playGuide();
          const mk = btn.dataset.mk;
          const guideLv = Number(btn.dataset.guideLv);
          const guide = getDidacticGuide(mk, guideLv);
          if (guide) {
            showDidacticGuideModal({
              mk,
              lv: guideLv,
              guide,
              onStart: () => transition('GAMEPLAY', { mk, lv: guideLv }),
              showBack: true,
              onBack: () => {},
            });
          }
        });
      });

      // Botones de niveles numéricos
      scr.querySelectorAll('.lvl-btn-chunky:not(.lvl-btn-guide):not(:disabled)').forEach((btn) => {
        btn.addEventListener('click', () => go(() => {
          const lv = Number(btn.dataset.lv);
          const mk = btn.dataset.mk;
          playPop();
          transition('GAMEPLAY', { mk, lv });
        }));
      });
      break;
    }

    /* ─── GAMEPLAY (CAMPAÑA CON MODOS VARIADOS Y ANTI-FARMING) ───────────── */
    case 'GAMEPLAY': {
      const { mk, lv } = ctx;
      const ex = _genExercise(mk, lv);
      const checkBtn = $('#gp-btn-check');
      const hintBtn = $('#gp-btn-hint');
      const heartsContainer = $('#gp-hearts-box');
      const isMaster = lv === 20;

      let errors = 0;
      let usedHints = 0;
      const startMs = Date.now();

      const anchorEl = scr.querySelector('.gp-context-box') || scr.querySelector('.gp-card-brawl');

      // ─── 1. BINDING SEGÚN EL TIPO DE JUEGO ────────────────────────────────
      let placedTiles = [];
      let selectedFactors = [];
      let selectedChoiceIdx = null;
      const activeSlices = new Set();
      const inp = $('#gp-inp-ans');

      if (ex.type === 'classic') {
        setTimeout(() => inp?.focus(), 250);
        inp?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') checkBtn?.click();
        });
      } else if (ex.type === 'tiles') {
        const slots = Array.from(scr.querySelectorAll('.gp-tile-slot'));
        const tray = scr.querySelector('#gp-tray-container');
        placedTiles = new Array(ex.slotsCount).fill(null);

        const placeTileInSlot = (tileEl, slotIdx) => {
          if (placedTiles[slotIdx]) {
            tray.appendChild(placedTiles[slotIdx]);
          }
          placedTiles[slotIdx] = tileEl;
          const slot = slots[slotIdx];
          slot.innerHTML = '';
          slot.appendChild(tileEl);
          slot.classList.add('filled');
          playPop();
        };

        const removeTileFromSlot = (slotIdx) => {
          const tileEl = placedTiles[slotIdx];
          if (tileEl) {
            tray.appendChild(tileEl);
            placedTiles[slotIdx] = null;
            const slot = slots[slotIdx];
            slot.innerHTML = '<span class="gp-tile-slot-ph">?</span>';
            slot.classList.remove('filled');
            playPop();
          }
        };

        tray?.addEventListener('click', (e) => {
          const tile = e.target.closest('.gp-tile');
          if (!tile || tile.parentElement !== tray) return;
          const emptyIdx = placedTiles.findIndex((p) => p === null);
          if (emptyIdx !== -1) {
            placeTileInSlot(tile, emptyIdx);
          }
        });

        slots.forEach((slot, idx) => {
          slot.addEventListener('click', () => removeTileFromSlot(idx));
        });

        scr.querySelectorAll('.gp-tile').forEach((tile) => {
          tile.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', tile.dataset.tileId);
          });
        });

        slots.forEach((slot, idx) => {
          slot.addEventListener('dragover', (e) => e.preventDefault());
          slot.addEventListener('drop', (e) => {
            e.preventDefault();
            const tileId = e.dataTransfer.getData('text/plain');
            const tileEl = scr.querySelector(`.gp-tile[data-tile-id="${tileId}"]`);
            if (!tileEl) return;
            const prevIdx = placedTiles.indexOf(tileEl);
            if (prevIdx !== -1) {
              placedTiles[prevIdx] = null;
              slots[prevIdx].innerHTML = '<span class="gp-tile-slot-ph">?</span>';
              slots[prevIdx].classList.remove('filled');
            }
            placeTileInSlot(tileEl, idx);
          });
        });

        scr.querySelector('#gp-btn-reset-tiles')?.addEventListener('click', () => {
          playClick();
          slots.forEach((_, idx) => removeTileFromSlot(idx));
        });
      } else if (ex.type === 'factors') {
        const statusCount = scr.querySelector('#gp-factors-count');
        scr.querySelectorAll('.gp-factor-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const val = Number(btn.dataset.val);
            const idx = btn.dataset.idx;
            const foundPos = selectedFactors.findIndex((f) => f.idx === idx);
            if (foundPos !== -1) {
              selectedFactors.splice(foundPos, 1);
              btn.classList.remove('selected');
              playPop();
            } else {
              if (selectedFactors.length >= 2) {
                const old = selectedFactors.shift();
                const oldBtn = scr.querySelector(`.gp-factor-btn[data-idx="${old.idx}"]`);
                oldBtn?.classList.remove('selected');
              }
              selectedFactors.push({ idx, val });
              btn.classList.add('selected');
              playClick();
            }
            if (statusCount) statusCount.textContent = selectedFactors.length;
          });
        });
      } else if (ex.type === 'match_quotient' || ex.type === 'balance' || ex.type === 'master_choice') {
        scr.querySelectorAll('.gp-choice-card').forEach((card) => {
          card.addEventListener('click', () => {
            scr.querySelectorAll('.gp-choice-card').forEach((c) => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedChoiceIdx = Number(card.dataset.idx);
            if (ex.type === 'balance') {
              const rightVal = scr.querySelector('#gp-pan-right-val');
              if (rightVal) rightVal.textContent = card.querySelector('.gp-choice-expr')?.textContent || '';
            }
            playClick();
          });
        });
      } else if (ex.type === 'slices') {
        const slicesCount = scr.querySelector('#gp-slices-count');
        scr.querySelectorAll('.gp-pizza-wedge').forEach((wedge) => {
          wedge.addEventListener('click', () => {
            const sliceIdx = wedge.dataset.slice;
            if (activeSlices.has(sliceIdx)) {
              activeSlices.delete(sliceIdx);
              wedge.classList.remove('active');
            } else {
              activeSlices.add(sliceIdx);
              wedge.classList.add('active');
            }
            playPop();
            if (slicesCount) slicesCount.textContent = activeSlices.size;
          });
        });
      }

      $('#gp-btn-guide-instant')?.addEventListener('click', () => {
        playGuide();
        const guide = getDidacticGuide(mk, lv);
        if (guide) {
          showDidacticGuideModal({
            mk,
            lv,
            guide,
            onStart: () => inp?.focus(),
            showBack: true,
            onBack: () => inp?.focus(),
          });
        }
      });

      hintBtn?.addEventListener('click', () => {
        playClick();
        usedHints++;
        _setFeedback(scr, 'hint', `💡 Pista: ${ex.hint}`);
      });

      // ─── 2. COMPROBACIÓN DE RESPUESTA ──────────────────────────────────────
      checkBtn?.addEventListener('click', () => go(() => {
        let isCorrect = false;

        switch (ex.type) {
          case 'classic': {
            const raw = inp?.value.trim();
            if (!raw) {
              playError();
              _shakeInput(inp);
              return;
            }
            isCorrect = (Number(raw) === ex.answer);
            break;
          }
          case 'tiles': {
            if (placedTiles.includes(null)) {
              playError();
              _setFeedback(scr, 'err', '⚠️ Coloca todas las fichas en las casillas antes de comprobar.');
              _shakeCard(scr.querySelector('#gp-slots-container'));
              return;
            }
            const userCombo = placedTiles.map((p) => p.dataset.val).join(',');
            isCorrect = ex.validCombos.includes(userCombo);
            break;
          }
          case 'factors': {
            if (selectedFactors.length !== 2) {
              playError();
              _setFeedback(scr, 'err', '⚠️ Selecciona exactamente 2 factores antes de comprobar.');
              _shakeCard(scr.querySelector('#gp-factors-grid'));
              return;
            }
            isCorrect = (selectedFactors[0].val * selectedFactors[1].val === ex.target);
            break;
          }
          case 'match_quotient':
          case 'balance':
          case 'master_choice': {
            if (selectedChoiceIdx === null) {
              playError();
              _setFeedback(scr, 'err', '⚠️ Selecciona una opción antes de comprobar.');
              _shakeCard(scr.querySelector('#gp-choice-grid'));
              return;
            }
            isCorrect = (selectedChoiceIdx === ex.correctIndex);
            break;
          }
          case 'slices': {
            if (activeSlices.size === 0) {
              playError();
              _setFeedback(scr, 'err', '⚠️ Toca las porciones de la pizza para pintar la fracción solicitada.');
              _shakeCard(scr.querySelector('#gp-pizza-container'));
              return;
            }
            isCorrect = (activeSlices.size === ex.targetNumerator);
            break;
          }
        }

        if (isCorrect) {
          // ─── CORRECTO ───────────────────────────────────────────────────
          _currentCombo++;
          playCorrect(_currentCombo);

          if (inp) inp.disabled = true;
          if (checkBtn) checkBtn.disabled = true;

          // ─── LÓGICA ANTI-FARMING DE MONEDAS ─────────────────────────────
          const save = _s();
          const lk = `l${lv}`;
          const prev = save.modules[mk].levels[lk];
          const isFirstClear = !prev?.cleared;

          // Solo otorga monedas si es la PRIMERA vez que se supera (calibrado)
          const coinsWon = isFirstClear ? (3 + (_currentCombo > 1 ? 2 : 0) + (isMaster ? 5 : 0)) : 0;

          if (isFirstClear) {
            _spawnFloatingDopamine(anchorEl, '+50 XP!', 'xp');
            setTimeout(() => _spawnFloatingDopamine(anchorEl, `+${coinsWon} 🪙`, 'coins'), 180);
          } else {
            _spawnFloatingDopamine(anchorEl, '¡Completado!', 'xp');
          }

          _setFeedback(scr, 'ok', `🎉 ¡CORRECTO! Excelente razonamiento.`);

          const stars = errors === 0 && usedHints === 0 ? 3 : errors <= 1 ? 2 : 1;
          const timeSec = Math.round((Date.now() - startMs) / 1000);

          const prevStars = prev?.stars || 0;
          if (!prev || stars > prevStars) {
            save.modules[mk].levels[lk] = { 
              cleared: true, 
              stars, 
              errors: prev ? Math.min(prev.errors, errors) : errors, 
              hints: usedHints, 
              time_sec: prev ? Math.min(prev.time_sec, timeSec) : timeSec 
            };
          }
          if (isFirstClear) {
            save.user.coins += coinsWon;
          }

          // Sincronización canónica automática de estrellas totales (acumula estrellas mejoradas)
          save.user.stars_total = _calcCanonicalTotalStars(save);

          _checkUnlockNextModule(save);
          _persist(save);
          _syncLobbyTasksBadge();

          // Actualizar monedas del HUD
          const hudCoins = $('#hud-coins-txt');
          if (hudCoins) hudCoins.textContent = save.user.coins;

          // Flujo de avance: al superar nivel 5, 10 o 15, "Siguiente" abre la Guía del nuevo bloque
          let onNextAction = null;
          if (lv === 5) {
            onNextAction = () => {
              const guide = getDidacticGuide(mk, 6);
              showDidacticGuideModal({
                mk,
                lv: 6,
                guide,
                onStart: () => transition('GAMEPLAY', { mk, lv: 6 }),
              });
            };
          } else if (lv === 10) {
            onNextAction = () => {
              const guide = getDidacticGuide(mk, 11);
              showDidacticGuideModal({
                mk,
                lv: 11,
                guide,
                onStart: () => transition('GAMEPLAY', { mk, lv: 11 }),
              });
            };
          } else if (lv === 15) {
            onNextAction = () => {
              const guide = getDidacticGuide(mk, 16);
              showDidacticGuideModal({
                mk,
                lv: 16,
                guide,
                onStart: () => transition('GAMEPLAY', { mk, lv: 16 }),
              });
            };
          } else if (lv < 20) {
            onNextAction = () => transition('GAMEPLAY', { mk, lv: lv + 1 });
          }

          setTimeout(() => {
            showVictoryModal({
              stars,
              coins: coinsWon,
              combo: _currentCombo,
              isMaster,
              onNext: onNextAction,
              onRetry: () => transition('GAMEPLAY', { mk, lv }),
              onMenu: () => transition(isMaster ? 'MODULE_SELECT' : 'LEVEL_BOARD', { mk }),
            });
          }, 800);
        } else {
          // ─── INCORRECTO ─────────────────────────────────────────────────
          errors++;
          _currentCombo = 0;
          playError();
          if (inp) _shakeInput(inp);
          _shakeCard(scr.querySelector('.gp-card-brawl'));

          if (heartsContainer) {
            const hearts = heartsContainer.querySelectorAll('.gp-heart');
            const targetIdx = 3 - errors;
            if (hearts[targetIdx]) {
              hearts[targetIdx].classList.add('gp-heart--broken');
              hearts[targetIdx].textContent = '🖤';
            }
          }

          if (inp) inp.value = '';

          if (errors < 3) {
            _setFeedback(scr, 'err', `🤔 ¡Casi! Revisa tu cálculo y prueba de nuevo.`);
            if (inp) setTimeout(() => inp?.focus(), 250);
          } else {
            _setFeedback(scr, 'err', `💔 Se acabaron los intentos para esta ronda.`);
            setTimeout(() => {
              showGameOverModal({
                onRetry: () => transition('GAMEPLAY', { mk, lv }),
                onGuide: () => {
                  const guide = getDidacticGuide(mk, lv);
                  showDidacticGuideModal({
                    mk,
                    lv,
                    guide,
                    onStart: () => transition('GAMEPLAY', { mk, lv }),
                  });
                },
                onMenu: () => transition('LEVEL_BOARD', { mk }),
              });
            }, 550);
          }
        }
      }));
      break;
    }

    /* ─── FREE MODE (SPEEDRUN CONTRARRELOJ PROGRESIVO) ────────────────────── */
    case 'FREE_MODE': {
      _bindFreeMode(scr, ctx);
      break;
    }

    /* ─── STORE (MINITIENDA DE AVENTURAS) ────────────────────────────────── */
    case 'STORE': {
      // Pestañas principales de categoría (Avatares vs Lemas)
      scr.querySelectorAll('.store-tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          playClick();
          _freeModeStoreCategory = btn.dataset.cat;
          _storeRarityFilter = 'basic'; // reset filtro al cambiar de pestaña
          transition('STORE');
        });
      });

      // Filtros por rareza (Todos, Comunes, Avanzados, Épicos, Míticos)
      scr.querySelectorAll('.store-filter-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          playClick();
          _storeRarityFilter = chip.dataset.rar;
          transition('STORE');
        });
      });

      // Comprar artículo
      scr.querySelectorAll('.store-btn-buy').forEach((btn) => {
        btn.addEventListener('click', () => {
          const itemId = btn.dataset.id;
          const item = STORE_ITEMS.find((it) => it.id === itemId);
          if (!item) return;

          const save = _s();
          if (save.user.coins < item.price) {
            playError();
            showToast('¡No tienes suficientes monedas! 🪙', 'err', '⚠️');
            return;
          }

          playBuy();
          playUnlock();
          save.user.coins -= item.price;

          if (item.type === 'avatar') {
            save.user.unlocked_avatars = save.user.unlocked_avatars || ['🧒', '👧'];
            if (!save.user.unlocked_avatars.includes(item.value)) {
              save.user.unlocked_avatars.push(item.value);
            }
            save.user.avatar = item.value; // Equipa automáticamente
          } else if (item.type === 'title') {
            save.user.unlocked_titles = save.user.unlocked_titles || ['Novato Matemático'];
            if (!save.user.unlocked_titles.includes(item.value)) {
              save.user.unlocked_titles.push(item.value);
            }
            save.user.title = item.value;
          }

          _persist(save);
          showToast(`¡${item.name} desbloqueado y equipado! 🎉`, 'ok', item.value);
          transition('STORE');
        });
      });

      // Equipar artículo ya comprado
      scr.querySelectorAll('.store-btn-equip').forEach((btn) => {
        btn.addEventListener('click', () => {
          playPop();
          const itemId = btn.dataset.id;
          const item = STORE_ITEMS.find((it) => it.id === itemId);
          if (!item) return;

          const save = _s();
          if (item.type === 'avatar') {
            save.user.avatar = item.value;
          } else if (item.type === 'title') {
            save.user.title = item.value;
          }

          _persist(save);
          showToast(`¡Equipaste: ${item.name}! ✨`, 'ok', item.value);
          transition('STORE');
        });
      });

      // Comprar Gemas con Monedas
      scr.querySelectorAll('.store-btn-buy-gems').forEach((btn) => {
        btn.addEventListener('click', () => {
          const gems = parseInt(btn.dataset.gems, 10);
          const cost = parseInt(btn.dataset.cost, 10);
          const save = _s();

          if (save.user.coins < cost) {
            playError();
            showToast('¡No tienes suficientes monedas para este paquete! 🪙', 'err', '⚠️');
            return;
          }

          playBuy();
          playCoin();
          save.user.coins -= cost;
          save.user.gems = (save.user.gems ?? 10) + gems;
          _persist(save);
          showToast(`¡Compraste +${gems} Gemas Mágicas! 💎`, 'ok', '💎');
          transition('STORE');
        });
      });

      // Abrir Ruleta Diaria / con Gemas
      scr.querySelectorAll('.store-btn-open-roulette').forEach((btn) => {
        btn.addEventListener('click', () => {
          playClick();
          const type = btn.dataset.type;
          const save = _s();
          showRouletteModal({
            type,
            save,
            onSpinSuccess: () => {
              save.user.total_spins = (save.user.total_spins || 0) + 1;
              _persist(save);
              transition('STORE');
            },
            onGoToGems: () => {
              _freeModeStoreCategory = 'gems';
              transition('STORE');
            },
          });
        });
      });

      // Reloj en tiempo real para las ruletas con cuenta regresiva en vivo
      if (_rouletteTicker) clearInterval(_rouletteTicker);
      _rouletteTicker = setInterval(() => {
        const currentSave = _s();
        const timerEls = scr.querySelectorAll('[data-roulette-timer]');
        if (timerEls.length === 0) {
          clearInterval(_rouletteTicker);
          _rouletteTicker = null;
          return;
        }
        timerEls.forEach((el) => {
          const rType = el.dataset.rouletteTimer;
          if (isFreeSpinAvailable(rType, currentSave)) {
            clearInterval(_rouletteTicker);
            _rouletteTicker = null;
            transition('STORE');
          } else {
            el.textContent = getTimeUntilNextFreeSpin(rType, currentSave);
          }
        });
      }, 1000);
      break;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLADOR DEL MODO LIBRE CONTRARRELOJ (PRE-SELECCIÓN Y JUEGO ADRENALINA)
// ═══════════════════════════════════════════════════════════════════════════════

function _bindFreeMode(scr, ctx = {}) {
  // ─── 1. PANTALLA DE PRE-SELECCIÓN DE TEMA ─────────────────────────────────
  if (!ctx.activePlaying) {
    _stopFreeModeTimer();

    // Seleccionar tarjeta ÚNICAMENTE al hacer clic / tocar (no por pasar el cursor por encima)
    const unlockedCards = scr.querySelectorAll('.free-select-card:not(.free-select-card--locked)');

    const selectTopic = (card) => {
      const topic = card.dataset.topic;
      if (_freeModeActiveTopic === topic) return;
      _freeModeActiveTopic = topic;
      unlockedCards.forEach((c) => c.classList.remove('free-select-card--active'));
      card.classList.add('free-select-card--active');
    };

    unlockedCards.forEach((card) => {
      // Clic / toque (PC y táctil)
      card.addEventListener('click', () => {
        playClick();
        selectTopic(card);
      });

      // Selección por teclado (Enter / Espacio)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playClick();
          selectTopic(card);
        }
      });
    });

    // Clic en tarjeta bloqueada
    scr.querySelectorAll('.free-select-card--locked').forEach((card) => {
      card.addEventListener('click', () => {
        playError();
        showToast('¡Desbloquea este módulo en el Modo Aventura primero! 🗺️🔒', 'err', '🔒');
      });
    });

    // Iniciar desafío (verificando si hay tema seleccionado y si está desbloqueado)
    scr.querySelector('#fm-btn-start-challenge')?.addEventListener('click', () => {
      if (!_freeModeActiveTopic) {
        playError();
        showToast('¡Selecciona primero un modo de juego para comenzar el desafío! 👆🎯', 'err', '🎯');
        return;
      }
      const save = _s();
      if (!save.modules[_freeModeActiveTopic]?.unlocked) {
        playError();
        showToast('¡Este módulo aún está bloqueado en el Modo Aventura! 🗺️🔒', 'err', '🔒');
        return;
      }
      playPop();
      showFreeModeBriefingModal({
        avatar: save.user.avatar || '🧒',
        onStart: () => {
          transition('FREE_MODE', { mk: _freeModeActiveTopic, activePlaying: true });
        },
      });
    });

    // Volver al menú
    scr.querySelector('#fm-btn-select-back')?.addEventListener('click', () => {
      playPop();
      transition('LOBBY');
    });

    return;
  }

  // ─── 2. PANTALLA DE JUEGO ACTIVO CONTRARRELOJ ─────────────────────────────
  const activeTopic = ctx.mk || _freeModeActiveTopic;
  let streak = 0;
  let maxStreakThisSession = 0;
  let score = 0;
  let solvedCount = 0;
  let coinsFarmed = 0;
  let currentTargetTime = _getFreeModeTargetTime(activeTopic, solvedCount);
  let remainingSec = currentTargetTime;
  let currentAnswer = 0;

  const playCard = scr.querySelector('#fm-card');
  const timerFill = scr.querySelector('#fm-timer-fill');
  const timerText = scr.querySelector('#fm-timer-text');
  const scoreTxt = scr.querySelector('#fm-score-txt');
  const comboTxt = scr.querySelector('#fm-combo-txt');
  const coinsFarmedTxt = scr.querySelector('#fm-coins-farmed-txt');
  const eqDisplay = scr.querySelector('#fm-equation-display');
  const ctxDisplay = scr.querySelector('#fm-context-txt');
  const optionsGrid = scr.querySelector('#fm-options-grid');
  const powerBar = scr.querySelector('#fm-avatar-power-bar');
  let isResolving = false;

  // ─── Habilidades y Poderes del Avatar Activo (Común, Avanzado, Épico, Mítico) ───
  const save = _s();
  const equippedAvatar = save.user.avatar || '🧒';
  const avatarRarity = getAvatarRarity(equippedAvatar); // 'basic', 'common', 'advanced', 'epic', 'mythic'

  let maxAutoSolve = 0;
  let maxDiscard = 0;
  if (avatarRarity === 'mythic') {
    maxAutoSolve = 5;
    maxDiscard = 1;
  } else if (avatarRarity === 'epic') {
    maxAutoSolve = 5;
    maxDiscard = 0;
  } else if (avatarRarity === 'advanced') {
    maxAutoSolve = 1;
    maxDiscard = 0;
  }

  let autoSolveRemaining = maxAutoSolve;
  let discardRemaining = maxDiscard;
  let isDiscardActive = false;

  function getEffectiveNumOptions(currSolved) {
    if (!isDiscardActive) {
      return _getFreeModeNumOptions(currSolved);
    }
    // Si el poder de descarte mítico está activo:
    // 0-2 resueltos: 3 opciones
    // 3-5 resueltos: 2 opciones (4 - 2)
    // 6-8 resueltos: 3 opciones (5 - 2)
    // 9+ resueltos: 4 opciones (6 - 2)
    if (currSolved < 3) return 3;
    if (currSolved < 6) return 2;
    if (currSolved < 9) return 3;
    return 4;
  }

  function renderPowerBar() {
    if (!powerBar) return;
    const curOpts = getEffectiveNumOptions(solvedCount);
    const hasAura = avatarRarity !== 'basic';

    const avBorder = 'avatar-emoji-bordered';
    const avatarIconHtml = hasAura
      ? `
        <div class="avatar-aura-wrap avatar-aura--${avatarRarity}" style="transform:scale(0.8);margin-left:-1px;margin-right:4px">
          <span class="aura-spark"></span>
          <span class="aura-spark"></span>
          <span class="aura-spark"></span>
          <span class="aura-spark"></span>
          <span class="aura-spark"></span>
          <span class="aura-front-sheen"></span>
          <span class="${avBorder}" data-avatar="${equippedAvatar}" style="font-size:22px;line-height:1">${equippedAvatar}</span>
        </div>
      `
      : `
        <div class="${avBorder}" data-avatar="${equippedAvatar}" style="font-size:22px;line-height:1;margin-left:-1px;margin-right:4px">${equippedAvatar}</div>
      `;

    if (maxAutoSolve === 0 && maxDiscard === 0) {
      const rarityLabel = avatarRarity === 'basic' ? 'Básico · Sin habilidades' : 'Común · Sin habilidades';
      powerBar.innerHTML = `
        <div class="fm-power-bar-inner fm-power-bar-inner--none">
          <div class="fm-power-avatar-tag">
            ${avatarIconHtml}
            <div class="fm-power-info-meta">
              <span class="fm-power-meta-title">Poder de Avatar</span>
              <span class="fm-power-meta-rarity">${rarityLabel}</span>
            </div>
          </div>
          <span class="fm-power-hint-text">Equipa un avatar Avanzado, Épico o Mítico en la Tienda</span>
        </div>
      `;
      return;
    }

    const canUseSolve = autoSolveRemaining > 0 && !isResolving && remainingSec > 0;
    const canUseDiscard = discardRemaining > 0 && !isDiscardActive && curOpts >= 4 && !isResolving && remainingSec > 0;

    let solveBtnHtml = '';
    if (maxAutoSolve > 0) {
      solveBtnHtml = `
        <button class="btn fm-power-btn fm-power-btn--solve" id="fm-btn-power-solve" ${canUseSolve ? '' : 'disabled'} title="Resuelve al instante el ejercicio actual (Quedan ${autoSolveRemaining}/${maxAutoSolve})">
          <span class="fm-power-btn-icon">⚡</span>
          <span class="fm-power-btn-text">Auto-Acierto</span>
          <span class="fm-power-badge ${autoSolveRemaining === 0 ? 'fm-power-badge--empty' : ''}">${autoSolveRemaining}/${maxAutoSolve}</span>
        </button>
      `;
    }

    let discardBtnHtml = '';
    if (maxDiscard > 0) {
      let discardTitle = 'Elimina 2 opciones incorrectas durante la partida';
      let discardBadgeTxt = `${discardRemaining}/${maxDiscard}`;
      if (isDiscardActive) {
        discardTitle = '¡Descarte Mítico activo! (-2 opciones en juego)';
        discardBadgeTxt = 'Activo';
      } else if (curOpts < 4) {
        discardTitle = 'Se activa a partir de 4 opciones en pantalla (3+ resueltos)';
      }

      discardBtnHtml = `
        <button class="btn fm-power-btn fm-power-btn--discard" id="fm-btn-power-discard" ${canUseDiscard ? '' : 'disabled'} title="${discardTitle}">
          <span class="fm-power-btn-icon">🔮</span>
          <span class="fm-power-btn-text">Descarte Mítico</span>
          <span class="fm-power-badge ${discardRemaining === 0 || isDiscardActive ? 'fm-power-badge--empty' : ''}">${discardBadgeTxt}</span>
        </button>
      `;
    }

    powerBar.innerHTML = `
      <div class="fm-power-bar-inner">
        <div class="fm-power-avatar-tag">
          ${avatarIconHtml}
          <div class="fm-power-info-meta">
            <span class="fm-power-meta-title">Poder de Avatar</span>
            <span class="fm-power-meta-rarity">${RARITIES[avatarRarity]?.name || 'Héroe'}</span>
          </div>
        </div>
        <div class="fm-power-buttons-row">
          ${solveBtnHtml}
          ${discardBtnHtml}
        </div>
      </div>
    `;

    powerBar.querySelector('#fm-btn-power-solve')?.addEventListener('click', (e) => {
      e.preventDefault();
      useAutoSolve();
    });

    powerBar.querySelector('#fm-btn-power-discard')?.addEventListener('click', (e) => {
      e.preventDefault();
      useMythicDiscard();
    });
  }

  function useAutoSolve() {
    if (autoSolveRemaining <= 0 || isResolving || remainingSec <= 0) return;
    autoSolveRemaining--;
    renderPowerBar();

    playUnlock();
    const correctBtn = optionsGrid?.querySelector(`.fm-choice-tile[data-val="${currentAnswer}"]`);
    _spawnFloatingDopamine(correctBtn || playCard, '⚡ ¡AUTO-ACIERTO!', 'xp');
    handleChoice(currentAnswer, correctBtn);
  }

  function useMythicDiscard() {
    const curOpts = getEffectiveNumOptions(solvedCount);
    if (discardRemaining <= 0 || isDiscardActive || isResolving || remainingSec <= 0 || curOpts < 4) return;
    discardRemaining--;
    isDiscardActive = true;

    playUnlock();
    _spawnFloatingDopamine(playCard, '🔮 ¡DESCARTE MÍTICO (-2)!', 'coins');

    // Descartar de inmediato 2 opciones incorrectas en la tarjeta visible
    const allBtns = Array.from(optionsGrid?.querySelectorAll('.fm-choice-tile') || []);
    const wrongBtns = allBtns.filter((b) => Number(b.dataset.val) !== currentAnswer && !b.classList.contains('fm-choice-tile--discarded'));
    const toDiscard = wrongBtns.slice(0, 2);
    toDiscard.forEach((b) => {
      b.classList.add('fm-choice-tile--discarded');
      b.disabled = true;
    });

    renderPowerBar();
  }

  // Botón Cambiar Tema durante juego
  scr.querySelector('#fm-btn-change-topic')?.addEventListener('click', () => {
    playPop();
    _stopFreeModeTimer();
    _freeModeActiveTopic = null;
    transition('FREE_MODE', { activePlaying: false });
  });

  function spawnQuestion() {
    isResolving = false;
    const ex = _genRandomFreeExercise(activeTopic, solvedCount);
    currentAnswer = ex.answer;
    if (eqDisplay) eqDisplay.textContent = ex.display;
    if (ctxDisplay) ctxDisplay.textContent = ex.context;

    const numOptions = getEffectiveNumOptions(solvedCount);
    const choices = _genFreeModeChoices(currentAnswer, numOptions);

    if (optionsGrid) {
      optionsGrid.innerHTML = choices.map((val, idx) => `
        <button class="fm-choice-tile" data-val="${val}" data-idx="${idx}" title="Opción ${val}">
          <span class="fm-choice-tile-val">${val}</span>
        </button>
      `).join('');

      optionsGrid.querySelectorAll('.fm-choice-tile').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          handleChoice(Number(btn.dataset.val), btn);
        });
      });
    }

    renderPowerBar();
  }

  // Verificación táctil instantánea ("Toca y juega")
  function handleChoice(val, btn) {
    if (isResolving) return;
    if (remainingSec <= 0) return;

    if (val === currentAnswer) {
      isResolving = true;
      btn?.classList.add('fm-choice-tile--correct');

      // ─── ¡ACIERTO EN MODO LIBRE! ──────────────────────────────────
      streak++;
      maxStreakThisSession = Math.max(maxStreakThisSession, streak);
      solvedCount++;
      const ptsWon = 20 + Math.min(60, streak * 4);
      score += ptsWon;

      // RECOMPENSA DEL USUARIO:
      // Exactamente 1 moneda por cada ejercicio resuelto (15 aciertos = 15 monedas)
      coinsFarmed = solvedCount;
      const coinsGained = 1;

      // REGLA DEL USUARIO: Dificultad escalonada cada 4 ejercicios, mínimo 5 segundos
      currentTargetTime = _getFreeModeTargetTime(activeTopic, solvedCount);
      remainingSec = currentTargetTime;

      // Acelerar la música con adrenalina progresiva
      setBgmSpeed(Math.min(1.8, 1.0 + Math.min(streak, solvedCount) * 0.04));

      playCorrect(streak);
      playCoin();

      const anchorEl = btn || playCard;
      _spawnFloatingDopamine(anchorEl, `+${ptsWon} PTS!`, 'xp');
      setTimeout(() => _spawnFloatingDopamine(anchorEl, '+1 🪙', 'coins'), 140);

      if (scoreTxt) scoreTxt.textContent = score;
      if (comboTxt) comboTxt.textContent = `x${streak}`;
      if (coinsFarmedTxt) coinsFarmedTxt.textContent = `+${coinsFarmed}`;

      // Transición ultra fluida al siguiente reto (130ms para saborear el acierto visual)
      setTimeout(() => {
        spawnQuestion();
      }, 130);
    } else {
      // ─── ERROR EN MODO LIBRE (Penalización y reset de racha de combo) ────────
      btn?.classList.add('fm-choice-tile--wrong');
      setTimeout(() => btn?.classList.remove('fm-choice-tile--wrong'), 300);

      streak = 0;
      setBgmSpeed(1.0); // Restablece tempo
      remainingSec = Math.max(0, remainingSec - 2.0);
      playError();
      _shakeCard(playCard);

      if (comboTxt) comboTxt.textContent = `x0`;
      _setFeedback(scr, 'err', `¡Incorrecto! -2.0s ⏱️`);
      renderPowerBar();
    }
  }

  spawnQuestion();

  // Acceso rápido por teclado en PC (teclas 1 a 6 y atajos de poder)
  _freeModeKeyHandler = (e) => {
    const num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= 6) {
      const btn = optionsGrid?.querySelector(`.fm-choice-tile[data-idx="${num - 1}"]`);
      if (btn && !btn.disabled) btn.click();
    } else if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
      const solveBtn = powerBar?.querySelector('#fm-btn-power-solve:not(:disabled)');
      if (solveBtn) solveBtn.click();
    } else if (e.key === 'd' || e.key === 'D') {
      const discardBtn = powerBar?.querySelector('#fm-btn-power-discard:not(:disabled)');
      if (discardBtn) discardBtn.click();
    }
  };
  window.addEventListener('keydown', _freeModeKeyHandler);

  // Bucle del temporizador (cada 100ms)
  _freeModeTimerInterval = setInterval(() => {
    remainingSec -= 0.1;

    if (remainingSec <= 0) {
      remainingSec = 0;
      _stopFreeModeTimer();
      _finishFreeModeSession({ score, streak: maxStreakThisSession, coinsFarmed, activeTopic, solvedCount });
      return;
    }

    const pct = Math.max(0, Math.min(100, (remainingSec / currentTargetTime) * 100));
    if (timerFill) {
      timerFill.style.width = `${pct}%`;
      if (remainingSec <= 3.2) {
        timerFill.classList.add('timer-bar-fill--urgent');
        playCard?.classList.add('danger-time-pulse');
        if (Math.abs(remainingSec % 1) < 0.12) {
          playTick(true);
        }
      } else {
        timerFill.classList.remove('timer-bar-fill--urgent');
        playCard?.classList.remove('danger-time-pulse');
      }
    }
    if (timerText) {
      timerText.textContent = `⏱️ ${remainingSec.toFixed(1)}s`;
    }
  }, 100);
}

function _stopFreeModeTimer() {
  if (_freeModeTimerInterval) {
    clearInterval(_freeModeTimerInterval);
    _freeModeTimerInterval = null;
  }
  if (_freeModeKeyHandler) {
    window.removeEventListener('keydown', _freeModeKeyHandler);
    _freeModeKeyHandler = null;
  }
  setBgmSpeed(1.0); // Resetear tempo
}

function _finishFreeModeSession({ score, streak, coinsFarmed, activeTopic, solvedCount = 0 }) {
  playVictory();

  const save = _s();
  save.user.coins += coinsFarmed;
  save.user.highscores = save.user.highscores || {};
  save.user.best_streaks = save.user.best_streaks || {};
  save.user.best_streaks[activeTopic] = Math.max(save.user.best_streaks[activeTopic] || 0, streak);
  const prevHigh = save.user.highscores[activeTopic] || 0;
  const isNewRecord = score > prevHigh;

  if (isNewRecord) {
    save.user.highscores[activeTopic] = score;
  }
  _persist(save);
  _syncLobbyTasksBadge();

  const hudCoins = document.getElementById('hud-coins-txt');
  if (hudCoins) {
    hudCoins.textContent = String(save.user.coins);
  }

  const overlay = document.createElement('div');
  overlay.className = 'modal-backdrop';
  overlay.innerHTML = `
    <div class="modal-box" style="max-width:440px;text-align:center" role="dialog" aria-modal="true">
      <div class="modal-ribbon modal-ribbon--master">
        <span>⏱️ ¡TIEMPO AGOTADO!</span>
      </div>

      <div class="modal-scroll-body" style="align-items:center">
        <div style="font-size:clamp(40px,6vw,60px);margin:.8rem 0 .2rem">
          ${isNewRecord ? '🏆' : '⚡'}
        </div>

        <h3 style="font-size:clamp(16px,2.4vw,22px);font-weight:900;color:#0F172A">
          ${isNewRecord ? '¡NUEVO RÉCORD PERSONAL!' : '¡Buen Intento, Corredor!'}
        </h3>

        <div style="display:flex;justify-content:center;gap:.6rem;margin:.6rem 0;flex-wrap:wrap">
          <div class="reward-pill" style="background:#FFF9C4;border-color:#F59E0B">
            <span>Puntuación:</span>
            <strong style="font-size:18px;color:#B45309">${score}</strong>
          </div>
          <div class="reward-pill" style="background:#DCFCE7;border-color:#16A34A">
            <span>Monedas:</span>
            <strong style="font-size:18px;color:#15803D">+${coinsFarmed} 🪙</strong>
          </div>
          <div class="reward-pill" style="background:#E0F2FE;border-color:#0284C7">
            <span>Ejercicios:</span>
            <strong style="font-size:18px;color:#0369A1">${solvedCount} ✅</strong>
          </div>
        </div>

        <div style="font-size:12px;font-weight:700;color:#64748B;margin-bottom:.8rem">
          Racha máxima lograda: <strong>x${streak}</strong>
        </div>

        <div class="modal-actions modal-actions--stacked" style="width:100%">
          <button class="btn btn-green btn-lg" id="fm-modal-retry">
            ⚡ Jugar de Nuevo
          </button>
          <button class="btn btn-blue btn-md" id="fm-modal-menu">
            🏠 Menú Principal
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#fm-modal-retry')?.addEventListener('click', () => {
    playPop();
    overlay.remove();
    transition('FREE_MODE', { mk: activeTopic, activePlaying: true });
  });

  overlay.querySelector('#fm-modal-menu')?.addEventListener('click', () => {
    playPop();
    overlay.remove();
    transition('LOBBY');
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIÁLOGOS Y HELPERS VISUALES
// ═══════════════════════════════════════════════════════════════════════════════

function _openProfileDialog() {
  playPop();
  showProfileModal({
    user: _s().user,
    modules: _s().modules,
    save: _s(),
    onSaveAlias: (alias, avatar) => {
      const save = _s();
      save.user.alias = alias;
      save.user.avatar = avatar;
      _persist(save);
      transition('LOBBY');
    },
    onOpenCloud: () => {
      _openCloudDialog();
    },
    onLogoutAccount: async () => {
      const save = _s();
      if (save.user?.student_id) {
        try {
          await saveProgressToCloud(save);
        } catch (_) {}
      }
      await logoutStudent();
      const fresh = resetSave();
      fresh.diagnostics.pretest_score = null;
      _persist(fresh, true);
      transition('WELCOME');
    },
  });
}

function _openCloudDialog() {
  playPop();
  showCloudModal({
    save: _s(),
    getSave: () => _s(),
    onSaveUpdate: (updatedSave) => {
      _persist(updatedSave, Boolean(updatedSave.user?.cloud_synced));
      transition(getCurrentState() || 'LOBBY');
    },
    onLogout: async () => {
      const save = _s();
      if (save.user?.student_id) {
        try {
          await saveProgressToCloud(save);
        } catch (_) {}
      }
      await logoutStudent();
      const fresh = resetSave();
      fresh.diagnostics.pretest_score = null;
      _persist(fresh, true);
      transition('WELCOME');
    },
  });
}

/**
 * Sincroniza en tiempo real el badge del botón de Tareas en el lobby y el saldo de monedas.
 */
function _syncLobbyTasksBadge() {
  const btn = document.getElementById('lobby-btn-tasks');
  if (!btn) return;
  const save = _s();
  const count = getClaimableTasksCount(save);
  let badge = btn.querySelector('.task-notif-badge');
  if (count > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'task-notif-badge';
      badge.id = 'lobby-tasks-badge';
      btn.appendChild(badge);
    }
    badge.textContent = String(count);
    badge.style.display = 'inline-flex';
    badge.classList.remove('badge-pop-update');
    void badge.offsetWidth;
    badge.classList.add('badge-pop-update');
  } else {
    if (badge) {
      badge.remove();
    }
  }
}

function _openTasksDialog() {
  playPop();
  showTasksModal({
    save: _s(),
    getSave: () => _s(),
    onClaimTask: (task) => {
      const save = _s();
      save.user.coins = (save.user.coins || 0) + task.rewardCoins;
      save.user.claimed_tasks = save.user.claimed_tasks || [];
      if (!save.user.claimed_tasks.includes(task.id)) {
        save.user.claimed_tasks.push(task.id);
      }
      save.user.achievements = save.user.achievements || [];
      if (task.trophyId && !save.user.achievements.includes(task.trophyId)) {
        save.user.achievements.push(task.trophyId);
      }
      _persist(save);

      // Sincronizar en tiempo real el badge del botón de tareas en el lobby
      _syncLobbyTasksBadge();

      // Sincronizar en tiempo real las monedas en el HUD superior
      const hudCoins = document.getElementById('hud-coins-txt');
      if (hudCoins) {
        hudCoins.textContent = String(save.user.coins);
      }

      return save;
    },
    onClose: () => {
      // Sincronizar inmediatamente al cerrar la ventana
      _syncLobbyTasksBadge();
      const hudCoins = document.getElementById('hud-coins-txt');
      if (hudCoins) {
        hudCoins.textContent = String(_s().user.coins);
      }
    },
  });
}

function _openSettingsDialog() {
  playClick();
  showSettingsModal({
    sfxOn: isSfxEnabled(),
    musicOn: isMusicEnabled(),
    onToggleSfx: () => {
      const n = !isSfxEnabled();
      setSfxEnabled(n);
      const save = _s();
      save.user.sfx_enabled = n;
      _persist(save);
      _syncHudAudioButtons();
      return n;
    },
    onToggleMusic: () => {
      const n = !isMusicEnabled();
      setMusicEnabled(n);
      if (n) startBGM();
      const save = _s();
      save.user.music_enabled = n;
      _persist(save);
      _syncHudAudioButtons();
      return n;
    },
    onReset: () => {
      localStorage.removeItem('eduaventura_g4_save');
      location.reload();
    },
  });
}

function _spawnFloatingDopamine(targetEl, text, type) {
  if (!targetEl) return;
  const rect = targetEl.getBoundingClientRect();
  const floatEl = document.createElement('div');
  floatEl.className = `floating-dopamine floating-dopamine--${type}`;
  floatEl.textContent = text;
  floatEl.style.left = `${rect.left + rect.width / 2}px`;
  floatEl.style.top = `${rect.top - 10}px`;
  document.body.appendChild(floatEl);
  setTimeout(() => floatEl.remove(), 1100);
}

function _shakeInput(el) {
  if (!el) return;
  el.style.transform = 'translateX(6px)';
  setTimeout(() => (el.style.transform = 'translateX(-6px)'), 60);
  setTimeout(() => (el.style.transform = 'translateX(4px)'), 120);
  setTimeout(() => (el.style.transform = 'translateX(0)'), 180);
}

function _shakeCard(card) {
  if (!card) return;
  card.classList.add('screen-shake');
  setTimeout(() => card.classList.remove('screen-shake'), 260);
}

function _setFeedback(scr, type, msg) {
  const c = scr.querySelector('#gp-feedback-container') || scr.querySelector('#fm-feedback-box');
  if (!c) return;
  const col = type === 'ok' ? '#2ECC71' : type === 'err' ? '#E74C3C' : '#F39C12';
  c.innerHTML = `
    <div style="font-size:clamp(11px,1.4vw,15px);font-weight:900;color:${col};animation:brawlPopIn .2s ease;text-align:center;width:100%;margin:0 auto">
      ${msg}
    </div>
  `;
}

function _checkUnlockNextModule(save) {
  const order = Object.keys(MODS);
  for (let i = 0; i < order.length - 1; i++) {
    const curr = save.modules[order[i]];
    const next = save.modules[order[i + 1]];
    if (!next.unlocked) {
      const lvls = Object.values(curr.levels || {});
      const clearedCount = lvls.filter((l) => l.cleared && l.stars >= 1).length;
      if (clearedCount >= 20) {
        next.unlocked = true;
        playUnlock();
        showToast(`🎉 ¡Desbloqueaste el Módulo ${i + 2}!`, 'ok', '🔓');
      }
    }
  }
}

function _esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _s() {
  return getSaveData() || loadSave();
}

function _syncHudCloudDot() {
  const btn = document.getElementById('hud-btn-cloud');
  if (!btn) return;
  const save = _s();
  const existingDot = btn.querySelector('.hud-cloud-dot');
  const hasUnsavedChanges = Boolean(save.user?.student_id && !save.user?.cloud_synced);
  if (hasUnsavedChanges) {
    if (!existingDot) {
      const dot = document.createElement('span');
      dot.className = 'hud-cloud-dot';
      btn.appendChild(dot);
    }
  } else {
    if (existingDot) {
      existingDot.remove();
    }
  }
}

function _persist(d, markSynced = false) {
  if (d?.user?.student_id) {
    if (markSynced) {
      d.user.cloud_synced = true;
    } else {
      d.user.cloud_synced = false;
    }
  }
  setSaveData(d);
  saveSave(d);
  _syncHudCloudDot();
}

// ─── Control de Orientación para Móviles ─────────────────────────────────────
function initOrientationWatcher() {
  const check = () => {
    const isPortrait = window.innerHeight > window.innerWidth && window.innerWidth <= 860;
    const rotateScreen = document.getElementById('rotate-screen');
    if (isPortrait) {
      document.documentElement.classList.add('is-portrait');
      document.documentElement.classList.remove('is-landscape');
      if (rotateScreen) rotateScreen.style.display = 'flex';
    } else {
      document.documentElement.classList.remove('is-portrait');
      document.documentElement.classList.add('is-landscape');
      if (rotateScreen) rotateScreen.style.display = 'none';
    }
  };

  window.addEventListener('resize', check, { passive: true });
  window.addEventListener('orientationchange', check, { passive: true });
  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', check);
  }
  check();
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
async function bootstrap() {
  checkOrient();
  _updateFullscreenButtons();

  let save;
  try {
    save = loadSave();
  } catch (err) {
    console.warn('[Bootstrap] Error al cargar guardado, usando fallback.', err);
    save = {};
  }

  // Auto-recuperación y sincronización de estrellas totales acumuladas
  try {
    if (save?.user) {
      save.user.stars_total = _calcCanonicalTotalStars(save);
      _persist(save);
    }
  } catch (_) {}

  // Restaurar preferencias guardadas de SFX y Música
  const sfxSaved = save?.user?.sfx_enabled !== false;
  const musicSaved = save?.user?.music_enabled !== false;
  setSfxEnabled(sfxSaved);
  setMusicEnabled(musicSaved);

  // Intentar arranque directo de música/audio sin requerir toque manual
  if (musicSaved) {
    try {
      startBGM();
    } catch (_) {}
  }

  // Desbloqueo garantizado con cualquier primera interacción si el navegador suspendió el AudioContext por autoplay policy
  const onFirstInteraction = () => {
    if (isMusicEnabled()) {
      startBGM();
    }
    ['pointerdown', 'keydown', 'touchstart', 'click'].forEach((evt) => {
      window.removeEventListener(evt, onFirstInteraction);
    });
  };
  ['pointerdown', 'keydown', 'touchstart', 'click'].forEach((evt) => {
    window.addEventListener(evt, onFirstInteraction, { once: true, passive: true });
  });

  // Temporizador de carga visual suave
  await new Promise((r) => setTimeout(r, 950));

  const splash = document.getElementById('screen-splash');
  if (splash) {
    splash.style.transition = 'opacity .24s ease';
    splash.style.opacity = '0';
    splash.style.pointerEvents = 'none';
    setTimeout(() => {
      if (splash.parentNode) splash.style.display = 'none';
    }, 250);
  }

  try {
    initState(save);
  } catch (err) {
    console.error('[Bootstrap InitState Error]', err);
    try {
      initState(loadSave());
    } catch (_) {}
  }
}

// Fallback universal a prueba de fallos: retirar pantalla de carga en máximo 2.2s
setTimeout(() => {
  const splash = document.getElementById('screen-splash');
  if (splash && splash.style.display !== 'none') {
    splash.style.transition = 'opacity .24s ease';
    splash.style.opacity = '0';
    splash.style.pointerEvents = 'none';
    setTimeout(() => {
      if (splash.parentNode) splash.style.display = 'none';
    }, 250);
  }
}, 2200);

// Arranque seguro cuando el DOM esté completamente listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch((err) => console.error('[Bootstrap Error]', err));
  }, { once: true });
} else {
  bootstrap().catch((err) => console.error('[Bootstrap Error]', err));
}


