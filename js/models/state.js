// Control para saber en qué pantalla estamos y cambiar de una a otra
'use strict';

// Pantalla en la que estamos ahorita
let _currentState = 'SPLASH';

// Datos del jugador guardados en memoria
let _saveData = null;

// Información extra de la pantalla actual (por ejemplo qué módulo o nivel se abrió)
let _context = {};

// Al iniciar, si el niño aún no ha hecho la prueba inicial lo manda a bienvenida, si ya está listo va al menú
export function initState(saveData) {
  _saveData = saveData || {};

  if (!saveData || !saveData.diagnostics || saveData.diagnostics.pretest_score === null) {
    _transition('WELCOME');
  } else {
    _transition('LOBBY');
  }
}

// Saber en qué pantalla estamos
export function getCurrentState() {
  return _currentState;
}

// Información adicional de la pantalla
export function getContext() {
  return { ..._context };
}

// Obtener los datos guardados del jugador
export function getSaveData() {
  return _saveData;
}

// Actualizar los datos del jugador en memoria
export function setSaveData(data) {
  _saveData = data;
}

// Cambiar de pantalla y avisarle al juego para que muestre la nueva vista
export function transition(newState, context = {}) {
  _transition(newState, context);
}

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
