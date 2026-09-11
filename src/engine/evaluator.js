/**
 * @file evaluator.js — Motor de Evaluación Desacoplado de EduAventura G4
 *
 * SPEC Referencias:
 *   Parámetro 15  — Desacoplamiento Datos-Motor: no contiene referencias a la UI.
 *   Parámetro 47  — Validación numérica mediante MCD para fracciones equivalentes.
 *   Parámetro 56  — Fórmula de asignación de estrellas.
 *   Parámetro 57  — Economía de monedas (10 base + 5 bonus por 3 estrellas).
 *   Parámetro 94  — Aceptar fracciones equivalentes como respuesta válida.
 *   Parámetro 190 — Interfaz: recibe objeto de intento, retorna objeto JSON de resultado.
 */

'use strict';

/**
 * @typedef {Object} AttemptData
 * @property {'fill_keypad'|'multiple_choice'|'drag_drop'|'matching'|'fraction_shape'} type
 * @property {any}    userAnswer   - Respuesta del estudiante.
 * @property {any}    correctAnswer- Respuesta esperada.
 * @property {number} errors       - Errores acumulados en este intento de nivel.
 * @property {number} hints        - Pistas usadas.
 * @property {number} time_sec     - Tiempo de resolución.
 */

/**
 * @typedef {Object} EvaluationResult
 * Parámetro 190 — Objeto de retorno estandarizado.
 * @property {boolean} success          - Si la respuesta es correcta.
 * @property {number}  stars            - Estrellas ganadas (0–3).
 * @property {number}  coinsEarned      - Monedas ganadas en este intento.
 * @property {string}  feedbackMessage  - Mensaje pedagógico para mostrar al estudiante.
 * @property {string}  highlightElement - ID CSS del elemento a resaltar (o '' si ninguno).
 * @property {boolean} isFirstClear     - Si es la primera vez que supera el nivel.
 */

/**
 * Evalúa un intento del estudiante y retorna el resultado completo.
 * No tiene acceso al DOM ni a la UI.
 *
 * @param {AttemptData} attempt
 * @param {boolean} [alreadyCleared=false] - Si el nivel ya fue superado antes.
 * @returns {EvaluationResult}
 */
export function evaluate(attempt, alreadyCleared = false) {
  const isCorrect = _checkAnswer(attempt);

  if (!isCorrect) {
    return {
      success: false,
      stars: 0,
      coinsEarned: 0,
      feedbackMessage: _errorMessage(attempt),
      highlightElement: _errorElement(attempt),
      isFirstClear: false,
    };
  }

  // Parámetro 56: fórmula de estrellas
  const stars = _calcStars(attempt.errors, attempt.hints);

  // Parámetro 57: monedas
  const isFirstClear = !alreadyCleared;
  const coinsEarned = isFirstClear ? (10 + (stars === 3 ? 5 : 0)) : 0;

  return {
    success: true,
    stars,
    coinsEarned,
    feedbackMessage: _successMessage(stars),
    highlightElement: '',
    isFirstClear,
  };
}

// ─── Verificación de respuesta ────────────────────────────────────────────────

/**
 * @param {AttemptData} attempt
 * @returns {boolean}
 */
function _checkAnswer(attempt) {
  const { type, userAnswer, correctAnswer } = attempt;

  switch (type) {
    case 'fill_keypad':
    case 'multiple_choice':
      return Number(userAnswer) === Number(correctAnswer);

    case 'drag_drop':
      // Puede ser un número o una fracción { n, d }
      if (typeof correctAnswer === 'object' && correctAnswer !== null) {
        return _fractionEquals(userAnswer, correctAnswer);
      }
      return Number(userAnswer) === Number(correctAnswer);

    case 'matching':
      // userAnswer: array de pares [{ left, right }]; correctAnswer: igual
      if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false;
      return correctAnswer.every((pair) =>
        userAnswer.some((ua) => ua.left === pair.left && ua.right === pair.right)
      );

    case 'fraction_shape':
      return _fractionEquals(userAnswer, correctAnswer);

    default:
      return false;
  }
}

/**
 * Compara dos fracciones considerando equivalencia (Parámetro 94).
 * Utiliza el MCD para reducir (Parámetro 47).
 *
 * @param {{ n: number, d: number }} a
 * @param {{ n: number, d: number }} b
 * @returns {boolean}
 */
function _fractionEquals(a, b) {
  if (!a || !b || !a.d || !b.d) return false;
  // Simplificar ambas fracciones y comparar
  const [an, ad] = _reduce(a.n, a.d);
  const [bn, bd] = _reduce(b.n, b.d);
  return an === bn && ad === bd;
}

/**
 * Reduce una fracción a su forma mínima usando el MCD.
 * @param {number} n @param {number} d
 * @returns {[number, number]}
 */
function _reduce(n, d) {
  const g = _gcd(Math.abs(n), Math.abs(d));
  return [n / g, d / g];
}

/**
 * Algoritmo de Euclides para el Máximo Común Divisor (Parámetro 47).
 * @param {number} a @param {number} b @returns {number}
 */
function _gcd(a, b) {
  return b === 0 ? a : _gcd(b, a % b);
}

// ─── Parámetro 56: Fórmula de estrellas ──────────────────────────────────────

/**
 * @param {number} errors
 * @param {number} hints
 * @returns {1|2|3}
 */
function _calcStars(errors, hints) {
  if (errors === 0 && hints === 0) return 3;
  if (errors <= 2 && hints <= 1) return 2;
  return 1;
}

// ─── Mensajes pedagógicos (Parámetros 76, 77) ─────────────────────────────────

/** @param {AttemptData} attempt @returns {string} */
function _errorMessage(attempt) {
  // Los mensajes específicos de error se definen por tipo de ejercicio.
  // Los mensajes semánticos detallados (Parámetros 78–81, 97) se inyectan
  // desde el nivel configurado en curriculum_mX.js en la fase de contenidos.
  const generic = [
    '¡Casi lo logras! Revisa tu cálculo e inténtalo de nuevo.',
    '¡Buen intento! Vamos a intentarlo de nuevo.',
    '¡Tú puedes! Observa con cuidado y vuelve a intentarlo.',
  ];
  return generic[Math.floor(Math.random() * generic.length)];
}

/** @param {AttemptData} attempt @returns {string} */
function _errorElement(attempt) {
  return ''; // Se especificará por tipología en fases posteriores
}

/** @param {1|2|3} stars @returns {string} */
function _successMessage(stars) {
  if (stars === 3) return '¡PERFECTO! ¡Eres un campeón de las matemáticas! 🌟🌟🌟';
  if (stars === 2) return '¡MUY BIEN! Sigue practicando para conseguir las 3 estrellas. ⭐⭐';
  return '¡LO LOGRASTE! Cada intento te hace más inteligente. ⭐';
}
