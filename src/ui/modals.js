/**
 * @file modals.js — Sistema de Ventanas Emergentes Reales y Modales Gamificados v3.0
 * EduAventura G4 · Estilo Duolingo × Brawl Stars · CERO alertas del navegador
 * Cero recortes de cintas/ribbons superiores y scroll interno seguro
 */

'use strict';

import { playPop, playClick, playWhoosh, playStar, playCoin, playVictory, playGuide, playUnlock } from '../core/audio.js';
import { getAvatarRarity } from '../data/store_items.js';
import { TROPHIES, TASKS, TASK_CLASSES, getOrganizedTasks, getClaimableTasksCount } from '../data/tasks_data.js';
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  getCurrentStudent,
  saveProgressToCloud,
  fetchProgressFromCloud,
  updateStudentNickname,
  smartMergeSave,
  cleanStudentId,
  formatAuthError,
} from '../core/firebase.js';

// ─── Utilidad Base para Modales y Barra de Desplazamiento Persistente ─────────

/**
 * Conecta una barra de desplazamiento estática y persistente en el lateral derecho
 * de cualquier modal con .modal-scroll-body. Garantiza que en teléfonos y escritorios
 * nunca se oculte si el contenido desborda, y mantiene un margen visual limpio con el contenido.
 */
export function attachPersistentScrollbar(modalBox) {
  if (!modalBox) return;
  const scrollEl = modalBox.querySelector('.modal-scroll-body');
  if (!scrollEl) return;

  // Evitar duplicar pista
  let track = modalBox.querySelector(':scope > .modal-scrollbar-track');
  if (!track) {
    track = document.createElement('div');
    track.className = 'modal-scrollbar-track';
    track.setAttribute('aria-hidden', 'true');
    track.innerHTML = '<div class="modal-scrollbar-thumb"></div>';
    modalBox.appendChild(track);
  }

  const thumb = track.querySelector('.modal-scrollbar-thumb');
  if (!thumb) return;

  let rafId = null;
  const update = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      if (scrollHeight <= clientHeight + 4) {
        track.style.display = 'none';
        return;
      }
      track.style.display = 'block';
      const trackHeight = track.clientHeight || (modalBox.clientHeight - 46);
      if (trackHeight <= 0) return;
      const thumbHeight = Math.max(26, Math.round((clientHeight / scrollHeight) * trackHeight));
      thumb.style.height = `${thumbHeight}px`;
      const maxScroll = scrollHeight - clientHeight;
      const maxThumbTop = trackHeight - thumbHeight;
      const thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0;
      thumb.style.transform = `translateY(${thumbTop}px)`;
    });
  };

  scrollEl.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });

  // Disparar sincronizaciones para contenido diferido
  update();
  setTimeout(update, 50);
  setTimeout(update, 150);
  setTimeout(update, 400);

  // Arrastre directo del thumb en pantallas táctiles o con ratón
  let isDragging = false;
  let startY = 0;
  let startScrollTop = 0;

  thumb.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = scrollEl.scrollTop;
    thumb.setPointerCapture(e.pointerId);
    thumb.classList.add('modal-scrollbar-thumb--active');
    e.preventDefault();
  });

  thumb.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const trackHeight = track.clientHeight;
    const thumbHeight = thumb.clientHeight;
    const maxThumbTop = trackHeight - thumbHeight;
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (maxThumbTop > 0) {
      scrollEl.scrollTop = startScrollTop + (deltaY / maxThumbTop) * maxScroll;
    }
  });

  const onPointerEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    thumb.classList.remove('modal-scrollbar-thumb--active');
    try { thumb.releasePointerCapture(e.pointerId); } catch (_) {}
  };

  thumb.addEventListener('pointerup', onPointerEnd);
  thumb.addEventListener('pointercancel', onPointerEnd);

  // Clic en la pista para saltar directamente a la posición
  track.addEventListener('click', (e) => {
    if (e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = track.clientHeight;
    const ratio = Math.max(0, Math.min(1, clickY / trackHeight));
    scrollEl.scrollTop = ratio * (scrollEl.scrollHeight - scrollEl.clientHeight);
  });
}

function _createOverlay(extraClass = '') {
  playWhoosh();
  const overlay = document.createElement('div');
  overlay.className = `modal-backdrop ${extraClass}`.trim();
  overlay.tabIndex = -1;

  const onKey = (e) => {
    if (e.key === 'Escape') {
      overlay.querySelector('.btn-close-modal')?.click();
    }
  };
  document.addEventListener('keydown', onKey);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.querySelector('.btn-close-modal')?.click();
    }
  });

  // Observador automático para vincular la barra de desplazamiento persistente a cualquier .modal-box
  const observer = new MutationObserver(() => {
    const box = overlay.querySelector('.modal-box');
    if (box) {
      attachPersistentScrollbar(box);
    }
  });
  observer.observe(overlay, { childList: true, subtree: true });

  overlay._cleanup = () => {
    observer.disconnect();
    document.removeEventListener('keydown', onKey);
    overlay.classList.add('modal-backdrop--out');
    setTimeout(() => overlay.remove(), 200);
  };

  return overlay;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. MODAL GUÍA DIDÁCTICA INTERACTIVA (Previa al Nivel)
// ═══════════════════════════════════════════════════════════════════════════════

export function showDidacticGuideModal({ mk, lv, guide, onStart, showBack = false, onBack = null }) {
  playGuide();
  const overlay = _createOverlay('modal-backdrop--guide');

  const stepsHtml = guide.steps.map((s) => `
    <div class="dg-step-item">
      <div class="dg-step-badge">${s.num}</div>
      <div class="dg-step-content">${s.text}</div>
    </div>
  `).join('');

  overlay.innerHTML = `
    <div class="modal-box modal-box--guide" role="dialog" aria-modal="true" aria-labelledby="dg-title">
      ${showBack ? `
        <button class="modal-close-corner" id="dg-btn-close-corner" title="Volver al Tablero">✖</button>
      ` : ''}

      <div class="modal-ribbon modal-ribbon--guide">
        <span>${guide.badge}</span>
      </div>

      <div class="modal-scroll-body">
        <div class="dg-header">
          <div class="dg-mascot-circle">${guide.mascot}</div>
          <div class="dg-header-text">
            <h2 id="dg-title" class="dg-title">${guide.title}</h2>
            <div class="dg-speech-bubble">
              ${guide.mascotMsg}
            </div>
          </div>
        </div>

        <div class="dg-steps-list">${stepsHtml}</div>
        <div class="dg-visual-showcase">${guide.visualHtml}</div>

        <div class="dg-trick-card">
          <div class="dg-trick-icon">💡</div>
          <div class="dg-trick-text">
            <strong>¡Truco Ninja!</strong> ${guide.trick}
          </div>
        </div>

        <div class="modal-actions ${showBack ? 'modal-actions--stacked' : ''}" style="width:100%">
          <button class="btn btn-green btn-lg" id="dg-btn-start" style="width:100%">
            🚀 ¡ENTENDIDO, A JUGAR!
          </button>
          ${showBack ? `
            <button class="btn btn-blue btn-md" id="dg-btn-back" style="width:100%">
              ◀ Volver al Tablero
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const startBtn = overlay.querySelector('#dg-btn-start');
  startBtn?.focus();

  startBtn?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onStart) onStart();
  });

  if (showBack) {
    const handleClose = () => {
      playPop();
      overlay._cleanup();
      if (onBack) onBack();
    };
    overlay.querySelector('#dg-btn-back')?.addEventListener('click', handleClose);
    overlay.querySelector('#dg-btn-close-corner')?.addEventListener('click', handleClose);
  }

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MODAL DE VICTORIA Y RECOMPENSAS (Estilo Brawl Stars / Duolingo)
// ═══════════════════════════════════════════════════════════════════════════════

export function showVictoryModal({ stars = 3, coins = 15, combo = 1, isMaster = false, onNext, onRetry, onMenu }) {
  playVictory();
  const overlay = _createOverlay('modal-backdrop--victory');

  const titles = ['¡BUEN INTENTO!', '¡MUY BIEN!', '¡VICTORIA ÉPICA!'];
  const title = isMaster ? '👑 ¡DESAFÍO MAESTRO SUPERADO! 👑' : titles[stars - 1] || '¡NIVEL SUPERADO!';

  overlay.innerHTML = `
    <div class="modal-box modal-box--victory" role="dialog" aria-modal="true">
      <div class="modal-ribbon ${isMaster ? 'modal-ribbon--master' : 'modal-ribbon--victory'}">
        <span>${title}</span>
      </div>

      <div class="modal-scroll-body" style="align-items:center;text-align:center">
        <div class="victory-stars-row">
          <div class="v-star-slot ${stars >= 1 ? 'v-star--earned' : ''}" style="--star-delay:.15s">⭐</div>
          <div class="v-star-slot ${stars >= 2 ? 'v-star--earned' : ''}" style="--star-delay:.35s">⭐</div>
          <div class="v-star-slot ${stars >= 3 ? 'v-star--earned' : ''}" style="--star-delay:.55s">⭐</div>
        </div>

        <div class="victory-rewards-card">
          <div class="reward-pill reward-pill--coins">
            <span class="reward-icon">🪙</span>
            <span class="reward-val">+${coins}</span>
            <span class="reward-label">${coins === 0 ? 'Monedas (Ya ganado)' : 'Monedas'}</span>
          </div>
          ${combo > 1 ? `
            <div class="reward-pill reward-pill--combo">
              <span class="reward-icon">🔥</span>
              <span class="reward-val">x${combo}</span>
              <span class="reward-label">Combo Racha</span>
            </div>
          ` : ''}
        </div>

        ${coins === 0 ? `
          <div style="font-size:11px;font-weight:700;color:#64748B;margin-bottom:.5rem">
            ⚡ Consejo: ¡Gana monedas farmeando en el Modo Libre!
          </div>
        ` : ''}

        <div class="modal-actions modal-actions--stacked" style="width:100%">
          ${onNext ? `
            <button class="btn btn-green btn-lg" id="v-btn-next">
              ▶ SIGUIENTE NIVEL
            </button>
          ` : ''}
          <div style="display:flex;gap:.4rem;width:100%">
            <button class="btn btn-blue btn-md" style="flex:1" id="v-btn-retry">
              🔄 Repetir
            </button>
            <button class="btn btn-orange btn-md" style="flex:1" id="v-btn-menu">
              ${isMaster ? '🗺️ Módulos' : '🗺️ Niveles'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  for (let i = 1; i <= stars; i++) {
    setTimeout(() => playStar(i), i * 200);
  }
  if (coins > 0) setTimeout(() => playCoin(), 650);

  overlay.querySelector('#v-btn-next')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onNext) onNext();
  });

  overlay.querySelector('#v-btn-retry')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onRetry) onRetry();
  });

  overlay.querySelector('#v-btn-menu')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onMenu) onMenu();
  });

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. MODAL DE DERROTA / SIN VIDAS
// ═══════════════════════════════════════════════════════════════════════════════

export function showGameOverModal({ onRetry, onGuide, onMenu }) {
  playWhoosh();
  const overlay = _createOverlay();

  overlay.innerHTML = `
    <div class="modal-box" style="max-width:420px;text-align:center" role="dialog" aria-modal="true">
      <div class="modal-ribbon modal-ribbon--red">
        <span>💔 ¡SIN VIDAS POR AHORA!</span>
      </div>

      <div class="modal-scroll-body" style="align-items:center;text-align:center">
        <div style="font-size:clamp(36px,5.5vw,52px);margin:.8rem 0 .2rem">🤔💭</div>

        <h3 style="font-size:clamp(14px,2vw,18px);font-weight:900;color:#0F172A">
          ¡No te rindas, aventurero!
        </h3>
        <p style="font-size:clamp(10px,1.3vw,13px);color:#64748B;font-weight:600;margin:.3rem 0 .7rem;line-height:1.3">
          Los errores son la forma en que el cerebro aprende nuevos superpoderes. Puedes revisar la guía o reintentar ahora mismo.
        </p>

        <div class="modal-actions modal-actions--stacked" style="width:100%">
          <button class="btn btn-gold btn-md" id="go-btn-guide">
            📖 REVISAR GUÍA Y PISTAS
          </button>
          <div style="display:flex;gap:.4rem;width:100%">
            <button class="btn btn-green btn-md" style="flex:1" id="go-btn-retry">
              🔄 Reintentar
            </button>
            <button class="btn btn-orange btn-md" style="flex:1" id="go-btn-menu">
              🗺️ Módulos
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#go-btn-guide')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onGuide) onGuide();
  });

  overlay.querySelector('#go-btn-retry')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onRetry) onRetry();
  });

  overlay.querySelector('#go-btn-menu')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onMenu) onMenu();
  });

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. MODAL DE PAUSA / CONFIRMACIÓN DE SALIDA
// ═══════════════════════════════════════════════════════════════════════════════

export function showPauseModal({ onResume, onQuit }) {
  playClick();
  const overlay = _createOverlay();

  overlay.innerHTML = `
    <div class="modal-box" style="max-width:360px;text-align:center" role="dialog" aria-modal="true">
      <div class="modal-ribbon modal-ribbon--blue">
        <span>⏸️ JUEGO EN PAUSA</span>
      </div>

      <div class="modal-scroll-body" style="align-items:center;text-align:center">
        <div style="padding:.6rem 0 .4rem">
          <p style="font-size:clamp(12px,1.5vw,15px);font-weight:700;color:#37474F;line-height:1.35">
            ¿Quieres tomarte un descanso?<br>
            <span style="font-size:clamp(10px,1.2vw,12px);color:#78909C;font-weight:600">
              Tu progreso en este nivel está a salvo.
            </span>
          </p>
        </div>

        <div class="modal-actions modal-actions--stacked" style="width:100%">
          <button class="btn btn-green btn-md" id="pause-resume">
            ▶ CONTINUAR JUGANDO
          </button>
          <button class="btn btn-orange btn-sm" id="pause-quit">
            🗺️ Volver al Mapa de Módulos
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#pause-resume')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onResume) onResume();
  });

  overlay.querySelector('#pause-quit')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onQuit) onQuit();
  });

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. MODAL DE PERFIL DE JUGADOR (Reemplaza alert)
// ═══════════════════════════════════════════════════════════════════════════════

export function showProfileModal({ user, modules, save, onSaveAlias, onOpenCloud, onLogoutAccount, onClose }) {
  playPop();
  const overlay = _createOverlay();
  const actualSave = save || { user, modules };

  const stars = user.stars_total || 0;
  let rank = user.title || '🌟 Novato Matemático';

  const unlockedAvatars = user.unlocked_avatars || ['🧒', '👧'];
  let currentAvatar = user.avatar || '🧒';
  const achievementsCount = (user.achievements || []).length;
  const totalTrophies = TROPHIES.length;

  const modBreakdown = Object.entries(modules).map(([k, m]) => {
    const lvs = Object.values(m?.levels || {});
    const cleared = lvs.filter((l) => l.cleared).length;
    const name = k.includes('multi') ? 'Multiplicación' : k.includes('div') ? 'División' : k.includes('intro') ? 'Fracciones I' : 'Fracciones II';
    const totalModLvs = 20;
    const pct = Math.min(100, Math.round((cleared / totalModLvs) * 100));
    return `
      <div class="prof-mod-row">
        <span class="prof-mod-name">${name}</span>
        <div class="prof-mod-bar">
          <div class="prof-mod-fill" style="width:${pct}%"></div>
        </div>
        <span class="prof-mod-count">${cleared}/${totalModLvs}</span>
      </div>
    `;
  }).join('');

  overlay.innerHTML = `
    <div class="modal-box modal-box--profile" role="dialog" aria-modal="true">
      <div class="modal-ribbon modal-ribbon--orange">
        <span>👤 MI PERFIL DE AVENTURERO</span>
      </div>

      <div class="modal-scroll-body">
        <div class="prof-content">
          <div style="display:flex;flex-direction:column;align-items:center;width:100%">
            <div class="prof-avatar-big" id="prof-avatar-display" data-avatar="${currentAvatar}">
              <span class="prof-avatar-emoji avatar-emoji-bordered">${currentAvatar}</span>
            </div>
            <div style="font-size:10px;font-weight:800;color:#64748B;margin-bottom:.25rem">Tus Avatares (desliza para elegir):</div>
            <div class="prof-avatar-picker-window">
              <div class="prof-avatar-picker">
                ${unlockedAvatars.map((av) => `
                  <button class="prof-av-opt ${av === currentAvatar ? 'prof-av-opt--selected' : ''}" data-av="${av}">
                    <span class="prof-av-opt-emoji avatar-emoji-bordered">${av}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="prof-info-section">
            <label class="prof-label" for="prof-inp-alias">Tu Nombre (Nickname):</label>
            <div style="display:flex;gap:.3rem;align-items:center">
              <input id="prof-inp-alias" class="prof-alias-input" type="text" maxlength="20" value="${user.alias || 'Estudiante'}" placeholder="Tu nombre..." />
              <button class="btn btn-green btn-sm" id="prof-btn-save-alias" title="Guardar cambios de nombre">💾 Guardar</button>
            </div>
            <div class="prof-rank-badge">${rank}</div>

            <div class="prof-stats-pills">
              <div class="prof-stat-pill prof-stat--coins">
                <span style="font-size:14px">🪙</span>
                <strong>${user.coins || 0}</strong>
                <small>Monedas</small>
              </div>
              <div class="prof-stat-pill prof-stat--stars">
                <span style="font-size:14px">⭐</span>
                <strong>${user.stars_total || 0}</strong>
                <small>Estrellas</small>
              </div>
              <div class="prof-stat-pill prof-stat--achievements" id="prof-btn-achievements" title="Toca para ver todos tus trofeos y logros" style="cursor:pointer">
                <span style="font-size:14px">🏆</span>
                <strong>${achievementsCount} / ${totalTrophies}</strong>
                <small>Logros</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Estado de Cuenta en la Nube -->
        <div class="prof-cloud-section">
          ${user.student_id ? `
            <div class="prof-cloud-card prof-cloud-card--active">
              <div class="prof-cloud-icon">☁️</div>
              <div class="prof-cloud-info">
                <div class="prof-cloud-status-line">
                  <span class="prof-cloud-dot"></span>
                  <strong>Tarjeta ID: ${user.student_id}</strong>
                </div>
                <div class="prof-cloud-sub">🟢 Cuenta conectada</div>
              </div>
              <button class="btn btn-red btn-sm prof-cloud-btn" id="prof-btn-cloud-logout" title="Cerrar sesión">
                Cerrar Sesión
              </button>
            </div>
          ` : `
            <div class="prof-cloud-card prof-cloud-card--offline">
              <div class="prof-cloud-icon">☁️</div>
              <div class="prof-cloud-info">
                <div class="prof-cloud-status-line">
                  <span class="prof-cloud-dot prof-cloud-dot--warn"></span>
                  <strong>Sin cuenta vinculada</strong>
                </div>
                <div class="prof-cloud-sub">Vincula tu Tarjeta de Identidad para no perder tu avance si se formatea este equipo.</div>
              </div>
              <button class="btn btn-green btn-sm prof-cloud-btn" id="prof-btn-cloud-link">
                🔗 Vincular Cuenta
              </button>
            </div>
          `}
        </div>

        <div class="prof-mods-section">
          <h4 style="font-size:clamp(10px,1.2vw,13px);font-weight:800;color:#37474F;margin-bottom:.2rem">
            Progreso de Campaña
          </h4>
          ${modBreakdown}
        </div>

        <div class="modal-actions" style="margin-top:.5rem">
          <button class="btn btn-blue btn-md" id="prof-btn-close">
            ¡Listo!
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelectorAll('.prof-av-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      currentAvatar = btn.dataset.av;
      overlay.querySelectorAll('.prof-av-opt').forEach((b) => b.classList.remove('prof-av-opt--selected'));
      btn.classList.add('prof-av-opt--selected');
      const disp = overlay.querySelector('#prof-avatar-display');
      if (disp) {
        disp.dataset.avatar = currentAvatar;
        disp.innerHTML = `<span class="prof-avatar-emoji avatar-emoji-bordered">${currentAvatar}</span>`;
      }
      user.avatar = currentAvatar;
      if (onSaveAlias) onSaveAlias(user.alias, currentAvatar);
    });
  });

  overlay.querySelector('#prof-btn-save-alias')?.addEventListener('click', async () => {
    playPop();
    const val = overlay.querySelector('#prof-inp-alias')?.value.trim() || 'Estudiante';
    user.alias = val;
    if (onSaveAlias) onSaveAlias(val, currentAvatar);
    if (user.student_id) {
      updateStudentNickname(val);
    }
    showToast('¡Nombre guardado con éxito! 👤', 'ok', '💾');
  });

  overlay.querySelector('#prof-btn-cloud-logout')?.addEventListener('click', () => {
    playClick();
    showConfirmModal({
      title: '🚪 ¿CERRAR SESIÓN?',
      message: 'Tu progreso actual en la nube quedará a salvo. Podrás volver a entrar con tu Tarjeta de Identidad.',
      confirmText: 'Sí, Salir',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await logoutStudent();
        overlay._cleanup();
        if (onLogoutAccount) {
          onLogoutAccount();
        }
      },
    });
  });

  overlay.querySelector('#prof-btn-cloud-link')?.addEventListener('click', () => {
    playClick();
    overlay._cleanup();
    if (onOpenCloud) onOpenCloud();
  });

  overlay.querySelector('#prof-btn-achievements')?.addEventListener('click', () => {
    playClick();
    showAchievementsModal({
      save: actualSave,
      onClose: () => {}
    });
  });

  overlay.querySelector('#prof-btn-close')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onClose) onClose();
  });

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5B. MODAL DE VITRINA DE LOGROS Y TROFEOS
// ═══════════════════════════════════════════════════════════════════════════════

export function showAchievementsModal({ save, onClose }) {
  playPop();
  const overlay = _createOverlay('modal-backdrop--achievements');
  const user = save?.user || {};
  const unlockedSet = new Set(user.achievements || []);
  const total = TROPHIES.length;
  const unlockedCount = TROPHIES.filter((t) => unlockedSet.has(t.id)).length;
  const pct = Math.round((unlockedCount / total) * 100);

  function renderCards(filter = 'all') {
    const list = TROPHIES.filter((t) => {
      const isUn = unlockedSet.has(t.id);
      if (filter === 'unlocked') return isUn;
      if (filter === 'locked') return !isUn;
      return true;
    });

    if (list.length === 0) {
      return `<div style="text-align:center;padding:1.5rem;color:#64748B;font-weight:800;font-size:12px;">No hay trofeos en esta categoría todavía.</div>`;
    }

    return list.map((t) => {
      const isUn = unlockedSet.has(t.id);
      return `
        <div class="trophy-card ${isUn ? 'trophy-card--unlocked' : 'trophy-card--locked'}">
          <div class="trophy-card-icon-box">
            <span class="${isUn ? 'trophy-icon-glow' : 'trophy-icon-locked'}">${isUn ? t.icon : '🔒'}</span>
          </div>
          <div class="trophy-card-body">
            <div class="trophy-card-header">
              <span class="trophy-card-title">${t.title}</span>
              <span class="trophy-card-badge ${isUn ? 'badge--unlocked' : 'badge--locked'}">
                ${isUn ? '✅ Conseguido' : '🔒 Bloqueado'}
              </span>
            </div>
            <div class="trophy-card-desc">${t.description}</div>
            <div class="trophy-card-cat">Categoría: ${t.category}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  overlay.innerHTML = `
    <div class="modal-box modal-box--achievements" role="dialog" aria-modal="true">
      <div class="modal-ribbon modal-ribbon--master">
        <span>🏆 VITRINA DE TROFEOS & LOGROS</span>
      </div>

      <div class="modal-scroll-body">
        <div class="ach-summary-banner">
          <div style="font-size:clamp(22px,3.5vw,30px)">🏆</div>
          <div style="flex:1">
            <div style="font-size:12px;font-weight:900;color:#0F172A">
              Trofeos Obtenidos: <span style="color:#D97706">${unlockedCount}</span> de ${total} (${pct}%)
            </div>
            <div class="ach-prog-bar">
              <div class="ach-prog-fill" style="width:${pct}%"></div>
            </div>
          </div>
        </div>

        <div class="ach-filter-tabs">
          <button class="ach-tab-btn ach-tab-btn--active" data-filter="all">Todos (${total})</button>
          <button class="ach-tab-btn" data-filter="unlocked">🏆 Obtenidos (${unlockedCount})</button>
          <button class="ach-tab-btn" data-filter="locked">🔒 Por Obtener (${total - unlockedCount})</button>
        </div>

        <div class="ach-grid" id="ach-cards-container">
          ${renderCards('all')}
        </div>

        <div class="modal-actions" style="margin-top:.6rem">
          <button class="btn btn-blue btn-md btn-close-modal" id="ach-btn-close">
            ✅ ¡ENTENDIDO!
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const container = overlay.querySelector('#ach-cards-container');
  overlay.querySelectorAll('.ach-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClick();
      overlay.querySelectorAll('.ach-tab-btn').forEach((b) => b.classList.remove('ach-tab-btn--active'));
      btn.classList.add('ach-tab-btn--active');
      if (container) {
        container.innerHTML = renderCards(btn.dataset.filter);
      }
    });
  });

  overlay.querySelector('#ach-btn-close')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onClose) onClose();
  });

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5C. MODAL DE TAREAS Y MISIONES HEROICAS
// ═══════════════════════════════════════════════════════════════════════════════

export function showTasksModal({ save, onClaimTask, onClose, getSave }) {
  playPop();
  const overlay = _createOverlay('modal-backdrop--tasks');

  const expandedClasses = new Set();
  const showCompletedClasses = new Set();

  function getCurrentSave() {
    return (getSave ? getSave() : null) || save;
  }

  function getClaimableTasks() {
    const s = getCurrentSave();
    const organized = getOrganizedTasks(s);
    const list = [];
    organized.forEach(({ activeTask }) => {
      if (activeTask) {
        const prog = activeTask.getProgress(s);
        if (prog.completed) list.push(activeTask);
      }
    });
    return list;
  }

  // Inicializar clases expandidas: las que tienen tareas para reclamar se abren automáticamente
  function initAutoExpand() {
    const s = getCurrentSave();
    const organized = getOrganizedTasks(s);
    let claimableFound = false;
    organized.forEach(({ classInfo, activeTask }) => {
      if (activeTask) {
        const prog = activeTask.getProgress(s);
        if (prog.completed) {
          expandedClasses.add(classInfo.id);
          claimableFound = true;
        }
      }
    });
    // Si ninguna está lista para reclamar, abrir las 2 primeras con tareas en progreso
    if (!claimableFound) {
      let opened = 0;
      organized.forEach(({ classInfo, activeTask }) => {
        if (activeTask && opened < 2) {
          expandedClasses.add(classInfo.id);
          opened++;
        }
      });
    }
  }
  initAutoExpand();

  function updateModalHeader() {
    const s = getCurrentSave();
    const count = getClaimableTasksCount(s);
    const ribbon = overlay.querySelector('.modal-ribbon--tasks span');
    if (ribbon) {
      ribbon.innerHTML = count > 0
        ? `📋 MISIONES & TAREAS HEROICAS <span class="task-notif-badge badge-pop-update" style="vertical-align:middle;margin-left:6px">${count}</span>`
        : `📋 MISIONES & TAREAS HEROICAS`;
    }
    const claimable = getClaimableTasks();
    const claimAllBtn = overlay.querySelector('#tasks-btn-claim-all');
    if (claimAllBtn) {
      if (claimable.length > 0) {
        const totalCoins = claimable.reduce((acc, t) => acc + (t.rewardCoins || 0), 0);
        claimAllBtn.style.display = 'inline-flex';
        claimAllBtn.innerHTML = `¡Reclamar todo! (${claimable.length}) · +${totalCoins} 🪙`;
      } else {
        claimAllBtn.style.display = 'none';
      }
    }
    const closeBtn = overlay.querySelector('#tasks-btn-close');
    if (closeBtn) {
      closeBtn.textContent = count > 0 ? '¡Listo!' : '¡Todo al día!';
    }
  }

  function renderTasksHtml() {
    const s = getCurrentSave();
    const organized = getOrganizedTasks(s);
    return organized.map(({ classInfo, completedTasks, activeTask, isAllDone }) => {
      const classTasks = TASKS.filter((t) => t.classId === classInfo.id);
      const totalInClass = classTasks.length;

      let canClaim = false;
      let progressPct = 0;
      let prog = null;
      let trophy = null;

      if (activeTask) {
        prog = activeTask.getProgress(s);
        canClaim = Boolean(prog.completed);
        progressPct = Math.min(100, Math.round((prog.current / prog.target) * 100));
        trophy = TROPHIES.find((tr) => tr.id === activeTask.trophyId);
      }

      const isExpanded = expandedClasses.has(classInfo.id);
      const showCompleted = showCompletedClasses.has(classInfo.id);

      const completedHtml = completedTasks.map((t) => {
        const tr = TROPHIES.find((item) => item.id === t.trophyId);
        return `
          <div class="task-row-tachada">
            <span class="task-tachada-check">✓</span>
            <span class="task-tachada-title">${t.title}</span>
            <span class="task-tachada-badge">Completada · 🏆 ${tr ? tr.title : 'Logro'}</span>
          </div>
        `;
      }).join('');

      let activeHtml = '';
      if (activeTask) {
        activeHtml = `
          <div class="task-active-card ${canClaim ? 'task-active-card--claimable' : ''}">
            <div class="task-active-main">
              <div class="task-active-icon-badge">${activeTask.icon}</div>
              <div class="task-active-text">
                <div class="task-active-title">${activeTask.title}</div>
                <div class="task-active-desc">${activeTask.description}</div>
              </div>
            </div>

            <div class="task-active-progress-row">
              <div class="task-active-bar-wrap">
                <div class="task-active-bar-fill" style="width: ${progressPct}%"></div>
              </div>
              <span class="task-active-ratio">${Math.min(prog.current, prog.target)} / ${prog.target}</span>
            </div>

            <div class="task-active-actions">
              <div class="task-reward-pills">
                <span class="task-reward-pill">🪙 +${activeTask.rewardCoins}</span>
                ${trophy ? `<span class="task-reward-pill">🏆 ${trophy.title}</span>` : ''}
              </div>
              ${canClaim ? `
                <button class="btn btn-green btn-sm task-btn-claim pulse-claim" data-task-id="${activeTask.id}">
                  ¡Reclamar!
                </button>
              ` : `
                <span class="task-pending-label">⏳ En progreso (${progressPct}%)</span>
              `}
            </div>
          </div>
        `;
      } else if (isAllDone) {
        activeHtml = `
          <div class="task-class-done-banner">
            🌟 ¡Completaste todos los retos de esta clase! (${completedTasks.length}/${totalInClass})
          </div>
        `;
      }

      return `
        <div class="task-class-accordion ${canClaim ? 'task-class-accordion--claimable' : ''} ${isExpanded ? 'task-class-accordion--open' : ''}" style="border-left-color: ${classInfo.color}">
          <div class="task-class-accordion-header" data-class-id="${classInfo.id}" role="button" tabindex="0" title="Haz clic para desplegar o plegar">
            <div class="task-class-header-left">
              <span class="task-class-icon">${classInfo.icon}</span>
              <span class="task-class-name">${classInfo.name}</span>
            </div>
            <div class="task-class-header-right">
              ${canClaim ? '<span class="task-badge-claimable pulse-claim">¡Reclamar!</span>' : ''}
              <span class="task-class-progress-pill">${completedTasks.length}/${totalInClass}</span>
              <span class="task-accordion-chevron">${isExpanded ? '▲' : '▼'}</span>
            </div>
          </div>

          <div class="task-class-accordion-body" style="display: ${isExpanded ? 'block' : 'none'}">
            ${activeHtml}

            ${completedTasks.length > 0 ? `
              <div class="task-completed-accordion-wrap">
                <button type="button" class="task-toggle-completed-btn" data-toggle-completed="${classInfo.id}">
                  ${showCompleted ? `Ocultar completadas (${completedTasks.length}) ▲` : `Ver completadas (${completedTasks.length}) ▼`}
                </button>
                <div class="task-tachada-list" style="display: ${showCompleted ? 'flex' : 'none'}">
                  ${completedHtml}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function refreshView() {
    const body = overlay.querySelector('#tasks-list-container');
    if (body) {
      body.innerHTML = renderTasksHtml();
      bindEvents();
      updateModalHeader();
    }
  }

  function bindEvents() {
    // Reclamar tarea individual
    overlay.querySelectorAll('.task-btn-claim').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = btn.dataset.taskId;
        const task = TASKS.find((t) => t.id === taskId);
        if (!task) return;

        playUnlock();
        playCoin();
        if (onClaimTask) {
          const res = onClaimTask(task);
          if (res) save = res;
        }

        // Si la clase ya no tiene más tareas por reclamar, auto-colapsar
        const s = getCurrentSave();
        const classTasks = TASKS.filter((t) => t.classId === task.classId).sort((a, b) => a.order - b.order);
        const claimed = new Set(s?.user?.claimed_tasks || []);
        const nextActive = classTasks.find((t) => !claimed.has(t.id));
        const nextIsClaimable = nextActive ? nextActive.getProgress(s).completed : false;
        if (!nextIsClaimable) {
          expandedClasses.delete(task.classId);
        }

        refreshView();
        showToast(`¡Reclamaste +${task.rewardCoins} 🪙 y el Trofeo! 🏆`, 'ok', '🎉');
      });
    });

    // Reclamar todas las tareas
    overlay.querySelector('#tasks-btn-claim-all')?.addEventListener('click', () => {
      const claimable = getClaimableTasks();
      if (claimable.length === 0) return;

      playUnlock();
      playCoin();
      playVictory();

      let totalCoinsWon = 0;
      claimable.forEach((task) => {
        totalCoinsWon += (task.rewardCoins || 0);
        if (onClaimTask) {
          const res = onClaimTask(task);
          if (res) save = res;
        }
      });

      // Al reclamar todo, colapsar clases reclamadas
      expandedClasses.clear();
      initAutoExpand();

      refreshView();
      showToast(`¡Reclamaste ${claimable.length} misiones! +${totalCoinsWon} 🪙 y Trofeos 🏆`, 'ok', '🎉');
    });

    // Clic en encabezado de acordeón
    overlay.querySelectorAll('.task-class-accordion-header').forEach((hdr) => {
      hdr.addEventListener('click', () => {
        playClick();
        const cid = hdr.dataset.classId;
        if (expandedClasses.has(cid)) {
          expandedClasses.delete(cid);
        } else {
          expandedClasses.add(cid);
        }
        refreshView();
      });
    });

    // Clic en ver/ocultar completadas
    overlay.querySelectorAll('.task-toggle-completed-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playClick();
        const cid = btn.dataset.toggleCompleted;
        if (showCompletedClasses.has(cid)) {
          showCompletedClasses.delete(cid);
        } else {
          showCompletedClasses.add(cid);
        }
        refreshView();
      });
    });

    // Controles rápidos: Expandir / Colapsar todo
    overlay.querySelector('#tasks-btn-expand-all')?.addEventListener('click', () => {
      playClick();
      TASK_CLASSES.forEach((c) => expandedClasses.add(c.id));
      refreshView();
    });

    overlay.querySelector('#tasks-btn-collapse-all')?.addEventListener('click', () => {
      playClick();
      expandedClasses.clear();
      refreshView();
    });
  }

  overlay.innerHTML = `
    <div class="modal-box modal-box--tasks" role="dialog" aria-modal="true">
      <div class="modal-ribbon modal-ribbon--tasks">
        <span>📋 MISIONES & TAREAS HEROICAS</span>
      </div>

      <div class="modal-scroll-body">
        <div class="tasks-banner-info">
          <span>¡Supera desafíos por clases! Al cumplir una tarea se tachará, reclamarás monedas y trofeos, y se revelará la siguiente meta.</span>
        </div>

        <div class="tasks-toolbar">
          <span class="tasks-toolbar-info">Toca una categoría para ver o esconder sus retos:</span>
          <div class="tasks-toolbar-actions">
            <button type="button" class="tasks-quick-toggle-btn" id="tasks-btn-expand-all">Expandir todas</button>
            <button type="button" class="tasks-quick-toggle-btn" id="tasks-btn-collapse-all">Colapsar todas</button>
          </div>
        </div>

        <div class="tasks-list" id="tasks-list-container">
          ${renderTasksHtml()}
        </div>

        <div class="modal-actions" style="margin-top:.6rem;display:flex;gap:.6rem;justify-content:center;align-items:center;flex-wrap:wrap">
          <button class="btn btn-green btn-md pulse-claim" id="tasks-btn-claim-all" style="display:none">
            ¡Reclamar todo!
          </button>
          <button class="btn btn-blue btn-md btn-close-modal" id="tasks-btn-close">
            ¡Listo!
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  updateModalHeader();
  bindEvents();

  overlay.querySelector('#tasks-btn-close')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onClose) onClose();
  });

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MODAL DE AJUSTES Y PANEL DOCENTE (Reemplaza alert sin corte de ribbon)
// ═══════════════════════════════════════════════════════════════════════════════

export function showSettingsModal({ sfxOn, musicOn, onToggleSfx, onToggleMusic, onReset, onClose }) {
  playPop();
  const overlay = _createOverlay();

  overlay.innerHTML = `
    <div class="modal-box modal-box--settings" role="dialog" aria-modal="true">
      <div class="modal-ribbon modal-ribbon--settings">
        <span>⚙️ AJUSTES & DOCENTE</span>
      </div>

      <div class="modal-scroll-body">
        <div class="settings-content">
          <div class="settings-section">
            <h4 class="settings-section-title">🔊 Sonido y Música</h4>
            <div class="settings-row">
              <span>Efectos de Sonido (SFX)</span>
              <button class="btn btn-sm ${sfxOn ? 'btn-green' : 'btn-gray'}" id="set-toggle-sfx">
                ${sfxOn ? '🔊 Activado' : '<span class="icon-music-slash">🔊</span> Silenciado'}
              </button>
            </div>
            <div class="settings-row">
              <span>Música Ambiental</span>
              <button class="btn btn-sm ${musicOn ? 'btn-green' : 'btn-gray'}" id="set-toggle-music">
                ${musicOn ? '🎵 Activada' : '<span class="icon-music-slash">🎵</span> Silenciada'}
              </button>
            </div>
          </div>

          <div class="settings-section">
            <h4 class="settings-section-title">Información Institucional</h4>
            <div class="settings-docente-box">
              <p><strong>I.E. Técnico Industrial Laureano Gómez Castro</strong></p>
              <p>Sede Primaria · Aguachica, Cesar · Grado 4.°</p>
              <p style="margin-top:.2rem;color:#78909C;font-size:clamp(9px,1.1vw,11px)">
                100% Offline · Desarrollado para fortalecer el cálculo mental y el razonamiento fraccionario.
              </p>
            </div>
          </div>

          <div class="settings-section">
            <h4 class="settings-section-title" style="color:#C62828">⚠️ Zona de Peligro</h4>
            <div class="settings-row">
              <span style="font-size:11px;color:#546E7A">Borrar todo el progreso</span>
              <button class="btn btn-red btn-sm" id="set-btn-reset">
                🗑 Borrar Todo
              </button>
            </div>
          </div>
        </div>

        <div class="modal-actions" style="margin-top:.5rem">
          <button class="btn btn-blue btn-md" id="set-btn-close">
            Cerrar Ajustes
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const btnSfx = overlay.querySelector('#set-toggle-sfx');
  btnSfx?.addEventListener('click', () => {
    playPop();
    const newState = onToggleSfx ? onToggleSfx() : false;
    btnSfx.className = `btn btn-sm ${newState ? 'btn-green' : 'btn-gray'}`;
    btnSfx.innerHTML = newState ? '🔊 Activado' : '<span class="icon-music-slash">🔊</span> Silenciado';
  });

  const btnMusic = overlay.querySelector('#set-toggle-music');
  btnMusic?.addEventListener('click', () => {
    playPop();
    const newState = onToggleMusic ? onToggleMusic() : false;
    btnMusic.className = `btn btn-sm ${newState ? 'btn-green' : 'btn-gray'}`;
    btnMusic.innerHTML = newState ? '🎵 Activada' : '<span class="icon-music-slash">🎵</span> Silenciada';
  });

  overlay.querySelector('#set-btn-reset')?.addEventListener('click', () => {
    playClick();
    showConfirmModal({
      title: '⚠️ ¿BORRAR TODO EL PROGRESO?',
      message: 'Perderás todas tus monedas ganadas, estrellas, avatares y niveles. ¿Deseas continuar?',
      confirmText: 'Sí, Borrar Todo',
      cancelText: 'Cancelar',
      onConfirm: () => {
        if (onReset) onReset();
      },
    });
  });

  overlay.querySelector('#set-btn-close')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onClose) onClose();
  });

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. DIÁLOGO DE CONFIRMACIÓN PROGRAMADO
// ═══════════════════════════════════════════════════════════════════════════════

export function showConfirmModal({ title = '¿Estás seguro?', message = '', confirmText = 'Aceptar', cancelText = 'Cancelar', onConfirm, onCancel }) {
  playClick();
  const overlay = _createOverlay();

  overlay.innerHTML = `
    <div class="modal-box" style="max-width:380px;text-align:center" role="dialog" aria-modal="true">
      <div class="modal-ribbon modal-ribbon--red">
        <span>${title}</span>
      </div>

      <div class="modal-scroll-body">
        <div style="padding:.6rem 0 .3rem">
          <p style="font-size:clamp(11px,1.4vw,14px);font-weight:700;color:#37474F;line-height:1.35">
            ${message}
          </p>
        </div>

        <div class="modal-actions">
          <button class="btn btn-gray btn-md" id="cfm-btn-cancel">
            ${cancelText}
          </button>
          <button class="btn btn-red btn-md" id="cfm-btn-confirm">
            ${confirmText}
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#cfm-btn-cancel')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onCancel) onCancel();
  });

  overlay.querySelector('#cfm-btn-confirm')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onConfirm) onConfirm();
  });

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. TOAST DE NOTIFICACIONES FLOTANTES
// ═══════════════════════════════════════════════════════════════════════════════

export function showToast(msg, type = 'ok', icon = '✨') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-pill toast-pill--${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-text">${msg}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-pill--out');
    setTimeout(() => toast.remove(), 200);
  }, 2400);
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. MODAL INFORMATIVO DE PODERES DE AVATAR (Previa a Modo Libre)
// ═══════════════════════════════════════════════════════════════════════════

export function showFreeModeBriefingModal({ avatar, onStart, onCancel }) {
  playPop();
  const overlay = _createOverlay('modal-backdrop--briefing');
  const rarity = getAvatarRarity(avatar); // 'basic', 'common', 'advanced', 'epic', 'mythic'

  let ribbonText = 'PODERES DE MODO LIBRE';
  let ribbonClass = 'modal-ribbon modal-ribbon--victory';
  let title = '';
  let subtitle = '';
  let powersHtml = '';

  const hasAura = rarity !== 'basic';

  const avatarDisplayHtml = hasAura
    ? `
      <div class="avatar-aura-wrap avatar-aura--${rarity}" style="transform:scale(0.82);margin:0.25rem 0 0.25rem;">
        <span class="aura-spark"></span>
        <span class="aura-spark"></span>
        <span class="aura-spark"></span>
        <span class="aura-spark"></span>
        <span class="aura-spark"></span>
        <span class="aura-front-sheen"></span>
        <div class="avatar-emoji-bordered" data-avatar="${avatar}" style="font-size:clamp(28px, 3.8vw, 36px);line-height:1">${avatar}</div>
      </div>
    `
    : `
      <div class="avatar-emoji-bordered" data-avatar="${avatar}" style="font-size:clamp(28px, 3.8vw, 36px);line-height:1;margin:0.25rem 0 0.25rem;">${avatar}</div>
    `;

  if (rarity === 'mythic') {
    ribbonText = '👑 AVATAR MÍTICO DETECTADO';
    ribbonClass = 'modal-ribbon modal-ribbon--master';
    title = '¡Habilidades Míticas en Juego!';
    subtitle = 'Tu avatar cuenta con 2 poderes extraordinarios para este contrarreloj:';
    powersHtml = `
      <div class="briefing-power-card" style="border-color:#F59E0B;background:#FFFBEB">
        <div class="briefing-power-icon">⚡</div>
        <div class="briefing-power-info">
          <div class="briefing-power-name" style="color:#B45309">Auto-Acierto (5 veces por partida)</div>
          <div class="briefing-power-desc">
            Presionando el botón <strong>⚡ Auto-Acierto</strong> (o la tecla <span class="briefing-power-key-tag">Espacio</span> / <span class="briefing-power-key-tag">P</span> en PC), se resuelve automáticamente la pregunta actual, sumando puntos y reiniciando el reloj.
          </div>
        </div>
      </div>
      <div class="briefing-power-card" style="border-color:#C084FC;background:#FAF5FF">
        <div class="briefing-power-icon">🔮</div>
        <div class="briefing-power-info">
          <div class="briefing-power-name" style="color:#7E22CE">Descarte Mítico (1 vez por partida)</div>
          <div class="briefing-power-desc">
            Se activará en cuanto haya <strong>4 o más opciones</strong> en pantalla (racha 4+). Presionando el botón <strong>🔮 Descarte Mítico</strong> (o tecla <span class="briefing-power-key-tag">D</span> en PC), <strong>elimina 2 opciones incorrectas</strong> (la mitad) para que sigas respondiendo velozmente.
          </div>
        </div>
      </div>
    `;
  } else if (rarity === 'epic') {
    ribbonText = '🟣 AVATAR ÉPICO DETECTADO';
    ribbonClass = 'modal-ribbon modal-ribbon--victory';
    title = '¡Habilidad Épica en Juego!';
    subtitle = 'Tu avatar cuenta con asistencia especial durante este contrarreloj:';
    powersHtml = `
      <div class="briefing-power-card" style="border-color:#C084FC;background:#FAF5FF">
        <div class="briefing-power-icon">⚡</div>
        <div class="briefing-power-info">
          <div class="briefing-power-name" style="color:#7E22CE">Auto-Acierto (5 veces por partida)</div>
          <div class="briefing-power-desc">
            Presionando el botón <strong>⚡ Auto-Acierto</strong> (o la tecla <span class="briefing-power-key-tag">Espacio</span> / <span class="briefing-power-key-tag">P</span> en PC), se resolverá de forma automática la pregunta actual si necesitas salvar tu racha. ¡Puedes usarlo hasta <strong>5 veces por partida</strong>!
          </div>
        </div>
      </div>
    `;
  } else if (rarity === 'advanced') {
    ribbonText = '🔵 AVATAR AVANZADO DETECTADO';
    ribbonClass = 'modal-ribbon modal-ribbon--victory';
    title = '¡Habilidad Avanzada en Juego!';
    subtitle = 'Tu avatar cuenta con asistencia táctica durante este contrarreloj:';
    powersHtml = `
      <div class="briefing-power-card" style="border-color:#38BDF8;background:#F0F9FF">
        <div class="briefing-power-icon">⚡</div>
        <div class="briefing-power-info">
          <div class="briefing-power-name" style="color:#0369A1">Auto-Acierto (1 vez por partida)</div>
          <div class="briefing-power-desc">
            Presionando el botón <strong>⚡ Auto-Acierto</strong> (o la tecla <span class="briefing-power-key-tag">Espacio</span> / <span class="briefing-power-key-tag">P</span> en PC), se colocará la respuesta correcta automáticamente. Puedes usarlo <strong>1 vez por partida</strong>.
          </div>
        </div>
      </div>
    `;
  } else if (rarity === 'common') {
    ribbonText = '🟢 AVATAR COMÚN';
    ribbonClass = 'modal-ribbon';
    title = 'Desafío a Puro Talento';
    subtitle = 'Los avatares comunes no tienen habilidades especiales en el Modo Libre.';
    powersHtml = `
      <div class="briefing-power-card">
        <div class="briefing-power-icon">💡</div>
        <div class="briefing-power-info">
          <div class="briefing-power-name">Entrenamiento Clásico</div>
          <div class="briefing-power-desc">
            ¡Demuestra tu rapidez mental resolviendo cada reto sin ayudas! O visita la <strong>Tienda</strong> para equipar avatares <strong>Avanzados (1 acierto)</strong>, <strong>Épicos (5 aciertos)</strong> o <strong>Míticos (5 aciertos + descarte)</strong>.
          </div>
        </div>
      </div>
    `;
  } else {
    // basic
    ribbonText = '⚪ AVATAR BÁSICO';
    ribbonClass = 'modal-ribbon';
    title = 'Desafío a Puro Talento';
    subtitle = 'Los avatares iniciales no tienen habilidades especiales ni auras.';
    powersHtml = `
      <div class="briefing-power-card">
        <div class="briefing-power-icon">💡</div>
        <div class="briefing-power-info">
          <div class="briefing-power-name">Sin Poderes Especiales</div>
          <div class="briefing-power-desc">
            ¡Pon a prueba tu agilidad al natural! O visita la <strong>Tienda</strong> para desbloquear avatares con auras resplandecientes y poderes de ayuda contrarreloj.
          </div>
        </div>
      </div>
    `;
  }

  overlay.innerHTML = `
    <div class="modal-box modal-box--briefing" role="dialog" aria-modal="true">
      <div class="${ribbonClass}">
        <span>${ribbonText}</span>
      </div>

      <div class="modal-scroll-body" style="align-items:center;text-align:center">
        <div class="briefing-avatar-preview">
          ${avatarDisplayHtml}
        </div>

        <h3 style="font-size:clamp(15px, 2vw, 19px);font-weight:900;color:#0F172A;margin:.2rem 0">
          ${title}
        </h3>
        <p style="font-size:clamp(10.5px, 1.3vw, 12.5px);font-weight:700;color:#64748B;margin:0 0 .5rem;line-height:1.35">
          ${subtitle}
        </p>

        <div class="briefing-powers-list">
          ${powersHtml}
        </div>

        <div style="display:flex;gap:.6rem;width:100%;margin-top:.7rem">
          <button class="btn btn-gray btn-md" id="fm-briefing-cancel-btn" style="flex:0.35">
            ◀ Volver
          </button>
          <button class="btn btn-green btn-md" id="fm-briefing-start-btn" style="flex:1">
            ¡COMENZAR DESAFÍO! ⚡
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#fm-briefing-start-btn')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onStart) onStart();
  });

  overlay.querySelector('#fm-briefing-cancel-btn')?.addEventListener('click', () => {
    playPop();
    overlay._cleanup();
    if (onCancel) onCancel();
  });

  return { close: () => overlay._cleanup() };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 12. MODAL DE GESTIÓN Y SINCRONIZACIÓN EN LA NUBE (FIREBASE)
// ═══════════════════════════════════════════════════════════════════════════════

export function showCloudModal({ save, getSave, onSaveUpdate, onLogout, onClose }) {
  playPop();
  const overlay = _createOverlay('modal-backdrop--cloud');
  const user = save.user || {};
  const isConnected = Boolean(user.student_id);

  const _renderModalContent = (activeTab = 'register') => {
    if (!isConnected) {
      return `
        <div class="modal-box modal-box--cloud" role="dialog" aria-modal="true">
          <div class="modal-ribbon modal-ribbon--cloud">
            <span>☁️ CUENTA EN LA NUBE</span>
          </div>

          <div class="modal-scroll-body">
            <p style="font-size:clamp(11px,1.3vw,13px);color:#475569;font-weight:700;text-align:center;margin-bottom:.6rem">
              ¡Guarda tu partida en la nube para no perder tu progreso!
            </p>

            <div class="cloud-tabs-nav">
              <button class="cloud-tab-btn ${activeTab === 'register' ? 'cloud-tab-btn--active' : ''}" id="cm-tab-reg">
                🌟 Crear cuenta
              </button>
              <button class="cloud-tab-btn ${activeTab === 'login' ? 'cloud-tab-btn--active' : ''}" id="cm-tab-login">
                🔑 Ya tengo cuenta
              </button>
            </div>

            <!-- Panel Crear Cuenta (por defecto) -->
            <div class="cloud-tab-panel" id="cm-panel-reg" style="display:${activeTab === 'register' ? 'block' : 'none'}">
              <div class="cloud-input-group">
                <label for="cm-reg-name" class="cloud-label">Primer Nombre y Primer Apellido:</label>
                <input id="cm-reg-name" class="prof-alias-input" type="text" maxlength="30"
                       placeholder="Ej: Juan Pérez" value="${user.alias !== 'Estudiante' ? user.alias : ''}" style="width:100%;text-align:center" />
              </div>

              <div class="cloud-input-group" style="margin-top:.45rem">
                <label for="cm-reg-id" class="cloud-label">Tarjeta de Identidad / Cédula:</label>
                <input id="cm-reg-id" class="prof-alias-input" type="text" inputmode="numeric"
                       placeholder="Solo números (ej: 1098765432)" style="width:100%;text-align:center" />
              </div>

              <div id="cm-reg-err" class="cloud-err-msg" style="display:none"></div>

              <div class="modal-actions modal-actions--stacked" style="width:100%;margin-top:.6rem">
                <button class="btn btn-orange btn-md" id="cm-btn-do-reg" style="width:100%">
                  🚀 ¡CREAR CUENTA Y RESPALDAR!
                </button>
              </div>
            </div>

            <!-- Panel Iniciar Sesión -->
            <div class="cloud-tab-panel" id="cm-panel-login" style="display:${activeTab === 'login' ? 'block' : 'none'}">
              <div class="cloud-input-group">
                <label for="cm-login-id" class="cloud-label">Tarjeta de Identidad / Cédula:</label>
                <input id="cm-login-id" class="prof-alias-input" type="text" inputmode="numeric"
                       placeholder="Ingresa tu documento (ej: 1098765432)" style="width:100%;text-align:center" />
              </div>

              <div id="cm-login-err" class="cloud-err-msg" style="display:none"></div>

              <div class="modal-actions modal-actions--stacked" style="width:100%;margin-top:.6rem">
                <button class="btn btn-green btn-md" id="cm-btn-do-login" style="width:100%">
                  📥 ¡ENTRAR Y CARGAR MI AVANCE!
                </button>
              </div>
            </div>

            <div class="modal-actions" style="margin-top:.8rem">
              <button class="btn btn-gray btn-sm" id="cm-btn-close">
                ✖ Volver al Juego
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Modal cuando el usuario ya tiene sesión iniciada
    return `
      <div class="modal-box modal-box--cloud" role="dialog" aria-modal="true">
        <div class="modal-ribbon modal-ribbon--cloud">
          <span>☁️ MI PROGRESO EN LA NUBE</span>
        </div>

        <div class="modal-scroll-body">
          <div class="cloud-user-header">
            <div class="cloud-user-avatar avatar-emoji-bordered">${user.avatar || '🧒'}</div>
            <div class="cloud-user-meta">
              <h3 class="cloud-user-name">${user.alias || 'Estudiante'}</h3>
              <div class="cloud-user-id-badge">
                <span class="prof-cloud-dot"></span>
                <span>Tarjeta ID: <strong>${user.student_id}</strong></span>
              </div>
              <span class="cloud-badge-connected">🟢 Conectado</span>
            </div>
          </div>

          <div class="cloud-stats-grid">
            <div class="cloud-stat-card">
              <span class="cloud-stat-icon">⭐</span>
              <div class="cloud-stat-val">${user.stars_total || 0}</div>
              <div class="cloud-stat-lbl">Estrellas</div>
            </div>
            <div class="cloud-stat-card">
              <span class="cloud-stat-icon">🪙</span>
              <div class="cloud-stat-val">${user.coins || 0}</div>
              <div class="cloud-stat-lbl">Monedas</div>
            </div>
            <div class="cloud-stat-card">
              <span class="cloud-stat-icon">💎</span>
              <div class="cloud-stat-val">${user.gems || 0}</div>
              <div class="cloud-stat-lbl">Gemas</div>
            </div>
          </div>

          <div class="cloud-actions-box">
            <button class="btn btn-green btn-md cloud-action-btn" id="cm-btn-upload">
              <span style="font-size:18px">⬆️</span>
              <div style="text-align:left">
                <strong>Subir Progreso a la Nube</strong>
              </div>
            </button>

            <button class="btn btn-blue btn-md cloud-action-btn" id="cm-btn-download">
              <span style="font-size:18px">⬇️</span>
              <div style="text-align:left">
                <strong>Descargar Progreso de la Nube</strong>
              </div>
            </button>

            <button class="btn btn-gold btn-sm cloud-action-btn" id="cm-btn-smart-merge" style="margin-top:.2rem">
              <span style="font-size:16px">🔀</span>
              <div style="text-align:left">
                <strong>Fusión Inteligente</strong>
              </div>
            </button>
          </div>

          <div id="cm-cloud-status-msg" class="cloud-status-msg" style="display:none"></div>

          <div style="display:flex;gap:.5rem;width:100%;margin-top:.8rem">
            <button class="btn btn-red btn-sm" id="cm-btn-logout" style="flex:0.8">
              Salir de la Cuenta
            </button>
            <button class="btn btn-gray btn-sm" id="cm-btn-close" style="flex:1">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    `;
  };

  const _bindEvents = () => {
    // Pestañas (cuando no está conectado)
    overlay.querySelector('#cm-tab-login')?.addEventListener('click', () => {
      playClick();
      overlay.innerHTML = _renderModalContent('login');
      _bindEvents();
    });

    overlay.querySelector('#cm-tab-reg')?.addEventListener('click', () => {
      playClick();
      overlay.innerHTML = _renderModalContent('register');
      _bindEvents();
    });

    // Iniciar Sesión
    overlay.querySelector('#cm-btn-do-login')?.addEventListener('click', async () => {
      playClick();
      const idInp = overlay.querySelector('#cm-login-id');
      const errEl = overlay.querySelector('#cm-login-err');
      const btn = overlay.querySelector('#cm-btn-do-login');
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

      // Sesión iniciada con éxito -> descargar partida
      const cloudRes = await fetchProgressFromCloud();
      let updatedSave = save;

      if (cloudRes.ok && cloudRes.data) {
        updatedSave = smartMergeSave(save, cloudRes.data);
      } else {
        // Primera vez en la nube para esta cuenta -> respaldar guardado local
        await saveProgressToCloud(save);
      }

      updatedSave.user.student_id = studentId;
      updatedSave.user.alias = res.user.displayName || updatedSave.user.alias;
      updatedSave.user.cloud_synced = true;

      playVictory();
      showToast(`¡Hola de nuevo, ${updatedSave.user.alias}! 🎒☁️`, 'ok', '👋');

      overlay._cleanup();
      if (onSaveUpdate) onSaveUpdate(updatedSave);
    });

    // Crear Cuenta
    overlay.querySelector('#cm-btn-do-reg')?.addEventListener('click', async () => {
      playClick();
      const nameInp = overlay.querySelector('#cm-reg-name');
      const idInp = overlay.querySelector('#cm-reg-id');
      const errEl = overlay.querySelector('#cm-reg-err');
      const btn = overlay.querySelector('#cm-btn-do-reg');

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
          btn.textContent = '🚀 ¡CREAR CUENTA Y RESPALDAR!';
        }
        if (errEl) {
          errEl.textContent = res.error || 'No se pudo crear la cuenta.';
          errEl.style.display = 'block';
        }
        return;
      }

      // Guardar de inmediato el progreso actual en la cuenta creada
      save.user.student_id = studentId;
      save.user.alias = fullName;
      save.user.cloud_synced = true;
      await saveProgressToCloud(save);

      playVictory();
      showToast('¡Cuenta creada y progreso respaldado en la nube! 🚀', 'ok', '🎉');

      overlay._cleanup();
      if (onSaveUpdate) onSaveUpdate(save);
    });

    // Subir progreso a la nube
    overlay.querySelector('#cm-btn-upload')?.addEventListener('click', async () => {
      playClick();
      const btn = overlay.querySelector('#cm-btn-upload');
      const msg = overlay.querySelector('#cm-cloud-status-msg');
      if (btn) btn.disabled = true;
      if (msg) {
        msg.textContent = '⏳ Subiendo progreso a la nube...';
        msg.style.display = 'block';
        msg.style.color = '#0284C7';
      }

      const currentSave = getSave ? getSave() : save;
      const res = await saveProgressToCloud(currentSave);
      if (btn) btn.disabled = false;

      if (res.ok) {
        currentSave.user.cloud_synced = true;
        if (onSaveUpdate) onSaveUpdate(currentSave);
        playVictory();
        if (msg) {
          msg.textContent = '✅ ¡Tu progreso se guardó en la nube exitosamente!';
          msg.style.color = '#16A34A';
        }
        showToast('¡Partida respaldada en la nube! ☁️✨', 'ok', '💾');
      } else {
        if (msg) {
          msg.textContent = res.error || 'Error al guardar en la nube.';
          msg.style.color = '#DC2626';
        }
      }
    });

    // Descargar progreso de la nube
    overlay.querySelector('#cm-btn-download')?.addEventListener('click', async () => {
      playClick();
      const btn = overlay.querySelector('#cm-btn-download');
      const msg = overlay.querySelector('#cm-cloud-status-msg');
      if (btn) btn.disabled = true;
      if (msg) {
        msg.textContent = '⏳ Consultando la nube...';
        msg.style.display = 'block';
        msg.style.color = '#0284C7';
      }

      const res = await fetchProgressFromCloud();
      if (btn) btn.disabled = false;

      if (!res.ok) {
        if (msg) {
          msg.textContent = res.error || 'No se encontró partida en la nube.';
          msg.style.color = '#DC2626';
        }
        return;
      }

      const cloudSave = res.data;
      const localStars = save.user?.stars_total || 0;
      const cloudStars = cloudSave.user?.stars_total || 0;

      // Prevención de sobreescritura accidental: si el local tiene más estrellas que la nube
      if (localStars > cloudStars) {
        showConfirmModal({
          title: '⚠️ ¿DESCARGAR DE LA NUBE?',
          message: `Tu partida en este equipo tiene ${localStars} estrellas y la nube tiene ${cloudStars} estrellas. Si descargas directamente podrías perder estrellas recientes. ¿Deseas hacer una Fusión Inteligente para conservar lo mejor de ambas?`,
          confirmText: '🔀 Fusión Inteligente (Recomendado)',
          cancelText: 'Cancelar',
          onConfirm: () => {
            const merged = smartMergeSave(save, cloudSave);
            saveProgressToCloud(merged);
            overlay._cleanup();
            if (onSaveUpdate) onSaveUpdate(merged);
            showToast('¡Partidas combinadas sin perder nada! 🚀', 'ok', '✨');
          },
        });
        return;
      }

      // Si no hay riesgo, restaurar
      const merged = smartMergeSave(save, cloudSave);
      overlay._cleanup();
      if (onSaveUpdate) onSaveUpdate(merged);
      playVictory();
      showToast('¡Progreso descargado de la nube! 🚀', 'ok', '📥');
    });

    // Fusión inteligente manual
    overlay.querySelector('#cm-btn-smart-merge')?.addEventListener('click', async () => {
      playClick();
      const btn = overlay.querySelector('#cm-btn-smart-merge');
      const msg = overlay.querySelector('#cm-cloud-status-msg');
      if (btn) btn.disabled = true;
      if (msg) {
        msg.textContent = '⏳ Fusionando partidas...';
        msg.style.display = 'block';
        msg.style.color = '#0284C7';
      }

      const res = await fetchProgressFromCloud();
      if (btn) btn.disabled = false;

      if (res.ok && res.data) {
        const merged = smartMergeSave(save, res.data);
        await saveProgressToCloud(merged);
        overlay._cleanup();
        if (onSaveUpdate) onSaveUpdate(merged);
        playVictory();
        showToast('¡Fusión completada! Máximo de estrellas y monedas guardado. ⭐', 'ok', '🔀');
      } else {
        if (msg) {
          msg.textContent = 'No hay partida en la nube para fusionar. Subiremos tu partida actual.';
          msg.style.color = '#16A34A';
        }
        await saveProgressToCloud(save);
      }
    });

    // Cerrar sesión / Salir de cuenta
    overlay.querySelector('#cm-btn-logout')?.addEventListener('click', () => {
      playClick();
      showConfirmModal({
        title: '🚪 ¿SALIR DE TU CUENTA?',
        message: 'Tu partida actual en la nube quedará a salvo. Podrás volver a entrar en cualquier momento con tu Tarjeta de Identidad.',
        confirmText: 'Sí, Salir de la Cuenta',
        cancelText: 'Continuar Jugando',
        onConfirm: async () => {
          const currentSave = getSave ? getSave() : save;
          if (currentSave.user?.student_id) {
            try {
              await saveProgressToCloud(currentSave);
            } catch (_) {}
          }
          await logoutStudent();
          overlay._cleanup();
          if (onLogout) onLogout();
        },
      });
    });

    // Cerrar modal
    overlay.querySelector('#cm-btn-close')?.addEventListener('click', () => {
      playPop();
      overlay._cleanup();
      if (onClose) onClose();
    });
  };

  overlay.innerHTML = _renderModalContent('register');
  document.body.appendChild(overlay);
  _bindEvents();

  return { close: () => overlay._cleanup() };
}

