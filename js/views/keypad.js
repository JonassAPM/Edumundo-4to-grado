// Teclado numérico en pantalla para teléfonos celulares
'use strict';

import { playClick, playPop } from './audio.js';

let _activeKeypad = null;

// Revisa si el jugador está desde un teléfono celular (en PC devuelve false)
export function isMobilePhone() {
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const isPhoneScreen = window.matchMedia && (
    window.matchMedia('(max-width: 950px) and (max-height: 520px)').matches || // Teléfono horizontal
    window.matchMedia('(max-width: 500px)').matches // Teléfono vertical
  );

  return (isMobileUA && hasTouch) || (hasTouch && hasCoarsePointer && isPhoneScreen);
}

// Revisa si la pantalla es táctil
export function isTouchDevice() {
  return isMobilePhone();
}

// Quita el teclado de la pantalla
export function destroyActiveKeypad() {
  if (_activeKeypad) {
    _activeKeypad.destroy();
    _activeKeypad = null;
  }
}

// Saber si el teclado está abierto
export function getActiveKeypad() {
  return _activeKeypad;
}

// Muestra el teclado numérico en la pantalla (solo en celulares)
export function mountKeypad(options) {
  // Quitar el anterior si quedó alguno abierto
  destroyActiveKeypad();

  const {
    targetInput,
    dockContainer,
    floatingContainer = document.body,
    onCheck,
    onInput,
    startMinimized = false,
  } = options;

  if (!targetInput) {
    console.warn('[Keypad] targetInput es requerido para montar el teclado.');
    return {
      destroy() {},
      show() {},
      hide() {},
      toggle() {},
      focusCell() {},
      setValue() {},
      getValue() { return ''; },
    };
  }

  // Evitar que se abra el teclado del celular en la pantalla
  targetInput.setAttribute('inputmode', 'none');
  targetInput.setAttribute('autocomplete', 'off');
  targetInput.setAttribute('autocorrect', 'off');
  targetInput.setAttribute('autocapitalize', 'off');
  targetInput.setAttribute('spellcheck', 'false');
  targetInput.setAttribute('readonly', 'true');

  // Crear los botones del teclado
  const keypadEl = document.createElement('div');
  keypadEl.className = 'arcade-keypad arcade-keypad--visible';
  keypadEl.id = 'arcade-virtual-keypad';
  keypadEl.setAttribute('role', 'region');
  keypadEl.setAttribute('aria-label', 'Teclado Numérico Arcade');

  keypadEl.innerHTML = `
    <div class="arcade-keypad__header">
      <div class="arcade-keypad__title">
        <span class="arcade-keypad__title-icon">🔢</span>
        <span class="arcade-keypad__title-text">NÚMEROS</span>
      </div>
      <button type="button" class="arcade-keypad__min-btn" id="arcade-btn-minimize" title="Ocultar teclado">
        <span class="arcade-min-icon">⌄</span>
      </button>
    </div>

    <!-- Rejilla numérica -->
    <div class="arcade-keypad__grid arcade-keypad__grid--num" id="arcade-grid-num">
      <button type="button" class="arcade-key arcade-key--num" data-k="7">7</button>
      <button type="button" class="arcade-key arcade-key--num" data-k="8">8</button>
      <button type="button" class="arcade-key arcade-key--num" data-k="9">9</button>
      <button type="button" class="arcade-key arcade-key--action arcade-key--backspace" data-k="backspace" title="Borrar último dígito">⌫</button>

      <button type="button" class="arcade-key arcade-key--num" data-k="4">4</button>
      <button type="button" class="arcade-key arcade-key--num" data-k="5">5</button>
      <button type="button" class="arcade-key arcade-key--num" data-k="6">6</button>
      <button type="button" class="arcade-key arcade-key--action arcade-key--clear" data-k="clear" title="Borrar todo">C</button>

      <button type="button" class="arcade-key arcade-key--num" data-k="1">1</button>
      <button type="button" class="arcade-key arcade-key--num" data-k="2">2</button>
      <button type="button" class="arcade-key arcade-key--num" data-k="3">3</button>
      <button type="button" class="arcade-key arcade-key--sym arcade-key--fraction" data-k="/" title="Fracción (/)">/</button>

      <button type="button" class="arcade-key arcade-key--num arcade-key--zero" data-k="0" style="grid-column: span 2">0</button>
      <button type="button" class="arcade-key arcade-key--sym" data-k="." title="Punto decimal (.)">.</button>
      <button type="button" class="arcade-key arcade-key--ok" data-k="ok" title="Comprobar Respuesta">
        <span>✅ OK</span>
      </button>
    </div>
  `;

  // Botón flotante para reabrir el teclado si fue minimizado
  const restorePill = document.createElement('button');
  restorePill.type = 'button';
  restorePill.className = 'arcade-keypad-restore-pill is-hidden';
  restorePill.id = 'arcade-keypad-restore-pill';
  restorePill.setAttribute('title', 'Abrir Teclado Virtual');
  restorePill.innerHTML = `<span>⌨️</span> <span>Teclado</span>`;
  restorePill.style.display = 'none';

  // Insertar teclado en su dock o floating container
  if (dockContainer) {
    dockContainer.innerHTML = '';
    dockContainer.appendChild(keypadEl);
  } else {
    floatingContainer.appendChild(keypadEl);
  }

  // Insertar la pastilla flotante dentro de floatingContainer
  floatingContainer.appendChild(restorePill);

  // Resaltado visual del input activo
  function setInputActiveVisual(active = true) {
    if (active) {
      targetInput.classList.add('is-active-keypad');
      const row = targetInput.closest('.gp-input-row');
      if (row) row.classList.add('is-keypad-focused');
    } else {
      targetInput.classList.remove('is-active-keypad');
      const row = targetInput.closest('.gp-input-row');
      if (row) row.classList.remove('is-keypad-focused');
    }
  }

  // Ocultar o mostrar el botón flotante del teclado
  function syncPillVisibility() {
    const isKeypadOpen = (keypadEl && keypadEl.style.display !== 'none' && (!dockContainer || dockContainer.style.display !== 'none'));
    if (isKeypadOpen) {
      restorePill.style.setProperty('display', 'none', 'important');
      restorePill.classList.add('is-hidden');
    } else {
      restorePill.style.removeProperty('display');
      restorePill.style.display = 'flex';
      restorePill.classList.remove('is-hidden');
    }
  }

  function show() {
    keypadEl.style.display = 'flex';
    if (dockContainer) dockContainer.style.display = 'flex';
    const mainContainer = document.getElementById('gp-main-container');
    if (mainContainer) mainContainer.classList.add('gp-container--has-keypad');
    setInputActiveVisual(true);
    syncPillVisibility();
  }

  function hide() {
    keypadEl.style.display = 'none';
    if (dockContainer) dockContainer.style.display = 'none';
    const mainContainer = document.getElementById('gp-main-container');
    if (mainContainer) mainContainer.classList.remove('gp-container--has-keypad');
    setInputActiveVisual(false);
    syncPillVisibility();
  }

  function toggle() {
    if (keypadEl.style.display === 'none') {
      show();
      playClick();
    } else {
      hide();
      playClick();
    }
  }

  // Qué hacer cuando presiona una tecla
  function handleKey(key) {
    if (!targetInput) return;

    // Vibración suave si el celular lo permite
    if (navigator.vibrate) {
      try { navigator.vibrate(key === 'ok' ? 25 : key === 'clear' ? 18 : 10); } catch (_) {}
    }

    if (key === 'backspace') {
      playPop();
      const cur = targetInput.value || '';
      targetInput.value = cur.slice(0, -1);
      targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      targetInput.dispatchEvent(new Event('change', { bubbles: true }));
      onInput?.(targetInput.value);
      return;
    }

    if (key === 'clear') {
      playPop();
      targetInput.value = '';
      targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      targetInput.dispatchEvent(new Event('change', { bubbles: true }));
      onInput?.('');
      return;
    }

    if (key === 'ok') {
      playPop();
      onCheck?.();
      return;
    }

    // Escribir el número en la casilla
    const curVal = targetInput.value || '';
    if (curVal.length >= 12) {
      playPop();
      return;
    }

    // Evita barras o puntos seguidos
    if ((key === '/' && curVal.endsWith('/')) || (key === '.' && curVal.endsWith('.'))) {
      return;
    }

    playClick();
    targetInput.value = curVal + key;
    targetInput.dispatchEvent(new Event('input', { bubbles: true }));
    targetInput.dispatchEvent(new Event('change', { bubbles: true }));
    onInput?.(targetInput.value);
  }

  // Efecto visual al presionar la tecla
  function flashKeyVisual(keyStr) {
    const btn = keypadEl.querySelector(`[data-k="${keyStr}"]`);
    if (btn) {
      btn.classList.add('is-pressed');
      setTimeout(() => btn.classList.remove('is-pressed'), 120);
    }
  }

  // Detectar qué botón se presionó
  function onKeypadClick(e) {
    const minBtn = e.target.closest('#arcade-btn-minimize');
    if (minBtn) {
      playClick();
      hide();
      return;
    }

    const keyBtn = e.target.closest('.arcade-key');
    if (keyBtn && keyBtn.dataset.k) {
      const k = keyBtn.dataset.k;
      flashKeyVisual(k);
      handleKey(k);
    }
  }

  keypadEl.addEventListener('click', onKeypadClick);
  restorePill.addEventListener('click', () => {
    playClick();
    show();
  });

  // Evita que el celular abra su propio teclado
  function onInputTouch(e) {
    setInputActiveVisual(true);
    e.preventDefault();
    targetInput.blur();
    show();
  }

  targetInput.addEventListener('pointerdown', onInputTouch);
  targetInput.addEventListener('touchstart', onInputTouch, { passive: false });
  targetInput.addEventListener('click', onInputTouch);

  // Si alguien juega con teclado en la compu
  function onWindowKeyDown(e) {
    if (document.querySelector('.modal-backdrop')) return;

    const k = e.key;
    if (k >= '0' && k <= '9') {
      flashKeyVisual(k);
      handleKey(k);
      e.preventDefault();
    } else if (k === '/' || k === '.') {
      flashKeyVisual(k);
      handleKey(k);
      e.preventDefault();
    } else if (k === 'Backspace') {
      flashKeyVisual('backspace');
      handleKey('backspace');
      e.preventDefault();
    } else if (k === 'c' || k === 'C' || k === 'Escape') {
      if (k === 'Escape') {
        hide();
      } else {
        flashKeyVisual('clear');
        handleKey('clear');
      }
      e.preventDefault();
    } else if (k === 'Enter') {
      flashKeyVisual('ok');
      handleKey('ok');
      e.preventDefault();
    }
  }

  window.addEventListener('keydown', onWindowKeyDown);

  // Mostrar u ocultar al inicio
  setInputActiveVisual(false);
  if (startMinimized) {
    hide();
  } else {
    show();
  }

  const instance = {
    destroy() {
      keypadEl.removeEventListener('click', onKeypadClick);
      targetInput.removeEventListener('pointerdown', onInputTouch);
      targetInput.removeEventListener('touchstart', onInputTouch);
      targetInput.removeEventListener('click', onInputTouch);
      window.removeEventListener('keydown', onWindowKeyDown);

      setInputActiveVisual(false);
      const mainContainer = document.getElementById('gp-main-container');
      if (mainContainer) mainContainer.classList.remove('gp-container--has-keypad');

      if (keypadEl.parentElement) keypadEl.remove();
      if (restorePill.parentElement) restorePill.remove();

      if (_activeKeypad === instance) {
        _activeKeypad = null;
      }
    },
    show,
    hide,
    toggle,
    focusCell() {
      setInputActiveVisual(true);
      show();
    },
    setValue(val) {
      if (targetInput) {
        targetInput.value = val;
        targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
    getValue() {
      return targetInput ? targetInput.value : '';
    },
  };

  _activeKeypad = instance;
  return instance;
}
