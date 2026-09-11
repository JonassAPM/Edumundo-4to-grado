/**
 * @file state.js — Máquina de Estados Finita (FSM) de EduAventura G4
 *
 * SPEC Referencia:
 *   Parámetro 12 — Mapeo de Rutas Basado en Estados Internos.
 *   Estados: 'MODULE_SELECT' | 'GAMEPLAY' | 'SUMMARY'
 */

'use strict';

/**
 * @typedef {'LOBBY' | 'MODULE_SELECT' | 'LEVEL_BOARD' | 'GAMEPLAY' | 'FREE_MODE' | 'STORE' | 'SUMMARY' | 'SPLASH' | 'WELCOME' | 'GUIDE' | 'SETTINGS' | 'TEACHER'} AppStateKey
 */

/** @type {AppStateKey} */
let _currentState = 'SPLASH';

/** @type {import('./storage.js').SaveData | null} */
let _saveData = null;

/**
 * Contexto adicional de la pantalla activa (ej. módulo y nivel seleccionado).
 * @type {Record<string, any>}
 */
let _context = {};

/**
 * Inicializa la FSM con los datos de guardado cargados del localStorage.
 * Determina la pantalla de entrada según el estado del progreso.
 *
 * @param {import('./storage.js').SaveData} saveData
 */
export function initState(saveData) {
  _saveData = saveData;

  if (saveData.diagnostics.pretest_score === null) {
    _transition('WELCOME');
  } else {
    _transition('LOBBY');
  }
}

/**
 * Retorna el estado actual de la FSM.
 * @returns {AppStateKey}
 */
export function getCurrentState() {
  return _currentState;
}

/**
 * Retorna el contexto del estado actual.
 * @returns {Record<string, any>}
 */
export function getContext() {
  return { ..._context };
}

/**
 * Retorna los datos de guardado activos.
 * @returns {import('./storage.js').SaveData | null}
 */
export function getSaveData() {
  return _saveData;
}

/**
 * Actualiza los datos de guardado internos (después de persistir en storage).
 * @param {import('./storage.js').SaveData} data
 */
export function setSaveData(data) {
  _saveData = data;
}

/**
 * Transiciona la aplicación a un nuevo estado.
 * Emite el evento personalizado 'eduaventura:statechange' en window
 * para que los módulos de UI reaccionen.
 *
 * @param {AppStateKey} newState
 * @param {Record<string, any>} [context={}]
 */
export function transition(newState, context = {}) {
  _transition(newState, context);
}

/** @private */
function _transition(newState, context = {}) {
  const prevState = _currentState;
  _currentState = newState;
  _context = context;

  window.dispatchEvent(
    new CustomEvent('eduaventura:statechange', {
      detail: { from: prevState, to: newState, context },
    })
  );
}
