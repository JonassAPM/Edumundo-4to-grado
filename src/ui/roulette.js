/**
 * @file roulette.js — Ruletas de la Suerte Diarias y con Gemas
 * Ruleta de Monedas (5, 10, 50, 100, 1000)
 * Ruleta de Avatares (Comunes 68.5%, Avanzados 30%, Épicos 1%, Míticos 0.5%)
 * Ruleta de Lemas y Títulos (Comunes 68.5%, Avanzados 30%, Épicos 1%, Míticos 0.5%)
 */

'use strict';

import { STORE_ITEMS, RARITIES } from '../data/store_items.js';
import { playClick, playPop, playUnlock, playVictory, playTick, playRouletteSpinSound } from '../core/audio.js';

export const ROULETTE_TYPES = {
  coins: {
    id: 'coins',
    title: 'Ruleta de Monedas',
    icon: '🪙',
    desc: '¡Gana desde 5 hasta el Gran Premio de 1,000 monedas!',
    sectors: [
      { value: 5, topText: '5', bottomIcon: '🪙', bg: '#16A34A', fontSize: 14 },
      { value: 10, topText: '10', bottomIcon: '🪙', bg: '#0284C7', fontSize: 14 },
      { value: 50, topText: '50', bottomIcon: '🪙', bg: '#F59E0B', fontSize: 14 },
      { value: 100, topText: '100', bottomIcon: '🪙', bg: '#9333EA', fontSize: 13 },
      { value: 1000, topText: '1000', bottomIcon: '👑', bg: '#DC2626', fontSize: 11, isJackpot: true },
      { value: 5, topText: '5', bottomIcon: '🪙', bg: '#16A34A', fontSize: 14 },
      { value: 10, topText: '10', bottomIcon: '🪙', bg: '#0284C7', fontSize: 14 },
      { value: 50, topText: '50', bottomIcon: '🪙', bg: '#F59E0B', fontSize: 14 },
    ],
  },
  avatars: {
    id: 'avatars',
    title: 'Ruleta de Avatares',
    icon: '🐾',
    desc: '¡Desbloquea personajes Comunes, Avanzados, Épicos y Míticos!',
    legend: [
      { sigla: 'C', name: 'Común', icon: '🪙', color: '#16A34A', bg: '#DCFCE7' },
      { sigla: 'A', name: 'Avanzado', icon: '💎', color: '#2563EB', bg: '#DBEAFE' },
      { sigla: 'E', name: 'Épico', icon: '✨', color: '#9333EA', bg: '#F3E8FF' },
      { sigla: 'M', name: 'Mítico', icon: '👑', color: '#D97706', bg: '#FEF3C7' },
    ],
    sectors: [
      { rarity: 'common', topText: 'C', bottomIcon: '🪙', bg: '#16A34A', fontSize: 15 },
      { rarity: 'advanced', topText: 'A', bottomIcon: '💎', bg: '#2563EB', fontSize: 15 },
      { rarity: 'common', topText: 'C', bottomIcon: '🪙', bg: '#16A34A', fontSize: 15 },
      { rarity: 'epic', topText: 'E', bottomIcon: '✨', bg: '#9333EA', fontSize: 15 },
      { rarity: 'common', topText: 'C', bottomIcon: '🪙', bg: '#16A34A', fontSize: 15 },
      { rarity: 'advanced', topText: 'A', bottomIcon: '💎', bg: '#2563EB', fontSize: 15 },
      { rarity: 'mythic', topText: 'M', bottomIcon: '👑', bg: '#D97706', fontSize: 15, isJackpot: true },
      { rarity: 'advanced', topText: 'A', bottomIcon: '💎', bg: '#2563EB', fontSize: 15 },
    ],
  },
  titles: {
    id: 'titles',
    title: 'Ruleta de Lemas y Títulos',
    icon: '🏷️',
    desc: '¡Gana lemas legendarios para lucir en tu perfil!',
    legend: [
      { sigla: 'C', name: 'Común', icon: '🪙', color: '#16A34A', bg: '#DCFCE7' },
      { sigla: 'A', name: 'Avanzado', icon: '💎', color: '#2563EB', bg: '#DBEAFE' },
      { sigla: 'E', name: 'Épico', icon: '✨', color: '#9333EA', bg: '#F3E8FF' },
      { sigla: 'M', name: 'Mítico', icon: '👑', color: '#D97706', bg: '#FEF3C7' },
    ],
    sectors: [
      { rarity: 'common', topText: 'C', bottomIcon: '🪙', bg: '#16A34A', fontSize: 15 },
      { rarity: 'advanced', topText: 'A', bottomIcon: '💎', bg: '#2563EB', fontSize: 15 },
      { rarity: 'common', topText: 'C', bottomIcon: '🪙', bg: '#16A34A', fontSize: 15 },
      { rarity: 'epic', topText: 'E', bottomIcon: '✨', bg: '#9333EA', fontSize: 15 },
      { rarity: 'common', topText: 'C', bottomIcon: '🪙', bg: '#16A34A', fontSize: 15 },
      { rarity: 'advanced', topText: 'A', bottomIcon: '💎', bg: '#2563EB', fontSize: 15 },
      { rarity: 'mythic', topText: 'M', bottomIcon: '👑', bg: '#D97706', fontSize: 15, isJackpot: true },
      { rarity: 'advanced', topText: 'A', bottomIcon: '💎', bg: '#2563EB', fontSize: 15 },
    ],
  },
};

/**
 * Retorna true si el giro diario gratis está disponible (hace más de 24h).
 */
export function isFreeSpinAvailable(type, save) {
  const last = (save.user.roulette_last_spin && save.user.roulette_last_spin[type]) || 0;
  return Date.now() - last >= 24 * 60 * 60 * 1000;
}

/**
 * Retorna el tiempo restante en formato HH:MM:SS para el próximo giro gratis.
 */
export function getTimeUntilNextFreeSpin(type, save) {
  const last = (save.user.roulette_last_spin && save.user.roulette_last_spin[type]) || 0;
  const diff = 24 * 60 * 60 * 1000 - (Date.now() - last);
  if (diff <= 0) return '00:00:00';
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return `${h}h ${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
}

/**
 * Genera el resultado de la ruleta según pesos de probabilidad exactos.
 */
export function drawRouletteResult(type, save) {
  const rand = Math.random() * 100;

  if (type === 'coins') {
    if (rand < 40.0) return { type: 'coins', amount: 5, label: '5 Monedas 🪙', icon: '🪙', rarity: 'common' };
    if (rand < 80.0) return { type: 'coins', amount: 10, label: '10 Monedas 🪙', icon: '🪙', rarity: 'advanced' };
    if (rand < 94.0) return { type: 'coins', amount: 50, label: '50 Monedas 🪙', icon: '🪙', rarity: 'rare' };
    if (rand < 99.5) return { type: 'coins', amount: 100, label: '¡100 Monedas! 🪙', icon: '💰', rarity: 'epic' };
    return { type: 'coins', amount: 1000, label: '👑 ¡PREMIO MAYOR: 1,000 MONEDAS! 👑', icon: '👑', rarity: 'mythic', isJackpot: true };
  }

  if (type === 'avatars') {
    let targetRarity = 'common';
    if (rand < 0.5) targetRarity = 'mythic';
    else if (rand < 1.5) targetRarity = 'epic';
    else if (rand < 31.5) targetRarity = 'advanced';
    else targetRarity = 'common';

    const pool = STORE_ITEMS.filter((it) => it.type === 'avatar' && it.rarity === targetRarity);
    const chosen = pool[Math.floor(Math.random() * pool.length)] || pool[0];
    const owned = (save.user.unlocked_avatars || []).includes(chosen.value);

    return {
      type: 'avatar',
      item: chosen,
      isOwned: owned,
      label: `${chosen.name} (${chosen.value})`,
      icon: chosen.value,
      rarity: targetRarity,
    };
  }

  if (type === 'titles') {
    let targetRarity = 'common';
    if (rand < 0.5) targetRarity = 'mythic';
    else if (rand < 1.5) targetRarity = 'epic';
    else if (rand < 31.5) targetRarity = 'advanced';
    else targetRarity = 'common';

    const pool = STORE_ITEMS.filter((it) => it.type === 'title' && it.rarity === targetRarity);
    const chosen = pool[Math.floor(Math.random() * pool.length)] || pool[0];
    const owned = (save.user.unlocked_titles || []).includes(chosen.value);

    return {
      type: 'title',
      item: chosen,
      isOwned: owned,
      label: chosen.name,
      icon: '🏷️',
      rarity: targetRarity,
    };
  }
}

/**
 * Abre el modal interactivo de giro de ruleta.
 */
export function showRouletteModal({ type, save, onSpinSuccess, onGoToGems }) {
  const cfg = ROULETTE_TYPES[type];
  if (!cfg) return;

  const isFree = isFreeSpinAvailable(type, save);
  const gemsCount = save.user.gems ?? 10;
  const spinCostGems = 6;
  const btnColor = type === 'coins' ? 'btn-gold' : type === 'avatars' ? 'btn-purple' : 'btn-red';

  const overlay = document.createElement('div');
  overlay.className = 'modal-backdrop modal-backdrop--roulette';

  const colors = ['#22C55E', '#0284C7', '#EAB308', '#9333EA', '#EF4444', '#14B8A6', '#F97316', '#6366F1'];
  const labels = type === 'coins'
    ? ['5🪙', '10🪙', '50🪙', '100🪙', '1000👑', '5🪙', '10🪙', '50🪙']
    : ['Común', 'Avanz.', 'Común', 'Épico✨', 'Común', 'Avanz.', 'Mítico👑', 'Avanz.'];

  const cx = 105;
  const cy = 105;
  const r = 96;

  let slicesSvg = '';
  for (let i = 0; i < 8; i++) {
    const sec = cfg.sectors[i];
    const startAngle = (i * 45) * Math.PI / 180;
    const endAngle = ((i + 1) * 45) * Math.PI / 180;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle = ((i + 0.5) * 45) * Math.PI / 180;
    const tx = cx + 62 * Math.cos(midAngle);
    const ty = cy + 62 * Math.sin(midAngle);
    const rot = (i + 0.5) * 45 + 90;

    slicesSvg += `
      <path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z" fill="${sec.bg}" stroke="#0F172A" stroke-width="2.5"/>
      <g transform="translate(${tx}, ${ty}) rotate(${rot})">
        <text x="0" y="-7" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-weight="900" font-size="${sec.fontSize || 14}"
              stroke="#0F172A" stroke-width="2.2" paint-order="stroke fill"
              style="text-shadow:0 1px 3px rgba(0,0,0,0.7);font-family:'Nunito',system-ui,sans-serif">
          ${sec.topText}
        </text>
        <text x="0" y="8" text-anchor="middle" dominant-baseline="central" font-size="12"
              style="font-family:'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif">
          ${sec.bottomIcon}
        </text>
      </g>
    `;
  }

  overlay.innerHTML = `
    <div class="modal-box modal-box--roulette" style="max-width:380px;align-items:center;padding:1.4rem 1rem 1rem;position:relative">
      <button class="modal-close-corner" id="roulette-modal-close" aria-label="Cerrar">✖</button>

      <div class="modal-ribbon modal-ribbon--victory">
        <span>🎰 ${cfg.title.toUpperCase()}</span>
      </div>

      <p class="roulette-modal-desc">
        ${cfg.desc}
      </p>

      <!-- Ruleta con puntero -->
      <div class="roulette-wheel-container">
        <div class="roulette-needle">▼</div>
        <div class="roulette-wheel-disk" id="roulette-wheel-disk">
          <svg viewBox="0 0 210 210" width="100%" height="100%" style="overflow:visible">
            <circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="#0F172A"/>
            ${slicesSvg}
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#0F172A" stroke-width="3"/>
          </svg>
        </div>
        <div class="roulette-center-cap roulette-center-cap--${type}" aria-hidden="true">
          <span class="roulette-center-icon roulette-center-icon--${type}">${cfg.icon}</span>
        </div>
      </div>

      <!-- Leyenda de colores y siglas si aplica -->
      ${cfg.legend ? `
        <div class="roulette-legend-pills" style="display:flex;gap:.3rem;justify-content:center;margin:.2rem 0 .35rem;flex-wrap:wrap">
          ${cfg.legend.map((l) => `
            <span style="font-size:10px;font-weight:900;color:${l.color};background:${l.bg};padding:.1rem .4rem;border-radius:999px;border:1px solid ${l.color}">
              <strong>${l.sigla}</strong>: ${l.name} ${l.icon}
            </span>
          `).join('')}
        </div>
      ` : ''}

      <!-- Estado de saldo y cuenta regresiva -->
      <div class="roulette-status-bar" style="margin-top:.35rem;display:flex;justify-content:space-around;width:100%;font-size:clamp(10.5px,1.3vw,12.5px);font-weight:900">
        <span style="color:#0284C7">💎 Mis Gemas: <strong>${save.user.gems ?? 10}</strong></span>
        ${!isFree ? `<span style="color:#0F172A;font-weight:900">Giro gratis disponible en <strong id="roulette-modal-countdown">${getTimeUntilNextFreeSpin(type, save)}</strong></span>` : ''}
      </div>

      <!-- Acciones de Giro -->
      <div class="modal-actions" style="margin-top:.7rem;width:100%">
        ${isFree ? `
          <button class="btn ${btnColor} btn-lg" id="roulette-btn-spin" style="width:100%">
            🎁 ¡GIRAR GRATIS!
          </button>
        ` : ((save.user.gems ?? 10) >= spinCostGems) ? `
          <button class="btn ${btnColor} btn-lg" id="roulette-btn-spin" style="width:100%">
            💎 Girar (${spinCostGems} Gemas)
          </button>
        ` : `
          <button class="btn btn-gold btn-lg" id="roulette-btn-get-gems" style="width:100%">
            💎 Conseguir Gemas (Tienes ${save.user.gems ?? 10})
          </button>
        `}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  let modalCountdownTimer = null;
  if (!isFree) {
    modalCountdownTimer = setInterval(() => {
      const el = overlay.querySelector('#roulette-modal-countdown');
      if (el) {
        el.textContent = getTimeUntilNextFreeSpin(type, save);
      }
    }, 1000);
  }

  const closeBtn = overlay.querySelector('#roulette-modal-close');
  closeBtn?.addEventListener('click', () => {
    if (modalCountdownTimer) clearInterval(modalCountdownTimer);
    playClick();
    overlay.remove();
  });

  const getGemsBtn = overlay.querySelector('#roulette-btn-get-gems');
  getGemsBtn?.addEventListener('click', () => {
    if (modalCountdownTimer) clearInterval(modalCountdownTimer);
    playPop();
    overlay.remove();
    if (onGoToGems) onGoToGems();
  });

  const spinBtn = overlay.querySelector('#roulette-btn-spin');
  const disk = overlay.querySelector('#roulette-wheel-disk');
  const wheelContainer = overlay.querySelector('.roulette-wheel-container');

  let isSpinning = false;
  let currentWheelRotation = 0;

  spinBtn?.addEventListener('click', () => {
    if (isSpinning) return;

    if (!isFree) {
      if ((save.user.gems ?? 10) < spinCostGems) {
        if (onGoToGems) {
          overlay.remove();
          onGoToGems();
        }
        return;
      }
      save.user.gems = (save.user.gems ?? 10) - spinCostGems;
    } else {
      save.user.roulette_last_spin = save.user.roulette_last_spin || {};
      save.user.roulette_last_spin[type] = Date.now();
    }

    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.style.opacity = '0.6';
    closeBtn.style.display = 'none';

    playClick();

    const res = drawRouletteResult(type, save);

    // Encontrar todos los sectores que coinciden exactamente con el premio obtenido
    const matchingIndices = [];
    cfg.sectors.forEach((sec, idx) => {
      if (type === 'coins') {
        if (sec.value === res.amount) matchingIndices.push(idx);
      } else {
        if (sec.rarity === res.rarity) matchingIndices.push(idx);
      }
    });

    const targetSliceIndex = matchingIndices.length > 0
      ? matchingIndices[Math.floor(Math.random() * matchingIndices.length)]
      : 0;

    // Ángulo que posiciona el centro del sector exactamente en el puntero superior (12 en punto = 270°)
    const targetSectorAngle = (270 - (targetSliceIndex + 0.5) * 45 + 360) % 360;
    // Sutil variación orgánica dentro del sector (±7° para mantenerse seguro dentro de los 45°)
    const jitter = (Math.random() - 0.5) * 14;
    const targetMod = (targetSectorAngle + jitter + 360) % 360;

    const currentMod = currentWheelRotation % 360;
    let forwardDelta = targetMod - currentMod;
    if (forwardDelta <= 0) forwardDelta += 360;

    const extraRounds = 7 + Math.floor(Math.random() * 3); // 7 a 9 giros completos
    currentWheelRotation += extraRounds * 360 + forwardDelta;

    disk.style.transition = 'transform 4.2s cubic-bezier(0.12, 0.95, 0.22, 1)';
    disk.style.transform = `rotate(${currentWheelRotation}deg)`;
    wheelContainer?.classList.add('roulette-wheel-container--spinning');

    // Reproducir audio procedimental de ruleta frenética con ticks y crescendo
    playRouletteSpinSound(4.2);

    setTimeout(() => {
      isSpinning = false;
      wheelContainer?.classList.remove('roulette-wheel-container--spinning');

      let resultTitle = '';
      let resultDesc = '';

      if (res.type === 'coins') {
        save.user.coins += res.amount;
        resultTitle = `+${res.amount} Monedas`;
        resultDesc = res.isJackpot
          ? 'Gran premio de 1,000 monedas obtenido.'
          : 'Monedas añadidas inmediatamente a tu alcancía.';
      } else if (res.type === 'avatar') {
        if (res.isOwned) {
          save.user.coins += 20;
          resultTitle = '¡Rayos! Mejor suerte la próxima';
          resultDesc = `Ya tenías en propiedad a ${res.item.name}. Se te han otorgado +20 🪙 de consuelo.`;
        } else {
          save.user.unlocked_avatars = save.user.unlocked_avatars || ['🧒', '👧'];
          save.user.unlocked_avatars.push(res.item.value);
          resultTitle = '¡Nuevo Avatar Desbloqueado!';
          resultDesc = `¡Felicitaciones! Has obtenido a ${res.item.name}. Ya puedes equiparlo en tu perfil o tienda.`;
        }
      } else if (res.type === 'title') {
        if (res.isOwned) {
          save.user.coins += 20;
          resultTitle = '¡Rayos! Mejor suerte la próxima';
          resultDesc = `Ya tenías en propiedad a ${res.item.name}. Se te han otorgado +20 🪙 de consuelo.`;
        } else {
          save.user.unlocked_titles = save.user.unlocked_titles || ['Novato Matemático'];
          save.user.unlocked_titles.push(res.item.value);
          resultTitle = '¡Nuevo Lema Desbloqueado!';
          resultDesc = `¡Felicitaciones! Has obtenido el lema "${res.item.name}". Ya puedes equiparlo en tu perfil.`;
        }
      }

      const ribbonText = res.isOwned
        ? 'YA EN PROPIEDAD'
        : (res.type === 'coins' && res.isJackpot ? '👑 ¡GRAN PREMIO!' : 'PREMIO OBTENIDO');
      const ribbonClass = res.isOwned ? 'modal-ribbon modal-ribbon--challenge' : 'modal-ribbon modal-ribbon--victory';

      const avBorder = res.type === 'avatar' ? 'avatar-emoji-bordered' : '';
      let iconHtml = `<div class="roulette-reward-icon ${avBorder}" data-avatar="${res.icon}" style="font-size:clamp(38px,5vw,50px);margin:.75rem 0 .3rem;animation:dioramaFloat 2.5s ease-in-out infinite">${res.icon}</div>`;
      if (res.type === 'avatar' && res.rarity !== 'basic') {
        const rarityClass = res.rarity || 'common';
        iconHtml = `
          <div style="display:flex;justify-content:center;align-items:center;margin:1.15rem 0 .75rem;position:relative;z-index:5">
            <div class="avatar-aura-wrap avatar-aura--${rarityClass}" style="transform:scale(1.18);position:relative;z-index:5">
              <span class="aura-spark"></span>
              <span class="aura-spark"></span>
              <span class="aura-spark"></span>
              <span class="aura-spark"></span>
              <span class="aura-spark"></span>
              <span class="aura-front-sheen"></span>
              <div class="roulette-reward-icon ${avBorder}" data-avatar="${res.icon}" style="font-size:clamp(38px,5vw,50px);line-height:1">${res.icon}</div>
            </div>
          </div>
        `;
      }

      // Ventana emergente independiente ENFRENTE de la ruleta (en capa superior)
      const rewardOverlay = document.createElement('div');
      rewardOverlay.className = 'modal-backdrop modal-backdrop--roulette-reward';
      rewardOverlay.style.zIndex = '1200';
      rewardOverlay.innerHTML = `
        <div class="modal-box roulette-reward-box" role="dialog" aria-modal="true" style="max-width:340px;text-align:center;align-items:center;padding:clamp(1rem,2.5vh,1.4rem) 1.2rem;position:relative;z-index:10">
          <div class="${ribbonClass}">
            <span>${ribbonText}</span>
          </div>
          ${iconHtml}
          <h3 class="roulette-reward-title" style="font-size:clamp(15px,1.9vw,18px);font-weight:900;color:#0F172A;margin:.2rem 0;position:relative;z-index:30">${resultTitle}</h3>
          <p class="roulette-reward-desc" style="font-size:clamp(11px,1.3vw,13px);font-weight:700;color:#64748B;margin:.3rem 0 .9rem;line-height:1.35;position:relative;z-index:30">${resultDesc}</p>
          <button class="btn btn-green btn-md" id="roulette-reward-claim-btn" style="width:100%;position:relative;z-index:30">
            ¡GENIAL!
          </button>
        </div>
      `;

      document.body.appendChild(rewardOverlay);

      rewardOverlay.querySelector('#roulette-reward-claim-btn')?.addEventListener('click', () => {
        if (modalCountdownTimer) clearInterval(modalCountdownTimer);
        playPop();
        rewardOverlay.remove();
        overlay.remove();
        if (onSpinSuccess) onSpinSuccess(res);
      });
    }, 4250);
  });
}
