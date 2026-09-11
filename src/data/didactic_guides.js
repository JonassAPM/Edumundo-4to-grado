/**
 * @file didactic_guides.js — Guías Didácticas Interactivas para EduAventura G4
 * 4 Guías Estratégicas por Módulo (Nivel 1, 6, 11 y 16) para 20 Niveles Totales
 */

'use strict';

export const DIDACTIC_GUIDES = {
  // ═════════════════════════════════════════════════════════════════════════════
  // MÓDULO 1: MULTIPLICACIÓN (Tablas y Grupos Iguales)
  // ═════════════════════════════════════════════════════════════════════════════
  m1_multiplicacion: {
    1: {
      badge: '🌟 Concepto Fundamental (Niveles 1 al 5)',
      title: '¡El Poder de los Grupos Iguales!',
      mascot: '🦁',
      mascotMsg: '¡Bienvenido aventurero! Multiplicar no es memorizar de memoria sin sentido: ¡es sumar súper rápido cosas que vienen en paquetes con la misma cantidad!',
      steps: [
        {
          num: '1',
          text: 'Imagina que tienes <strong>3 cajas</strong> y en cada caja colocas <strong>4 mangos</strong>.',
        },
        {
          num: '2',
          text: 'Podrías sumar <code>4 + 4 + 4 = 12</code>... ¡pero toma más tiempo!',
        },
        {
          num: '3',
          text: 'En vez de eso dices: <strong>3 veces 4</strong>, que se escribe <code>3 × 4 = 12</code>.',
        },
      ],
      visualHtml: `
        <div class="dg-visual-grid">
          <div class="dg-group-box"><span class="dg-group-tag">Caja 1</span>🥭🥭🥭🥭</div>
          <div class="dg-group-box"><span class="dg-group-tag">Caja 2</span>🥭🥭🥭🥭</div>
          <div class="dg-group-box"><span class="dg-group-tag">Caja 3</span>🥭🥭🥭🥭</div>
        </div>
        <div class="dg-equation-highlight">3 grupos × 4 mangos = <strong>12 mangos en total</strong></div>
      `,
      trick: '¡Cuenta cuántos grupos hay y multiplícalos por lo que tiene cada grupo adentro!',
    },

    6: {
      badge: '⚡ Mayor Dificultad (Niveles 6 al 10)',
      title: '¡Tablas Medias y la Ley del Espejo!',
      mascot: '🦊',
      mascotMsg: '¡Atención! Del nivel 6 en adelante los números crecen (tablas del 6, 7 y 8). Si una tabla parece difícil, ¡aplica la Ley del Espejo!',
      steps: [
        {
          num: '1',
          text: 'El orden de los números <strong>NO cambia el resultado final</strong> (propiedad conmutativa).',
        },
        {
          num: '2',
          text: 'Si te cuesta calcular <code>7 × 4</code>, dale la vuelta a tu mente: <code>4 × 7 = 28</code>.',
        },
        {
          num: '3',
          text: 'Los problemas ahora tienen enunciados más largos con situaciones de tiendas y granjas.',
        },
      ],
      visualHtml: `
        <div class="dg-mirror-box">
          <div class="dg-mirror-side"><strong>4 filas</strong> de 7 ⭐ = 28</div>
          <div class="dg-mirror-arrow">🔄</div>
          <div class="dg-mirror-side"><strong>7 columnas</strong> de 4 ⭐ = 28</div>
        </div>
      `,
      trick: '¡El orden de los factores no altera el producto! Si una multiplicación te traba, gírala.',
    },

    11: {
      badge: '🔥 Reto Avanzado (Niveles 11 al 15)',
      title: '¡Descomposición y Factores Mayores!',
      mascot: '🐯',
      mascotMsg: '¡Aquí sube la vara! Multiplicarás números de 2 cifras por 1 cifra (como 12 × 4 o 15 × 3). ¡El truco es desarmar el número!',
      steps: [
        {
          num: '1',
          text: 'Para <code>14 × 3</code>, desarma el 14 en <strong>10 + 4</strong>.',
        },
        {
          num: '2',
          text: 'Multiplica cada parte: <code>10 × 3 = 30</code> y <code>4 × 3 = 12</code>.',
        },
        {
          num: '3',
          text: 'Suma los dos resultados en tu mente: <code>30 + 12 = 42</code>. ¡Infalible!',
        },
      ],
      visualHtml: `
        <div class="dg-tens-box">
          14 × 3 = (10 × 3) + (4 × 3) = 30 + 12 = <strong style="color:#2ECC71">42</strong> 🎯
        </div>
      `,
      trick: 'Separa en decenas fáciles (10, 20...) y unidades. Multiplica cada una y suma los trozos.',
    },

    16: {
      badge: '👑 Rango Maestro (Niveles 16 al 20)',
      title: '¡Desafíos de Doble Paso y Jefe Supremo!',
      mascot: '👑',
      mascotMsg: '¡Has alcanzado la zona de maestría! Del nivel 16 al 20 los problemas requieren razonar en dos pasos antes de dar la respuesta final.',
      steps: [
        { num: '1', text: 'Lee la pregunta dos veces: identifica los datos principales y qué te están pidiendo exactamente.' },
        { num: '2', text: 'Calcula mentalmente con descomposición y haz una verificación rápida antes de comprobar.' },
        { num: '3', text: '¡Vence el Nivel 20 para coronarte con la Corona Real de Multiplicación!' },
      ],
      visualHtml: `
        <div class="dg-boss-banner">👑 CAMINO AL JEFE SUPREMO: REY DE LAS TABLAS 🦁</div>
      `,
      trick: '¡Sin prisas! En los niveles 16 a 20 la precisión y la concentración otorgan las 3 estrellas de oro.',
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // MÓDULO 2: DIVISIÓN (Repartos y Algoritmos)
  // ═════════════════════════════════════════════════════════════════════════════
  m2_division: {
    1: {
      badge: '🌟 Concepto Fundamental (Niveles 1 al 5)',
      title: '¡El Arte de Repartir en Partes Iguales!',
      mascot: '🏺',
      mascotMsg: '¡Bienvenido al Desierto! Dividir significa ser justo: darle exactamente la misma cantidad a cada amigo o grupo sin que nadie tenga más.',
      steps: [
        { num: '1', text: 'Tienes un total de objetos a repartir (llamado <strong>Dividendo</strong>).' },
        { num: '2', text: 'Decides entre cuántos recipientes o personas repartirás (el <strong>Divisor</strong>).' },
        { num: '3', text: 'El resultado (<strong>Cociente</strong>) es cuántos le tocan a cada uno.' },
      ],
      visualHtml: `
        <div class="dg-visual-grid">
          <div class="dg-group-box"><span class="dg-group-tag">Bolsa 1</span>🍊🍊🍊</div>
          <div class="dg-group-box"><span class="dg-group-tag">Bolsa 2</span>🍊🍊🍊</div>
          <div class="dg-group-box"><span class="dg-group-tag">Bolsa 3</span>🍊🍊🍊</div>
        </div>
        <div class="dg-equation-highlight">9 naranjas ÷ 3 bolsas = <strong>3 naranjas en cada bolsa</strong></div>
      `,
      trick: '¡Pregúntate siempre: "¿Cuántas cosas le tocan a cada uno para que todos queden iguales?"!',
    },

    6: {
      badge: '⚡ Mayor Dificultad (Niveles 6 al 10)',
      title: '¡La Conexión Inversa con la Multiplicación!',
      mascot: '🦊',
      mascotMsg: '¡Del 6 al 10 los dividendos son mayores (hasta 54)! El secreto ninja es pensar en la tabla de multiplicar al revés.',
      steps: [
        { num: '1', text: 'Si el problema dice <code>42 ÷ 6 = ?</code>...' },
        { num: '2', text: 'Pregúntate de inmediato: <em>"¿Qué número multiplicado por 6 da exactamente 42?"</em>' },
        { num: '3', text: '¡Claro! <code>6 × 7 = 42</code>, por lo tanto <code>42 ÷ 6 = 7</code>.' },
      ],
      visualHtml: `
        <div class="dg-mirror-box">
          <div class="dg-mirror-side">6 × <strong>7</strong> = 42</div>
          <div class="dg-mirror-arrow">⇄</div>
          <div class="dg-mirror-side">42 ÷ 6 = <strong>7</strong></div>
        </div>
      `,
      trick: '¡Viaja hacia atrás en la tabla de multiplicar! Quien sabe multiplicar ya sabe dividir.',
    },

    11: {
      badge: '🔥 Reto Avanzado (Niveles 11 al 15)',
      title: '¡Repartiendo Cantidades Grandes!',
      mascot: '🏺',
      mascotMsg: '¡Aquí los números llegan hasta 90! Para resolver divisiones grandes sin papel, desarma el número en trozos que conozcas de memoria.',
      steps: [
        { num: '1', text: 'Para <code>72 ÷ 6</code>, separa el 72 en <code>60 + 12</code>.' },
        { num: '2', text: 'Divide cada trozo: <code>60 ÷ 6 = 10</code> y <code>12 ÷ 6 = 2</code>.' },
        { num: '3', text: 'Suma los resultados: <code>10 + 2 = 12</code>. ¡Resultado perfecto!' },
      ],
      visualHtml: `
        <div class="dg-tens-box">
          72 ÷ 6 = (60 ÷ 6) + (12 ÷ 6) = 10 + 2 = <strong style="color:#E67E22">12</strong> 🎯
        </div>
      `,
      trick: 'Busca el múltiplo de 10 más cercano del divisor y luego divide lo que sobre.',
    },

    16: {
      badge: '👑 Rango Maestro (Niveles 16 al 20)',
      title: '¡El Guardián del Oasis y Algoritmos!',
      mascot: '👑',
      mascotMsg: '¡Niveles finales del reino desértico! Problemas de la vida real con repartos equitativos y verificación rigurosa.',
      steps: [
        { num: '1', text: 'Identifica claramente quién reparte, qué se reparte y entre cuántos.' },
        { num: '2', text: 'Comprueba siempre: Cociente × Divisor debe ser exactamente el Dividendo.' },
        { num: '3', text: '¡Supera el Nivel 20 para coronarte Maestro de la División!' },
      ],
      visualHtml: `
        <div class="dg-boss-banner">🏜️ JEFE DEL OASIS: GUARDIÁN DE LAS PIRÁMIDES 👑</div>
      `,
      trick: '¡Multiplica tu respuesta por el divisor antes de presionar Enviar para asegurar 3 estrellas!',
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // MÓDULO 3: FRACCIONES I (Noción y Representación)
  // ═════════════════════════════════════════════════════════════════════════════
  m3_fracciones_intro: {
    1: {
      badge: '🌟 Concepto Fundamental (Niveles 1 al 5)',
      title: '¡Anatomía de una Fracción!',
      mascot: '🌾',
      mascotMsg: '¡Llegamos a la Granja! Una fracción representa las partes de un todo que fue dividido en partes exactamente iguales.',
      steps: [
        { num: '1', text: 'El número de <strong>abajo (Denominador)</strong> indica en cuántas partes iguales se cortó el objeto.' },
        { num: '2', text: 'El número de <strong>arriba (Numerador)</strong> indica cuántas de esas partes se tomaron o se comieron.' },
      ],
      visualHtml: `
        <div class="dg-fraction-demo">
          <div class="dg-frac-card">
            <span class="dg-frac-top">3</span>
            <span class="dg-frac-bar"></span>
            <span class="dg-frac-bot">4</span>
          </div>
          <div class="dg-frac-desc">
            <p><strong>3 (Numerador):</strong> Tomaste 3 porciones 🍫</p>
            <p><strong>4 (Denominador):</strong> Había 4 partes iguales en total</p>
          </div>
        </div>
      `,
      trick: '¡El de abajo divide la fiesta, el de arriba es tu plato!',
    },

    6: {
      badge: '⚡ Mayor Dificultad (Niveles 6 al 10)',
      title: '¡Medios, Tercios, Cuartos y Sextos!',
      mascot: '🍎',
      mascotMsg: '¡Del nivel 6 en adelante aumentan los denominadores! No te dejes engañar: un número más grande abajo no significa una porción más grande.',
      steps: [
        { num: '1', text: 'Si cortas una torta en 2 pedazos (<code>1/2</code>), cada pedazo es ENORME.' },
        { num: '2', text: 'Si la cortas en 8 pedazos (<code>1/8</code>), cada pedazo es mucho más PEQUEÑO.' },
        { num: '3', text: '¡A mayor denominador, más personas comen y más chiquito es el pedazo!' },
      ],
      visualHtml: `
        <div class="dg-visual-grid">
          <div class="dg-group-box"><span class="dg-group-tag">1/2 Torta</span>🍰🍰 (Grande)</div>
          <div class="dg-group-box"><span class="dg-group-tag">1/6 Torta</span>🧁 (Pequeño)</div>
        </div>
      `,
      trick: '¡Cuidado visual! 1/2 es más grande que 1/4 y 1/8 porque se repartió entre menos personas.',
    },

    11: {
      badge: '🔥 Reto Avanzado (Niveles 11 al 15)',
      title: '¡Partes que Faltan vs Partes Tomadas!',
      mascot: '🌾',
      mascotMsg: '¡Aquí los problemas ponen a prueba tu comprensión lectora! Te preguntarán tanto por lo que se comió como por lo que quedó en la bandeja.',
      steps: [
        { num: '1', text: 'Si una pizza tiene 8 porciones y se comen 5 porciones (<code>5/8</code>)...' },
        { num: '2', text: '¿Cuántas porciones QUEDAN? Pues <code>8 - 5 = 3</code>, es decir, <code>3/8</code>.' },
        { num: '3', text: 'Lee muy bien la pregunta: ¿te piden lo consumido o lo restante?' },
      ],
      visualHtml: `
        <div class="dg-tens-box">
          🍕 8/8 en total &nbsp;➡&nbsp; Comieron 5/8 &nbsp;➡&nbsp; Quedan <strong style="color:#9B59B6">3/8</strong> 🎯
        </div>
      `,
      trick: '¡La suma de lo que tomaste y lo que quedó siempre debe dar el total de partes (el entero)!',
    },

    16: {
      badge: '👑 Rango Maestro (Niveles 16 al 20)',
      title: '¡El Granero de Oro de Fracciones!',
      mascot: '👑',
      mascotMsg: '¡Última etapa de la granja! Del 16 al 20 los problemas combinan diagramas visuales y números mixtos básicos.',
      steps: [
        { num: '1', text: 'Cuenta primero el total de divisiones para saber el denominador.' },
        { num: '2', text: 'Cuenta con cuidado las secciones coloreadas o seleccionadas.' },
        { num: '3', text: '¡Vence el Nivel 20 para consagrarte Gran Granjero Ninja!' },
      ],
      visualHtml: `
        <div class="dg-boss-banner">🌾 JEFE DEL MOLINO: ESPANTAPÁJAROS SUPREMO 👑</div>
      `,
      trick: '¡Asegúrate de que todas las partes sean de igual tamaño antes de contar!',
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // MÓDULO 4: FRACCIONES II (Operaciones Homogéneas)
  // ═════════════════════════════════════════════════════════════════════════════
  m4_fracciones_ops: {
    1: {
      badge: '🌟 Concepto Fundamental (Niveles 1 al 5)',
      title: '¡Suma de Fracciones con la Misma Base!',
      mascot: '🚀',
      mascotMsg: '¡Bienvenidos a la Estación Cósmica! Sumar fracciones con el mismo denominador es tan fácil como contar caramelos.',
      steps: [
        { num: '1', text: '¡Regla de oro cósmica: el número de <strong>abajo (Denominador) NUNCA se suma</strong>!' },
        { num: '2', text: 'Solo se suman los números de arriba (los Numeradores).' },
        { num: '3', text: 'Ejemplo: <code>2/5 + 1/5 = 3/5</code> (¡NUNCA 3/10!).' },
      ],
      visualHtml: `
        <div class="dg-fraction-demo">
          <div class="dg-frac-card">
            <span class="dg-frac-top">2 + 1</span>
            <span class="dg-frac-bar"></span>
            <span class="dg-frac-bot">5</span>
          </div>
          <div class="dg-frac-desc">
            <p><strong>¡Arriba se suma!:</strong> 2 + 1 = 3</p>
            <p><strong>¡Abajo no cambia!:</strong> Sigue siendo 5</p>
          </div>
        </div>
      `,
      trick: '¡El denominador solo nombra la familia (quintos, sextos). Solo sumas la cantidad de arriba!',
    },

    6: {
      badge: '⚡ Mayor Dificultad (Niveles 6 al 10)',
      title: '¡Restas en el Espacio Exterior!',
      mascot: '🪐',
      mascotMsg: '¡Del nivel 6 al 10 entran las restas de combustible cósmico! La regla es idéntica a la suma.',
      steps: [
        { num: '1', text: 'Si tienes <code>5/7</code> de energía y usas <code>2/7</code>...' },
        { num: '2', text: 'Resta únicamente arriba: <code>5 - 2 = 3</code>.' },
        { num: '3', text: 'El denominador se mantiene idéntico: quedan <code>3/7</code>.' },
      ],
      visualHtml: `
        <div class="dg-tens-box">
          🪐 5/7 - 2/7 = (5 - 2) / 7 = <strong style="color:#3498DB">3/7</strong> 🛸
        </div>
      `,
      trick: 'Resta arriba con calma, deja abajo el mismo número de la familia.',
    },

    11: {
      badge: '🔥 Reto Avanzado (Niveles 11 al 15)',
      title: '¡El Entero Completo y Operaciones de 3 Términos!',
      mascot: '🛸',
      mascotMsg: '¡Del 11 al 15 sumarás 3 fracciones juntas (1/8 + 2/8 + 3/8) y aprenderás el poder del entero!',
      steps: [
        { num: '1', text: 'Para <code>1/8 + 2/8 + 3/8</code>, suma todos los numeradores: <code>1 + 2 + 3 = 6</code>.' },
        { num: '2', text: 'El resultado es <code>6/8</code>.' },
        { num: '3', text: 'Cuando el numerador es igual al denominador (<code>8/8</code>), ¡tienes <strong>1 Entero completo</strong>!' },
      ],
      visualHtml: `
        <div class="dg-tens-box">
          1/8 + 2/8 + 3/8 = 6/8 &nbsp;|&nbsp; 8/8 = <strong style="color:#3498DB">1 ENTERO (100%)</strong> 🌟
        </div>
      `,
      trick: '¡Si sumas tres fracciones homogéneas, suma los 3 números de arriba y conserva el de abajo!',
    },

    16: {
      badge: '👑 Rango Maestro (Niveles 16 al 20)',
      title: '¡Comandante Supremo de la Flota Cósmica!',
      mascot: '👑',
      mascotMsg: '¡El examen definitivo de 4.° grado! Problemas combinados con situaciones espaciales reales y doble operación.',
      steps: [
        { num: '1', text: 'Lee el problema con atención: puede pedirte sumar y luego restar de la unidad.' },
        { num: '2', text: 'Verifica mentalmente cada operación antes de comprobar.' },
        { num: '3', text: '¡Vence el Nivel 20 y gradúate con honores como Comandante de EduAventura!' },
      ],
      visualHtml: `
        <div class="dg-boss-banner">🌌 JEFE FINAL: LA NAVE NODRIZA EDUAVENTURA 🚀</div>
      `,
      trick: '¡Has dominado multiplicación, división y fracciones! Confía en tu talento y sé constante.',
    },
  },
};

/**
 * Obtiene la guía didáctica correspondiente a un módulo y nivel.
 * Si el nivel no tiene una guía exacta, busca el hito anterior (16, 11, 6 o 1).
 */
export function getDidacticGuide(mk, lv) {
  const modGuides = DIDACTIC_GUIDES[mk];
  if (!modGuides) return null;

  if (modGuides[lv]) return modGuides[lv];

  const milestones = [16, 11, 6, 1];
  for (const m of milestones) {
    if (lv >= m && modGuides[m]) {
      return modGuides[m];
    }
  }

  return modGuides[1] || null;
}

/** Determina si un nivel debe disparar automáticamente la guía pedagógica */
export function shouldAutoShowGuide(lv) {
  return lv === 1 || lv === 6 || lv === 11 || lv === 16;
}
