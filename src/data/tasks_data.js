/**
 * @file tasks_data.js — Catálogo Canónico Ampliado de Tareas, Cadenas y Logros de EduAventura G4
 * Total: 61 Tareas y 61 Trofeos distribuidos en 13 Clases de Progreso
 */

'use strict';

export const TASK_CLASSES = [
  {
    id: 'free_mode_mult',
    name: 'Modo Libre: Multiplicación',
    icon: '✖️',
    color: '#F59E0B',
    desc: 'Rachas consecutivas de respuestas veloces en multiplicación',
  },
  {
    id: 'free_mode_div',
    name: 'Modo Libre: División',
    icon: '➗',
    color: '#3B82F6',
    desc: 'Rachas consecutivas de respuestas veloces en división',
  },
  {
    id: 'free_mode_frac',
    name: 'Modo Libre: Fracciones',
    icon: '🍕',
    color: '#8B5CF6',
    desc: 'Rachas consecutivas de respuestas en retos fraccionarios',
  },
  {
    id: 'free_mode_score',
    name: 'Puntuación Récord',
    icon: '⚡',
    color: '#EC4899',
    desc: 'Puntuaciones máximas obtenidas en Modo Libre',
  },
  {
    id: 'campaign_m1',
    name: 'Módulo 1: Multiplicación',
    icon: '🌲',
    color: '#10B981',
    desc: 'Hitos y niveles superados en el Bosque de Tablas',
  },
  {
    id: 'campaign_m2',
    name: 'Módulo 2: División',
    icon: '🏰',
    color: '#06B6D4',
    desc: 'Hitos y niveles superados en el Castillo de Reparto',
  },
  {
    id: 'campaign_m3',
    name: 'Módulo 3: Fracciones I',
    icon: '⛵',
    color: '#6366F1',
    desc: 'Hitos y niveles superados en la Isla de las Partes',
  },
  {
    id: 'campaign_m4',
    name: 'Módulo 4: Fracciones II',
    icon: '🌋',
    color: '#F97316',
    desc: 'Hitos y niveles superados en la Cumbre de Operaciones',
  },
  {
    id: 'stars_hunt',
    name: 'Cazador de Estrellas',
    icon: '⭐',
    color: '#EAB308',
    desc: 'Acumulación de estrellas doradas en la campaña',
  },
  {
    id: 'avatars_collect',
    name: 'Colección de Avatares',
    icon: '🎭',
    color: '#A855F7',
    desc: 'Desbloquea personajes en la tienda y ruletas',
  },
  {
    id: 'titles_collect',
    name: 'Lemas y Títulos Heroicos',
    icon: '📜',
    color: '#14B8A6',
    desc: 'Desbloquea títulos de honor para tu perfil',
  },
  {
    id: 'roulette_spins',
    name: 'Fortuna en las Ruletas',
    icon: '🎰',
    color: '#EF4444',
    desc: 'Prueba tu suerte en las ruletas diarias',
  },
  {
    id: 'coins_bank',
    name: 'Bóveda de Monedas',
    icon: '🪙',
    color: '#D97706',
    desc: 'Acumula riquezas para comprar artículos épicos',
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// 61 TROFEOS Y LOGROS ÚNICOS
// ═════════════════════════════════════════════════════════════════════════════
export const TROPHIES = [
  // 1. Modo Libre: Multiplicación (8)
  { id: 'ach_fm_m5',   title: 'Chispa Numérica',           icon: '⚡',  description: 'Lograste una racha de 5 aciertos en multiplicación.', category: 'Modo Libre' },
  { id: 'ach_fm_m10',  title: 'Velocista Novato',          icon: '⚡',  description: 'Lograste una racha de 10 aciertos en multiplicación.', category: 'Modo Libre' },
  { id: 'ach_fm_m15',  title: 'Relámpago de Tablas',       icon: '🌩️', description: 'Lograste una racha de 15 aciertos en multiplicación.', category: 'Modo Libre' },
  { id: 'ach_fm_m20',  title: 'Rayo de la Multiplicación',  icon: '⚡',  description: 'Lograste una racha de 20 aciertos en multiplicación.', category: 'Modo Libre' },
  { id: 'ach_fm_m30',  title: 'Ninja Imparable',           icon: '🥷',  description: 'Lograste una racha de 30 aciertos en multiplicación.', category: 'Modo Libre' },
  { id: 'ach_fm_m50',  title: 'Dios de las Tablas',         icon: '👑',  description: '¡50 aciertos seguidos en multiplicación sin fallar!', category: 'Modo Libre' },
  { id: 'ach_fm_m75',  title: 'Racha Imposible (75)',       icon: '🔥',  description: '¡75 aciertos seguidos en multiplicación a velocidad extrema!', category: 'Modo Libre' },
  { id: 'ach_fm_m100', title: 'Centurión Legendario (100)', icon: '🏆',  description: '¡100 aciertos seguidos en multiplicación sin un solo fallo!', category: 'Modo Libre' },

  // 2. Modo Libre: División (7)
  { id: 'ach_fm_d5',   title: 'Reparto Rápido',            icon: '➗',  description: 'Lograste una racha de 5 aciertos en división.', category: 'Modo Libre' },
  { id: 'ach_fm_d10',  title: 'Cirujano de Cocientes',      icon: '🎯',  description: 'Lograste una racha de 10 aciertos en división.', category: 'Modo Libre' },
  { id: 'ach_fm_d15',  title: 'Algoritmo Relámpago',       icon: '⚙️',  description: 'Lograste una racha de 15 aciertos en división.', category: 'Modo Libre' },
  { id: 'ach_fm_d25',  title: 'Estratega del Residuo',      icon: '🧠',  description: 'Lograste una racha de 25 aciertos en división.', category: 'Modo Libre' },
  { id: 'ach_fm_d40',  title: 'Gran Maestro Divisor',      icon: '💎',  description: '¡40 divisiones exactas seguidas sin equivocarte!', category: 'Modo Libre' },
  { id: 'ach_fm_d60',  title: 'Matemático Cuántico (60)',   icon: '🔮',  description: '¡60 divisiones seguidas resueltas sin fallar!', category: 'Modo Libre' },
  { id: 'ach_fm_d80',  title: 'Vórtice del Cociente (80)',  icon: '👑',  description: '¡80 divisiones exactas consecutivas con precisión milimétrica!', category: 'Modo Libre' },

  // 3. Modo Libre: Fracciones (7)
  { id: 'ach_fm_f5',   title: 'Media Naranja',             icon: '🍊',  description: 'Lograste una racha de 5 aciertos en fracciones.', category: 'Modo Libre' },
  { id: 'ach_fm_f10',  title: 'Partidor Experto',          icon: '🍕',  description: 'Lograste una racha de 10 aciertos en fracciones.', category: 'Modo Libre' },
  { id: 'ach_fm_f15',  title: 'Arquitecto Fraccionario',    icon: '📐',  description: 'Lograste una racha de 15 aciertos en fracciones.', category: 'Modo Libre' },
  { id: 'ach_fm_f25',  title: 'Poder Homogéneo',           icon: '🔮',  description: 'Lograste una racha de 25 aciertos en fracciones.', category: 'Modo Libre' },
  { id: 'ach_fm_f40',  title: 'Señor del Infinito',        icon: '🌌',  description: '¡40 fracciones resueltas a velocidad suprema!', category: 'Modo Libre' },
  { id: 'ach_fm_f60',  title: 'Mente Fractal (60)',        icon: '💎',  description: '¡60 fracciones seguidas resueltas contra el reloj!', category: 'Modo Libre' },
  { id: 'ach_fm_f80',  title: 'Oráculo Fraccionario (80)', icon: '👑',  description: '¡80 fracciones perfectas seguidas sin equivocarte!', category: 'Modo Libre' },

  // 4. Puntuación Récord en Modo Libre (7)
  { id: 'ach_sc_1k',   title: 'Mil Puntos',                icon: '🏅',  description: 'Alcanzaste 1,000 puntos en una sola partida de Modo Libre.', category: 'Puntos' },
  { id: 'ach_sc_3k',   title: 'Combo Estelar',             icon: '🔥',  description: 'Alcanzaste 3,000 puntos en una sola partida de Modo Libre.', category: 'Puntos' },
  { id: 'ach_sc_6k',   title: 'Furia de Combos',           icon: '💥',  description: 'Alcanzaste 6,000 puntos en una sola partida de Modo Libre.', category: 'Puntos' },
  { id: 'ach_sc_10k',  title: 'Titán de la Puntuación',    icon: '🚀',  description: 'Alcanzaste 10,000 puntos en Modo Libre.', category: 'Puntos' },
  { id: 'ach_sc_20k',  title: 'Leyenda Galáctica',         icon: '👑',  description: '¡Récord histórico de 20,000 puntos en Modo Libre!', category: 'Puntos' },
  { id: 'ach_sc_35k',  title: 'Muro de la Fama (35.000 Pts)', icon: '🌌', description: '¡35,000 puntos conseguidos en una sola partida!', category: 'Puntos' },
  { id: 'ach_sc_50k',  title: 'Semidiós del Cálculo (50.000 Pts)', icon: '🏆', description: '¡Récord legendario de 50,000 puntos en Modo Libre!', category: 'Puntos' },

  // 5. Módulo 1: Multiplicación (5)
  { id: 'ach_m1_5',    title: 'Iniciación Forestal',       icon: '🌱',  description: 'Superaste 5 niveles del Módulo 1.', category: 'Campaña' },
  { id: 'ach_m1_10',   title: 'Sendero Avanzado',          icon: '🌲',  description: 'Superaste 10 niveles del Módulo 1.', category: 'Campaña' },
  { id: 'ach_m1_15',   title: 'Bosque Profundo',           icon: '🏕️',  description: 'Superaste 15 niveles del Módulo 1.', category: 'Campaña' },
  { id: 'ach_m1_all',  title: 'Conquistador de la Multiplicación', icon: '✖️', description: 'Superaste los 20 niveles del Módulo 1.', category: 'Campaña' },
  { id: 'ach_m1_perf', title: 'Perfección del Módulo 1',   icon: '🌟',  description: 'Completaste los 20 niveles del Módulo 1 con 3 ⭐ perfectas (60 ⭐).', category: 'Campaña' },

  // 6. Módulo 2: División (5)
  { id: 'ach_m2_5',    title: 'Primeros Repartos',         icon: '🚪',  description: 'Superaste 5 niveles del Módulo 2.', category: 'Campaña' },
  { id: 'ach_m2_10',   title: 'Asedio al Castillo',        icon: '🏰',  description: 'Superaste 10 niveles del Módulo 2.', category: 'Campaña' },
  { id: 'ach_m2_15',   title: 'Trinchera del Cociente',    icon: '🛡️',  description: 'Superaste 15 niveles del Módulo 2.', category: 'Campaña' },
  { id: 'ach_m2_all',  title: 'Estratega de la División',  icon: '➗',  description: 'Superaste los 20 niveles del Módulo 2.', category: 'Campaña' },
  { id: 'ach_m2_perf', title: 'Perfección del Módulo 2',   icon: '🌟',  description: 'Completaste los 20 niveles del Módulo 2 con 3 ⭐ perfectas (60 ⭐).', category: 'Campaña' },

  // 7. Módulo 3: Fracciones I (5)
  { id: 'ach_m3_5',    title: 'Navegante Costero',         icon: '🌊',  description: 'Superaste 5 niveles del Módulo 3.', category: 'Campaña' },
  { id: 'ach_m3_10',   title: 'Timonel de Porciones',      icon: '⛵',  description: 'Superaste 10 niveles del Módulo 3.', category: 'Campaña' },
  { id: 'ach_m3_15',   title: 'Alta Mar Fraccionaria',     icon: '⚓',  description: 'Superaste 15 niveles del Módulo 3.', category: 'Campaña' },
  { id: 'ach_m3_all',  title: 'Arquitecto de Fracciones',   icon: '🍕',  description: 'Superaste los 20 niveles del Módulo 3.', category: 'Campaña' },
  { id: 'ach_m3_perf', title: 'Perfección del Módulo 3',   icon: '🌟',  description: 'Completaste los 20 niveles del Módulo 3 con 3 ⭐ perfectas (60 ⭐).', category: 'Campaña' },

  // 8. Módulo 4: Fracciones II (5)
  { id: 'ach_m4_5',    title: 'Paso Volcánico',            icon: '🔥',  description: 'Superaste 5 niveles del Módulo 4.', category: 'Campaña' },
  { id: 'ach_m4_10',   title: 'Alquimista de Fracciones',  icon: '⚗️',  description: 'Superaste 10 niveles del Módulo 4.', category: 'Campaña' },
  { id: 'ach_m4_15',   title: 'Cráter de Operaciones',     icon: '🌋',  description: 'Superaste 15 niveles del Módulo 4.', category: 'Campaña' },
  { id: 'ach_m4_all',  title: 'Gran Sabio de Fracciones',  icon: '📐',  description: 'Superaste los 20 niveles del Módulo 4.', category: 'Campaña' },
  { id: 'ach_m4_perf', title: 'Perfección del Módulo 4',   icon: '🌟',  description: 'Completaste los 20 niveles del Módulo 4 con 3 ⭐ perfectas (60 ⭐).', category: 'Campaña' },

  // 9. Cazador de Estrellas Doradas (9)
  { id: 'ach_st_10',   title: 'Brillo Inicial',            icon: '⭐',  description: 'Acumulaste 10 estrellas doradas en la campaña.', category: 'Estrellas' },
  { id: 'ach_st_25',   title: 'Buscador de Estrellas',     icon: '⭐',  description: 'Acumulaste 25 estrellas doradas en la campaña.', category: 'Estrellas' },
  { id: 'ach_st_45',   title: 'Constelación Ninja',        icon: '🌟',  description: 'Acumulaste 45 estrellas doradas en la campaña.', category: 'Estrellas' },
  { id: 'ach_st_70',   title: 'Cielo Radiante',            icon: '✨',  description: 'Acumulaste 70 estrellas doradas en la campaña.', category: 'Estrellas' },
  { id: 'ach_st_95',   title: 'Señor de las Galaxias',     icon: '🌌',  description: 'Acumulaste 95 estrellas doradas en la campaña.', category: 'Estrellas' },
  { id: 'ach_st_120',  title: 'Mitad de la Gloria (120 ⭐)',icon: '🎖️', description: 'Acumulaste 120 estrellas doradas en la campaña.', category: 'Estrellas' },
  { id: 'ach_st_160',  title: 'Constelación Maestra (160 ⭐)', icon: '✨', description: 'Acumulaste 160 estrellas doradas en la campaña.', category: 'Estrellas' },
  { id: 'ach_st_200',  title: 'Resplandor Supremo (200 ⭐)', icon: '🌟', description: 'Acumulaste 200 estrellas doradas en la campaña.', category: 'Estrellas' },
  { id: 'ach_st_240',  title: 'Perfección Absoluta (240 ⭐)', icon: '👑', description: '¡Conseguiste las 240 estrellas doradas de los 80 niveles de campaña!', category: 'Estrellas' },

  // 10. Colección de Avatares (7)
  { id: 'ach_av_3',    title: 'Trío Aventurero',           icon: '🎭',  description: 'Desbloqueaste al menos 3 avatares.', category: 'Colección' },
  { id: 'ach_av_6',    title: 'Armario Épico',             icon: '🎩',  description: 'Desbloqueaste al menos 6 avatares.', category: 'Colección' },
  { id: 'ach_av_10',   title: 'Club de Disfraces',         icon: '🦁',  description: 'Desbloqueaste al menos 10 avatares.', category: 'Colección' },
  { id: 'ach_av_15',   title: 'Gabinete Legendario',       icon: '🥷',  description: 'Desbloqueaste al menos 15 avatares.', category: 'Colección' },
  { id: 'ach_av_20',   title: 'Maestro del Multiverso',    icon: '👑',  description: '¡Desbloqueaste 20 avatares diferentes!', category: 'Colección' },
  { id: 'ach_av_30',   title: 'Guardarropa Legendario (30)', icon: '💎', description: '¡Desbloqueaste al menos 30 avatares diferentes!', category: 'Colección' },
  { id: 'ach_av_45',   title: 'Colección Mítica Total (45)', icon: '🏆', description: '¡Desbloqueaste 45 avatares en la minitienda y ruletas!', category: 'Colección' },

  // 11. Lemas y Títulos Heroicos (6)
  { id: 'ach_ti_2',    title: 'Fama Naciente',             icon: '📜',  description: 'Desbloqueaste al menos 2 títulos para tu perfil.', category: 'Títulos' },
  { id: 'ach_ti_5',    title: 'Voz Respetada',             icon: '🗣️',  description: 'Desbloqueaste al menos 5 títulos para tu perfil.', category: 'Títulos' },
  { id: 'ach_ti_10',   title: 'Biblioteca de Lemas',       icon: '📚',  description: 'Desbloqueaste al menos 10 títulos para tu perfil.', category: 'Títulos' },
  { id: 'ach_ti_15',   title: 'Orador Sagrado',            icon: '👑',  description: '¡Desbloqueaste 15 títulos honoríficos!', category: 'Títulos' },
  { id: 'ach_ti_20',   title: 'Enciclopedia Heroica (20)', icon: '💎',  description: '¡Desbloqueaste al menos 20 títulos para tu perfil!', category: 'Títulos' },
  { id: 'ach_ti_25',   title: 'Voz Inmortal (25)',         icon: '🏆',  description: '¡Desbloqueaste 25 títulos de honor legendarios!', category: 'Títulos' },

  // 12. Fortuna en las Ruletas (7)
  { id: 'ach_sp_1',    title: 'Tiro de la Suerte',         icon: '🎰',  description: 'Giraste tu primera ruleta de la fortuna.', category: 'Ruleta' },
  { id: 'ach_sp_3',    title: 'Rueda Giratoria',           icon: '🎡',  description: 'Giraste las ruletas al menos 3 veces.', category: 'Ruleta' },
  { id: 'ach_sp_7',    title: 'Jugador Frecuente',         icon: '🎲',  description: 'Giraste las ruletas al menos 7 veces.', category: 'Ruleta' },
  { id: 'ach_sp_15',   title: 'Rey de la Suerte',          icon: '🔮',  description: 'Giraste las ruletas al menos 15 veces.', category: 'Ruleta' },
  { id: 'ach_sp_30',   title: 'Favorito del Destino (30)', icon: '👑',  description: '¡30 giros realizados en las ruletas diarias!', category: 'Ruleta' },
  { id: 'ach_sp_50',   title: 'Maestro del Azar (50)',     icon: '💎',  description: '¡Giraste las ruletas al menos 50 veces!', category: 'Ruleta' },
  { id: 'ach_sp_100',  title: 'Rueda Legendaria (100)',    icon: '🏆',  description: '¡100 giros realizados en las ruletas diarias!', category: 'Ruleta' },

  // 13. Bóveda de Monedas (6)
  { id: 'ach_co_250',  title: 'Bolsillo Lleno',            icon: '🪙',  description: 'Ten en tu poder al menos 250 monedas simultáneas.', category: 'Economía' },
  { id: 'ach_co_600',  title: 'Cofre Dorado',              icon: '💰',  description: 'Ten en tu poder al menos 600 monedas simultáneas.', category: 'Economía' },
  { id: 'ach_co_1500', title: 'Banquero Ninja',            icon: '🏦',  description: 'Ten en tu poder al menos 1,500 monedas simultáneas.', category: 'Economía' },
  { id: 'ach_co_3000', title: 'Fortuna de Oro Puro',       icon: '👑',  description: '¡Acumulaste 3,000 monedas en tu tesoro!', category: 'Economía' },
  { id: 'ach_co_5000', title: 'Magnate de Aventuras (5.000 🪙)', icon: '💎', description: '¡Ten en tu poder al menos 5,000 monedas simultáneas!', category: 'Economía' },
  { id: 'ach_co_10000',title: 'Bóveda Imperial (10.000 🪙)',    icon: '🏆', description: '¡Acumulaste 10,000 monedas de oro en tu tesoro personal!', category: 'Economía' },
];

// ═════════════════════════════════════════════════════════════════════════════
// 61 TAREAS PROGRESIVAS DISTRIBUIDAS POR CLASES
// ═════════════════════════════════════════════════════════════════════════════
export const TASKS = [
  // ── 1. Modo Libre: Multiplicación ──
  {
    id: 'task_fm_m5',
    classId: 'free_mode_mult',
    order: 1,
    title: 'Racha Veloz (5)',
    description: 'Logra 5 aciertos seguidos en Modo Libre (Multiplicación)',
    icon: '⚡',
    rewardCoins: 6,
    trophyId: 'ach_fm_m5',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m1_multiplicacion || 0;
      const target = 5;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_m10',
    classId: 'free_mode_mult',
    order: 2,
    title: 'Racha Relámpago (10)',
    description: 'Logra 10 aciertos seguidos en Modo Libre (Multiplicación)',
    icon: '⚡',
    rewardCoins: 12,
    trophyId: 'ach_fm_m10',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m1_multiplicacion || 0;
      const target = 10;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_m15',
    classId: 'free_mode_mult',
    order: 3,
    title: 'Racha de Trueno (15)',
    description: 'Logra 15 aciertos seguidos en Modo Libre (Multiplicación)',
    icon: '🌩️',
    rewardCoins: 20,
    trophyId: 'ach_fm_m15',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m1_multiplicacion || 0;
      const target = 15;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_m20',
    classId: 'free_mode_mult',
    order: 4,
    title: 'Racha Maestra (20)',
    description: 'Logra 20 aciertos seguidos en Modo Libre (Multiplicación)',
    icon: '⚡',
    rewardCoins: 30,
    trophyId: 'ach_fm_m20',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m1_multiplicacion || 0;
      const target = 20;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_m30',
    classId: 'free_mode_mult',
    order: 5,
    title: 'Racha Legendaria (30)',
    description: 'Logra 30 aciertos seguidos en Modo Libre (Multiplicación)',
    icon: '🥷',
    rewardCoins: 45,
    trophyId: 'ach_fm_m30',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m1_multiplicacion || 0;
      const target = 30;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_m50',
    classId: 'free_mode_mult',
    order: 6,
    title: 'Racha Divina (50)',
    description: 'Logra una racha épica de 50 aciertos en Modo Libre',
    icon: '👑',
    rewardCoins: 80,
    trophyId: 'ach_fm_m50',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m1_multiplicacion || 0;
      const target = 50;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_m75',
    classId: 'free_mode_mult',
    order: 7,
    title: 'Racha Imposible (75)',
    description: 'Logra 75 aciertos seguidos en Modo Libre (Multiplicación)',
    icon: '🔥',
    rewardCoins: 115,
    trophyId: 'ach_fm_m75',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m1_multiplicacion || 0;
      const target = 75;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_m100',
    classId: 'free_mode_mult',
    order: 8,
    title: 'Centurión Legendario (100)',
    description: 'Logra la proeza suprema de 100 aciertos seguidos en Multiplicación',
    icon: '🏆',
    rewardCoins: 175,
    trophyId: 'ach_fm_m100',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m1_multiplicacion || 0;
      const target = 100;
      return { current, target, completed: current >= target };
    },
  },

  // ── 2. Modo Libre: División ──
  {
    id: 'task_fm_d5',
    classId: 'free_mode_div',
    order: 1,
    title: 'Reparto Rápido (5)',
    description: 'Logra 5 aciertos seguidos en Modo Libre (División)',
    icon: '➗',
    rewardCoins: 7,
    trophyId: 'ach_fm_d5',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m2_division || 0;
      const target = 5;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_d10',
    classId: 'free_mode_div',
    order: 2,
    title: 'Divisor Preciso (10)',
    description: 'Logra 10 aciertos seguidos en Modo Libre (División)',
    icon: '🎯',
    rewardCoins: 14,
    trophyId: 'ach_fm_d10',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m2_division || 0;
      const target = 10;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_d15',
    classId: 'free_mode_div',
    order: 3,
    title: 'Algoritmo Continuo (15)',
    description: 'Logra 15 aciertos seguidos en Modo Libre (División)',
    icon: '⚙️',
    rewardCoins: 24,
    trophyId: 'ach_fm_d15',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m2_division || 0;
      const target = 15;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_d25',
    classId: 'free_mode_div',
    order: 4,
    title: 'Mente Estratégica (25)',
    description: 'Logra 25 aciertos seguidos en Modo Libre (División)',
    icon: '🧠',
    rewardCoins: 38,
    trophyId: 'ach_fm_d25',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m2_division || 0;
      const target = 25;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_d40',
    classId: 'free_mode_div',
    order: 5,
    title: 'Maestro del Reparto (40)',
    description: 'Logra 40 aciertos seguidos en Modo Libre (División)',
    icon: '💎',
    rewardCoins: 65,
    trophyId: 'ach_fm_d40',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m2_division || 0;
      const target = 40;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_d60',
    classId: 'free_mode_div',
    order: 6,
    title: 'Matemático Cuántico (60)',
    description: 'Logra 60 aciertos seguidos en Modo Libre (División)',
    icon: '🔮',
    rewardCoins: 100,
    trophyId: 'ach_fm_d60',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m2_division || 0;
      const target = 60;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_d80',
    classId: 'free_mode_div',
    order: 7,
    title: 'Vórtice Divisor (80)',
    description: 'Logra 80 aciertos seguidos en Modo Libre (División)',
    icon: '👑',
    rewardCoins: 150,
    trophyId: 'ach_fm_d80',
    getProgress: (save) => {
      const current = save?.user?.best_streaks?.m2_division || 0;
      const target = 80;
      return { current, target, completed: current >= target };
    },
  },

  // ── 3. Modo Libre: Fracciones ──
  {
    id: 'task_fm_f5',
    classId: 'free_mode_frac',
    order: 1,
    title: 'Media Porción (5)',
    description: 'Logra 5 aciertos seguidos en Modo Libre (Fracciones)',
    icon: '🍊',
    rewardCoins: 8,
    trophyId: 'ach_fm_f5',
    getProgress: (save) => {
      const s3 = save?.user?.best_streaks?.m3_fracciones_intro || 0;
      const s4 = save?.user?.best_streaks?.m4_fracciones_ops || 0;
      const current = Math.max(s3, s4);
      const target = 5;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_f10',
    classId: 'free_mode_frac',
    order: 2,
    title: 'Repartidor Ninja (10)',
    description: 'Logra 10 aciertos seguidos en Modo Libre (Fracciones)',
    icon: '🍕',
    rewardCoins: 15,
    trophyId: 'ach_fm_f10',
    getProgress: (save) => {
      const s3 = save?.user?.best_streaks?.m3_fracciones_intro || 0;
      const s4 = save?.user?.best_streaks?.m4_fracciones_ops || 0;
      const current = Math.max(s3, s4);
      const target = 10;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_f15',
    classId: 'free_mode_frac',
    order: 3,
    title: 'Regla y Compás (15)',
    description: 'Logra 15 aciertos seguidos en Modo Libre (Fracciones)',
    icon: '📐',
    rewardCoins: 25,
    trophyId: 'ach_fm_f15',
    getProgress: (save) => {
      const s3 = save?.user?.best_streaks?.m3_fracciones_intro || 0;
      const s4 = save?.user?.best_streaks?.m4_fracciones_ops || 0;
      const current = Math.max(s3, s4);
      const target = 15;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_f25',
    classId: 'free_mode_frac',
    order: 4,
    title: 'Denominador Común (25)',
    description: 'Logra 25 aciertos seguidos en Modo Libre (Fracciones)',
    icon: '🔮',
    rewardCoins: 42,
    trophyId: 'ach_fm_f25',
    getProgress: (save) => {
      const s3 = save?.user?.best_streaks?.m3_fracciones_intro || 0;
      const s4 = save?.user?.best_streaks?.m4_fracciones_ops || 0;
      const current = Math.max(s3, s4);
      const target = 25;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_f40',
    classId: 'free_mode_frac',
    order: 5,
    title: 'Señor del Infinito (40)',
    description: 'Logra 40 aciertos seguidos en Modo Libre (Fracciones)',
    icon: '🌌',
    rewardCoins: 70,
    trophyId: 'ach_fm_f40',
    getProgress: (save) => {
      const s3 = save?.user?.best_streaks?.m3_fracciones_intro || 0;
      const s4 = save?.user?.best_streaks?.m4_fracciones_ops || 0;
      const current = Math.max(s3, s4);
      const target = 40;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_f60',
    classId: 'free_mode_frac',
    order: 6,
    title: 'Mente Fractal (60)',
    description: 'Logra 60 aciertos seguidos en Modo Libre (Fracciones)',
    icon: '💎',
    rewardCoins: 100,
    trophyId: 'ach_fm_f60',
    getProgress: (save) => {
      const s3 = save?.user?.best_streaks?.m3_fracciones_intro || 0;
      const s4 = save?.user?.best_streaks?.m4_fracciones_ops || 0;
      const current = Math.max(s3, s4);
      const target = 60;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_fm_f80',
    classId: 'free_mode_frac',
    order: 7,
    title: 'Oráculo Fraccionario (80)',
    description: 'Logra 80 aciertos seguidos en Modo Libre (Fracciones)',
    icon: '👑',
    rewardCoins: 150,
    trophyId: 'ach_fm_f80',
    getProgress: (save) => {
      const s3 = save?.user?.best_streaks?.m3_fracciones_intro || 0;
      const s4 = save?.user?.best_streaks?.m4_fracciones_ops || 0;
      const current = Math.max(s3, s4);
      const target = 80;
      return { current, target, completed: current >= target };
    },
  },

  // ── 4. Puntuación Récord ──
  {
    id: 'task_sc_1k',
    classId: 'free_mode_score',
    order: 1,
    title: 'Primera Milena (1.000 Pts)',
    description: 'Alcanza 1.000 puntos en cualquier tema de Modo Libre',
    icon: '🏅',
    rewardCoins: 8,
    trophyId: 'ach_sc_1k',
    getProgress: (save) => {
      const scores = Object.values(save?.user?.highscores || {});
      const current = Math.max(0, ...scores);
      const target = 1000;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_sc_3k',
    classId: 'free_mode_score',
    order: 2,
    title: 'Combo Radiante (3.000 Pts)',
    description: 'Alcanza 3.000 puntos en cualquier tema de Modo Libre',
    icon: '🔥',
    rewardCoins: 16,
    trophyId: 'ach_sc_3k',
    getProgress: (save) => {
      const scores = Object.values(save?.user?.highscores || {});
      const current = Math.max(0, ...scores);
      const target = 3000;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_sc_6k',
    classId: 'free_mode_score',
    order: 3,
    title: 'Furia de Combos (6.000 Pts)',
    description: 'Alcanza 6.000 puntos en cualquier tema de Modo Libre',
    icon: '💥',
    rewardCoins: 30,
    trophyId: 'ach_sc_6k',
    getProgress: (save) => {
      const scores = Object.values(save?.user?.highscores || {});
      const current = Math.max(0, ...scores);
      const target = 6000;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_sc_10k',
    classId: 'free_mode_score',
    order: 4,
    title: 'Puntuación Titánica (10.000 Pts)',
    description: 'Alcanza 10.000 puntos en cualquier tema de Modo Libre',
    icon: '🚀',
    rewardCoins: 48,
    trophyId: 'ach_sc_10k',
    getProgress: (save) => {
      const scores = Object.values(save?.user?.highscores || {});
      const current = Math.max(0, ...scores);
      const target = 10000;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_sc_20k',
    classId: 'free_mode_score',
    order: 5,
    title: 'Récord Galáctico (20.000 Pts)',
    description: 'Alcanza 20.000 puntos históricos en Modo Libre',
    icon: '👑',
    rewardCoins: 90,
    trophyId: 'ach_sc_20k',
    getProgress: (save) => {
      const scores = Object.values(save?.user?.highscores || {});
      const current = Math.max(0, ...scores);
      const target = 20000;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_sc_35k',
    classId: 'free_mode_score',
    order: 6,
    title: 'Muro de la Fama (35.000 Pts)',
    description: 'Alcanza 35.000 puntos en cualquier tema de Modo Libre',
    icon: '🌌',
    rewardCoins: 115,
    trophyId: 'ach_sc_35k',
    getProgress: (save) => {
      const scores = Object.values(save?.user?.highscores || {});
      const current = Math.max(0, ...scores);
      const target = 35000;
      return { current, target, completed: current >= target };
    },
  },
  {
    id: 'task_sc_50k',
    classId: 'free_mode_score',
    order: 7,
    title: 'Semidiós del Cálculo (50.000 Pts)',
    description: 'Alcanza la cumbre legendaria de 50.000 puntos en Modo Libre',
    icon: '🏆',
    rewardCoins: 175,
    trophyId: 'ach_sc_50k',
    getProgress: (save) => {
      const scores = Object.values(save?.user?.highscores || {});
      const current = Math.max(0, ...scores);
      const target = 50000;
      return { current, target, completed: current >= target };
    },
  },

  // ── 5. Módulo 1: Multiplicación ──
  {
    id: 'task_m1_5',
    classId: 'campaign_m1',
    order: 1,
    title: 'Avanzada Forestal (5 Niveles)',
    description: 'Supera los primeros 5 niveles del Módulo 1',
    icon: '🌱',
    rewardCoins: 6,
    trophyId: 'ach_m1_5',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m1_multiplicacion?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 5, completed: current >= 5 };
    },
  },
  {
    id: 'task_m1_10',
    classId: 'campaign_m1',
    order: 2,
    title: 'Guerrero de las Tablas (10 Niveles)',
    description: 'Supera 10 niveles del Módulo 1',
    icon: '🌲',
    rewardCoins: 12,
    trophyId: 'ach_m1_10',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m1_multiplicacion?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 10, completed: current >= 10 };
    },
  },
  {
    id: 'task_m1_15',
    classId: 'campaign_m1',
    order: 3,
    title: 'Bosque Profundo (15 Niveles)',
    description: 'Supera 15 niveles del Módulo 1',
    icon: '🏕️',
    rewardCoins: 20,
    trophyId: 'ach_m1_15',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m1_multiplicacion?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 15, completed: current >= 15 };
    },
  },
  {
    id: 'task_m1_all',
    classId: 'campaign_m1',
    order: 4,
    title: 'Conquistar Módulo 1 (20 Niveles)',
    description: 'Supera los 20 niveles completos de Multiplicación',
    icon: '✖️',
    rewardCoins: 35,
    trophyId: 'ach_m1_all',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m1_multiplicacion?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 20, completed: current >= 20 || !!save?.modules?.m1_multiplicacion?.completed };
    },
  },
  {
    id: 'task_m1_perf',
    classId: 'campaign_m1',
    order: 5,
    title: 'Perfección 3⭐ en Módulo 1',
    description: 'Consigue 3 estrellas en los 20 niveles del Módulo 1 (60 ⭐)',
    icon: '🌟',
    rewardCoins: 70,
    trophyId: 'ach_m1_perf',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m1_multiplicacion?.levels || {});
      const current = lvls.filter((l) => l.cleared && l.stars >= 3).length;
      return { current, target: 20, completed: current >= 20 };
    },
  },

  // ── 6. Módulo 2: División ──
  {
    id: 'task_m2_5',
    classId: 'campaign_m2',
    order: 1,
    title: 'Puertas del Castillo (5 Niveles)',
    description: 'Supera los primeros 5 niveles del Módulo 2',
    icon: '🚪',
    rewardCoins: 8,
    trophyId: 'ach_m2_5',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m2_division?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 5, completed: current >= 5 };
    },
  },
  {
    id: 'task_m2_10',
    classId: 'campaign_m2',
    order: 2,
    title: 'Estratega del Cociente (10 Niveles)',
    description: 'Supera 10 niveles del Módulo 2',
    icon: '🏰',
    rewardCoins: 15,
    trophyId: 'ach_m2_10',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m2_division?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 10, completed: current >= 10 };
    },
  },
  {
    id: 'task_m2_15',
    classId: 'campaign_m2',
    order: 3,
    title: 'Trinchera del Cociente (15 Niveles)',
    description: 'Supera 15 niveles del Módulo 2',
    icon: '🛡️',
    rewardCoins: 22,
    trophyId: 'ach_m2_15',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m2_division?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 15, completed: current >= 15 };
    },
  },
  {
    id: 'task_m2_all',
    classId: 'campaign_m2',
    order: 4,
    title: 'Conquistar Módulo 2 (20 Niveles)',
    description: 'Supera los 20 niveles completos de División',
    icon: '➗',
    rewardCoins: 38,
    trophyId: 'ach_m2_all',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m2_division?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 20, completed: current >= 20 || !!save?.modules?.m2_division?.completed };
    },
  },
  {
    id: 'task_m2_perf',
    classId: 'campaign_m2',
    order: 5,
    title: 'Perfección 3⭐ en Módulo 2',
    description: 'Consigue 3 estrellas en los 20 niveles del Módulo 2 (60 ⭐)',
    icon: '🌟',
    rewardCoins: 75,
    trophyId: 'ach_m2_perf',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m2_division?.levels || {});
      const current = lvls.filter((l) => l.cleared && l.stars >= 3).length;
      return { current, target: 20, completed: current >= 20 };
    },
  },

  // ── 7. Módulo 3: Fracciones I ──
  {
    id: 'task_m3_5',
    classId: 'campaign_m3',
    order: 1,
    title: 'Zarpe Costero (5 Niveles)',
    description: 'Supera los primeros 5 niveles del Módulo 3',
    icon: '🌊',
    rewardCoins: 9,
    trophyId: 'ach_m3_5',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m3_fracciones_intro?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 5, completed: current >= 5 };
    },
  },
  {
    id: 'task_m3_10',
    classId: 'campaign_m3',
    order: 2,
    title: 'Navegante de Fracciones (10 Niveles)',
    description: 'Supera 10 niveles del Módulo 3',
    icon: '⛵',
    rewardCoins: 16,
    trophyId: 'ach_m3_10',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m3_fracciones_intro?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 10, completed: current >= 10 };
    },
  },
  {
    id: 'task_m3_15',
    classId: 'campaign_m3',
    order: 3,
    title: 'Alta Mar Fraccionaria (15 Niveles)',
    description: 'Supera 15 niveles del Módulo 3',
    icon: '⚓',
    rewardCoins: 24,
    trophyId: 'ach_m3_15',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m3_fracciones_intro?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 15, completed: current >= 15 };
    },
  },
  {
    id: 'task_m3_all',
    classId: 'campaign_m3',
    order: 4,
    title: 'Conquistar Módulo 3 (20 Niveles)',
    description: 'Supera los 20 niveles completos de Fracciones (Noción)',
    icon: '🍕',
    rewardCoins: 42,
    trophyId: 'ach_m3_all',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m3_fracciones_intro?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 20, completed: current >= 20 || !!save?.modules?.m3_fracciones_intro?.completed };
    },
  },
  {
    id: 'task_m3_perf',
    classId: 'campaign_m3',
    order: 5,
    title: 'Perfección 3⭐ en Módulo 3',
    description: 'Consigue 3 estrellas en los 20 niveles del Módulo 3 (60 ⭐)',
    icon: '🌟',
    rewardCoins: 80,
    trophyId: 'ach_m3_perf',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m3_fracciones_intro?.levels || {});
      const current = lvls.filter((l) => l.cleared && l.stars >= 3).length;
      return { current, target: 20, completed: current >= 20 };
    },
  },

  // ── 8. Módulo 4: Fracciones II ──
  {
    id: 'task_m4_5',
    classId: 'campaign_m4',
    order: 1,
    title: 'Sendero de Lava (5 Niveles)',
    description: 'Supera los primeros 5 niveles del Módulo 4',
    icon: '🔥',
    rewardCoins: 10,
    trophyId: 'ach_m4_5',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m4_fracciones_ops?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 5, completed: current >= 5 };
    },
  },
  {
    id: 'task_m4_10',
    classId: 'campaign_m4',
    order: 2,
    title: 'Alquimia Operacional (10 Niveles)',
    description: 'Supera 10 niveles del Módulo 4',
    icon: '⚗️',
    rewardCoins: 18,
    trophyId: 'ach_m4_10',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m4_fracciones_ops?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 10, completed: current >= 10 };
    },
  },
  {
    id: 'task_m4_15',
    classId: 'campaign_m4',
    order: 3,
    title: 'Cráter de Operaciones (15 Niveles)',
    description: 'Supera 15 niveles del Módulo 4',
    icon: '🌋',
    rewardCoins: 25,
    trophyId: 'ach_m4_15',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m4_fracciones_ops?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 15, completed: current >= 15 };
    },
  },
  {
    id: 'task_m4_all',
    classId: 'campaign_m4',
    order: 4,
    title: 'Conquistar Módulo 4 (20 Niveles)',
    description: 'Supera los 20 niveles de Operaciones con Fracciones',
    icon: '📐',
    rewardCoins: 45,
    trophyId: 'ach_m4_all',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m4_fracciones_ops?.levels || {});
      const current = lvls.filter((l) => l.cleared).length;
      return { current, target: 20, completed: current >= 20 || !!save?.modules?.m4_fracciones_ops?.completed };
    },
  },
  {
    id: 'task_m4_perf',
    classId: 'campaign_m4',
    order: 5,
    title: 'Perfección 3⭐ en Módulo 4',
    description: 'Consigue 3 estrellas en los 20 niveles del Módulo 4 (60 ⭐)',
    icon: '🌟',
    rewardCoins: 85,
    trophyId: 'ach_m4_perf',
    getProgress: (save) => {
      const lvls = Object.values(save?.modules?.m4_fracciones_ops?.levels || {});
      const current = lvls.filter((l) => l.cleared && l.stars >= 3).length;
      return { current, target: 20, completed: current >= 20 };
    },
  },

  // ── 9. Cazador de Estrellas Doradas ──
  {
    id: 'task_st_10',
    classId: 'stars_hunt',
    order: 1,
    title: 'Primeras Estrellas (10 ⭐)',
    description: 'Acumula al menos 10 estrellas en la campaña',
    icon: '⭐',
    rewardCoins: 6,
    trophyId: 'ach_st_10',
    getProgress: (save) => {
      const current = save?.user?.stars_total || 0;
      return { current, target: 10, completed: current >= 10 };
    },
  },
  {
    id: 'task_st_25',
    classId: 'stars_hunt',
    order: 2,
    title: 'Constelación Ninja (25 ⭐)',
    description: 'Acumula al menos 25 estrellas en la campaña',
    icon: '⭐',
    rewardCoins: 12,
    trophyId: 'ach_st_25',
    getProgress: (save) => {
      const current = save?.user?.stars_total || 0;
      return { current, target: 25, completed: current >= 25 };
    },
  },
  {
    id: 'task_st_45',
    classId: 'stars_hunt',
    order: 3,
    title: 'Resplandor Dorado (45 ⭐)',
    description: 'Acumula al menos 45 estrellas en la campaña',
    icon: '🌟',
    rewardCoins: 24,
    trophyId: 'ach_st_45',
    getProgress: (save) => {
      const current = save?.user?.stars_total || 0;
      return { current, target: 45, completed: current >= 45 };
    },
  },
  {
    id: 'task_st_70',
    classId: 'stars_hunt',
    order: 4,
    title: 'Cielo Radiante (70 ⭐)',
    description: 'Acumula al menos 70 estrellas en la campaña',
    icon: '✨',
    rewardCoins: 35,
    trophyId: 'ach_st_70',
    getProgress: (save) => {
      const current = save?.user?.stars_total || 0;
      return { current, target: 70, completed: current >= 70 };
    },
  },
  {
    id: 'task_st_95',
    classId: 'stars_hunt',
    order: 5,
    title: 'Señor de las Galaxias (95 ⭐)',
    description: 'Acumula al menos 95 estrellas en la campaña',
    icon: '🌌',
    rewardCoins: 55,
    trophyId: 'ach_st_95',
    getProgress: (save) => {
      const current = save?.user?.stars_total || 0;
      return { current, target: 95, completed: current >= 95 };
    },
  },
  {
    id: 'task_st_120',
    classId: 'stars_hunt',
    order: 6,
    title: 'Mitad de la Gloria (120 ⭐)',
    description: 'Acumula al menos 120 estrellas doradas en la campaña',
    icon: '🎖️',
    rewardCoins: 80,
    trophyId: 'ach_st_120',
    getProgress: (save) => {
      const current = save?.user?.stars_total || 0;
      return { current, target: 120, completed: current >= 120 };
    },
  },
  {
    id: 'task_st_160',
    classId: 'stars_hunt',
    order: 7,
    title: 'Constelación Maestra (160 ⭐)',
    description: 'Acumula al menos 160 estrellas doradas en la campaña',
    icon: '✨',
    rewardCoins: 100,
    trophyId: 'ach_st_160',
    getProgress: (save) => {
      const current = save?.user?.stars_total || 0;
      return { current, target: 160, completed: current >= 160 };
    },
  },
  {
    id: 'task_st_200',
    classId: 'stars_hunt',
    order: 8,
    title: 'Resplandor Supremo (200 ⭐)',
    description: 'Acumula al menos 200 estrellas doradas en la campaña',
    icon: '🌟',
    rewardCoins: 130,
    trophyId: 'ach_st_200',
    getProgress: (save) => {
      const current = save?.user?.stars_total || 0;
      return { current, target: 200, completed: current >= 200 };
    },
  },
  {
    id: 'task_st_240',
    classId: 'stars_hunt',
    order: 9,
    title: 'Perfección Absoluta (240 ⭐)',
    description: '¡Consigue las 240 estrellas doradas de los 80 niveles de campaña!',
    icon: '👑',
    rewardCoins: 200,
    trophyId: 'ach_st_240',
    getProgress: (save) => {
      const current = save?.user?.stars_total || 0;
      return { current, target: 240, completed: current >= 240 };
    },
  },

  // ── 10. Colección de Avatares ──
  {
    id: 'task_av_3',
    classId: 'avatars_collect',
    order: 1,
    title: 'Trío Aventurero (3 Avatares)',
    description: 'Desbloquea al menos 3 avatares en la tienda o ruleta',
    icon: '🎭',
    rewardCoins: 8,
    trophyId: 'ach_av_3',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_avatars || []).length;
      return { current, target: 3, completed: current >= 3 };
    },
  },
  {
    id: 'task_av_6',
    classId: 'avatars_collect',
    order: 2,
    title: 'Armario Épico (6 Avatares)',
    description: 'Desbloquea al menos 6 avatares en la tienda o ruleta',
    icon: '🎩',
    rewardCoins: 18,
    trophyId: 'ach_av_6',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_avatars || []).length;
      return { current, target: 6, completed: current >= 6 };
    },
  },
  {
    id: 'task_av_10',
    classId: 'avatars_collect',
    order: 3,
    title: 'Club de Disfraces (10 Avatares)',
    description: 'Desbloquea al menos 10 avatares',
    icon: '🦁',
    rewardCoins: 30,
    trophyId: 'ach_av_10',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_avatars || []).length;
      return { current, target: 10, completed: current >= 10 };
    },
  },
  {
    id: 'task_av_15',
    classId: 'avatars_collect',
    order: 4,
    title: 'Gabinete Legendario (15 Avatares)',
    description: 'Desbloquea al menos 15 avatares',
    icon: '🥷',
    rewardCoins: 45,
    trophyId: 'ach_av_15',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_avatars || []).length;
      return { current, target: 15, completed: current >= 15 };
    },
  },
  {
    id: 'task_av_20',
    classId: 'avatars_collect',
    order: 5,
    title: 'Multiverso de Avatares (20 Avatares)',
    description: 'Desbloquea al menos 20 avatares',
    icon: '👑',
    rewardCoins: 70,
    trophyId: 'ach_av_20',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_avatars || []).length;
      return { current, target: 20, completed: current >= 20 };
    },
  },
  {
    id: 'task_av_30',
    classId: 'avatars_collect',
    order: 6,
    title: 'Guardarropa Legendario (30 Avatares)',
    description: 'Desbloquea al menos 30 avatares diferentes',
    icon: '💎',
    rewardCoins: 100,
    trophyId: 'ach_av_30',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_avatars || []).length;
      return { current, target: 30, completed: current >= 30 };
    },
  },
  {
    id: 'task_av_45',
    classId: 'avatars_collect',
    order: 7,
    title: 'Colección Mítica Total (45 Avatares)',
    description: 'Desbloquea 45 avatares en la minitienda y ruletas',
    icon: '🏆',
    rewardCoins: 175,
    trophyId: 'ach_av_45',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_avatars || []).length;
      return { current, target: 45, completed: current >= 45 };
    },
  },

  // ── 11. Lemas y Títulos Heroicos ──
  {
    id: 'task_ti_2',
    classId: 'titles_collect',
    order: 1,
    title: 'Fama Naciente (2 Títulos)',
    description: 'Desbloquea al menos 2 títulos para tu perfil',
    icon: '📜',
    rewardCoins: 7,
    trophyId: 'ach_ti_2',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_titles || []).length;
      return { current, target: 2, completed: current >= 2 };
    },
  },
  {
    id: 'task_ti_5',
    classId: 'titles_collect',
    order: 2,
    title: 'Voz Respetada (5 Títulos)',
    description: 'Desbloquea al menos 5 títulos para tu perfil',
    icon: '🗣️',
    rewardCoins: 16,
    trophyId: 'ach_ti_5',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_titles || []).length;
      return { current, target: 5, completed: current >= 5 };
    },
  },
  {
    id: 'task_ti_10',
    classId: 'titles_collect',
    order: 3,
    title: 'Biblioteca de Lemas (10 Títulos)',
    description: 'Desbloquea al menos 10 títulos para tu perfil',
    icon: '📚',
    rewardCoins: 32,
    trophyId: 'ach_ti_10',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_titles || []).length;
      return { current, target: 10, completed: current >= 10 };
    },
  },
  {
    id: 'task_ti_15',
    classId: 'titles_collect',
    order: 4,
    title: 'Orador Sagrado (15 Títulos)',
    description: 'Desbloquea al menos 15 títulos para tu perfil',
    icon: '👑',
    rewardCoins: 55,
    trophyId: 'ach_ti_15',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_titles || []).length;
      return { current, target: 15, completed: current >= 15 };
    },
  },
  {
    id: 'task_ti_20',
    classId: 'titles_collect',
    order: 5,
    title: 'Enciclopedia Heroica (20 Títulos)',
    description: 'Desbloquea al menos 20 títulos para tu perfil',
    icon: '💎',
    rewardCoins: 85,
    trophyId: 'ach_ti_20',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_titles || []).length;
      return { current, target: 20, completed: current >= 20 };
    },
  },
  {
    id: 'task_ti_25',
    classId: 'titles_collect',
    order: 6,
    title: 'Voz Inmortal (25 Títulos)',
    description: 'Desbloquea 25 títulos de honor legendarios',
    icon: '🏆',
    rewardCoins: 150,
    trophyId: 'ach_ti_25',
    getProgress: (save) => {
      const current = (save?.user?.unlocked_titles || []).length;
      return { current, target: 25, completed: current >= 25 };
    },
  },

  // ── 12. Fortuna en las Ruletas ──
  {
    id: 'task_sp_1',
    classId: 'roulette_spins',
    order: 1,
    title: 'Tiro de la Suerte (1 Giro)',
    description: 'Realiza tu primer giro en cualquier ruleta',
    icon: '🎰',
    rewardCoins: 6,
    trophyId: 'ach_sp_1',
    getProgress: (save) => {
      const current = save?.user?.total_spins || 0;
      return { current, target: 1, completed: current >= 1 };
    },
  },
  {
    id: 'task_sp_3',
    classId: 'roulette_spins',
    order: 2,
    title: 'Rueda Giratoria (3 Giros)',
    description: 'Gira las ruletas al menos 3 veces',
    icon: '🎡',
    rewardCoins: 12,
    trophyId: 'ach_sp_3',
    getProgress: (save) => {
      const current = save?.user?.total_spins || 0;
      return { current, target: 3, completed: current >= 3 };
    },
  },
  {
    id: 'task_sp_7',
    classId: 'roulette_spins',
    order: 3,
    title: 'Jugador Frecuente (7 Giros)',
    description: 'Gira las ruletas al menos 7 veces',
    icon: '🎲',
    rewardCoins: 24,
    trophyId: 'ach_sp_7',
    getProgress: (save) => {
      const current = save?.user?.total_spins || 0;
      return { current, target: 7, completed: current >= 7 };
    },
  },
  {
    id: 'task_sp_15',
    classId: 'roulette_spins',
    order: 4,
    title: 'Rey de la Suerte (15 Giros)',
    description: 'Gira las ruletas al menos 15 veces',
    icon: '🔮',
    rewardCoins: 40,
    trophyId: 'ach_sp_15',
    getProgress: (save) => {
      const current = save?.user?.total_spins || 0;
      return { current, target: 15, completed: current >= 15 };
    },
  },
  {
    id: 'task_sp_30',
    classId: 'roulette_spins',
    order: 5,
    title: 'Favorito del Destino (30 Giros)',
    description: 'Gira las ruletas al menos 30 veces',
    icon: '👑',
    rewardCoins: 70,
    trophyId: 'ach_sp_30',
    getProgress: (save) => {
      const current = save?.user?.total_spins || 0;
      return { current, target: 30, completed: current >= 30 };
    },
  },
  {
    id: 'task_sp_50',
    classId: 'roulette_spins',
    order: 6,
    title: 'Maestro del Azar (50 Giros)',
    description: 'Gira las ruletas al menos 50 veces',
    icon: '💎',
    rewardCoins: 100,
    trophyId: 'ach_sp_50',
    getProgress: (save) => {
      const current = save?.user?.total_spins || 0;
      return { current, target: 50, completed: current >= 50 };
    },
  },
  {
    id: 'task_sp_100',
    classId: 'roulette_spins',
    order: 7,
    title: 'Rueda Legendaria (100 Giros)',
    description: 'Realiza 100 giros en las ruletas diarias',
    icon: '🏆',
    rewardCoins: 175,
    trophyId: 'ach_sp_100',
    getProgress: (save) => {
      const current = save?.user?.total_spins || 0;
      return { current, target: 100, completed: current >= 100 };
    },
  },

  // ── 13. Bóveda de Monedas ──
  {
    id: 'task_co_250',
    classId: 'coins_bank',
    order: 1,
    title: 'Bolsillo Lleno (250 🪙)',
    description: 'Acumula al menos 250 monedas simultáneas',
    icon: '🪙',
    rewardCoins: 8,
    trophyId: 'ach_co_250',
    getProgress: (save) => {
      const current = save?.user?.coins || 0;
      return { current, target: 250, completed: current >= 250 };
    },
  },
  {
    id: 'task_co_600',
    classId: 'coins_bank',
    order: 2,
    title: 'Cofre Dorado (600 🪙)',
    description: 'Acumula al menos 600 monedas simultáneas',
    icon: '💰',
    rewardCoins: 20,
    trophyId: 'ach_co_600',
    getProgress: (save) => {
      const current = save?.user?.coins || 0;
      return { current, target: 600, completed: current >= 600 };
    },
  },
  {
    id: 'task_co_1500',
    classId: 'coins_bank',
    order: 3,
    title: 'Banquero Ninja (1.500 🪙)',
    description: 'Acumula al menos 1,500 monedas simultáneas',
    icon: '🏦',
    rewardCoins: 40,
    trophyId: 'ach_co_1500',
    getProgress: (save) => {
      const current = save?.user?.coins || 0;
      return { current, target: 1500, completed: current >= 1500 };
    },
  },
  {
    id: 'task_co_3000',
    classId: 'coins_bank',
    order: 4,
    title: 'Fortuna de Oro Puro (3.000 🪙)',
    description: 'Acumula al menos 3,000 monedas simultáneas',
    icon: '👑',
    rewardCoins: 80,
    trophyId: 'ach_co_3000',
    getProgress: (save) => {
      const current = save?.user?.coins || 0;
      return { current, target: 3000, completed: current >= 3000 };
    },
  },
  {
    id: 'task_co_5000',
    classId: 'coins_bank',
    order: 5,
    title: 'Magnate de Aventuras (5.000 🪙)',
    description: 'Acumula al menos 5,000 monedas simultáneas',
    icon: '💎',
    rewardCoins: 115,
    trophyId: 'ach_co_5000',
    getProgress: (save) => {
      const current = save?.user?.coins || 0;
      return { current, target: 5000, completed: current >= 5000 };
    },
  },
  {
    id: 'task_co_10000',
    classId: 'coins_bank',
    order: 6,
    title: 'Bóveda Imperial (10.000 🪙)',
    description: 'Acumula una fortuna histórica de 10,000 monedas en tu tesoro',
    icon: '🏆',
    rewardCoins: 200,
    trophyId: 'ach_co_10000',
    getProgress: (save) => {
      const current = save?.user?.coins || 0;
      return { current, target: 10000, completed: current >= 10000 };
    },
  },
];

/**
 * Retorna las tareas organizadas por clase según el progreso del usuario.
 * @param {any} save
 * @returns {Array<{ classInfo: any, completedTasks: any[], activeTask: any|null, isAllDone: boolean }>}
 */
export function getOrganizedTasks(save) {
  const claimed = new Set(save?.user?.claimed_tasks || []);

  return TASK_CLASSES.map((cls) => {
    const classTasks = TASKS.filter((t) => t.classId === cls.id).sort((a, b) => a.order - b.order);
    const completedTasks = classTasks.filter((t) => claimed.has(t.id));
    const activeTask = classTasks.find((t) => !claimed.has(t.id)) || null;

    return {
      classInfo: cls,
      completedTasks,
      activeTask,
      isAllDone: !activeTask && completedTasks.length > 0,
    };
  });
}

/**
 * Retorna la cantidad de tareas listas para reclamar.
 * @param {any} save
 * @returns {number}
 */
export function getClaimableTasksCount(save) {
  const claimed = new Set(save?.user?.claimed_tasks || []);
  let count = 0;
  for (const cls of TASK_CLASSES) {
    const activeTask = TASKS.filter((t) => t.classId === cls.id)
      .sort((a, b) => a.order - b.order)
      .find((t) => !claimed.has(t.id));
    if (activeTask) {
      const prog = activeTask.getProgress(save);
      if (prog.completed) count++;
    }
  }
  return count;
}
