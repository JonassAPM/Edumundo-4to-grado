/**
 * @file store_items.js — Catálogo Completo de la Minitienda de Aventuras
 * Categorías: Básicos, Comunes, Avanzados, Épicos, Míticos (Sin pestaña "Todos")
 * Precios calibrados y ampliada variedad de Avatares (47) y Lemas (26)
 */

'use strict';

export const RARITIES = {
  basic:    { name: 'Básicos',   color: '#0284C7', bg: '#E0F2FE', border: '#0369A1' },
  common:   { name: 'Comunes',   color: '#16A34A', bg: '#DCFCE7', border: '#15803D' },
  advanced: { name: 'Avanzados', color: '#2563EB', bg: '#DBEAFE', border: '#1D4ED8' },
  epic:     { name: 'Épicos',    color: '#9333EA', bg: '#F3E8FF', border: '#7E22CE' },
  mythic:   { name: 'Míticos',   color: '#D97706', bg: '#FEF3C7', border: '#B45309' },
};

export const STORE_ITEMS = [
  // ═════════════════════════════════════════════════════════════════════════════
  // AVATARES (47 TOTAL: 2 Básicos, 15 Comunes, 15 Avanzados, 10 Épicos, 5 Míticos)
  // ═════════════════════════════════════════════════════════════════════════════

  // ─── Básicos (Iniciales gratis) ─────────────────────────────────────────────
  { id: 'av_mateo', type: 'avatar', rarity: 'basic', value: '🧒', name: 'Mateo', description: 'Aventurero curioso.', price: 0 },
  { id: 'av_sofia', type: 'avatar', rarity: 'basic', value: '👧', name: 'Sofía', description: 'Calculadora brillante.', price: 0 },

  // ─── Comunes (15) ───────────────────────────────────────────────────────────
  { id: 'av_dog',     type: 'avatar', rarity: 'common', value: '🐶', name: 'Firulais',   description: 'Fiel amigo de los números.', price: 105 },
  { id: 'av_cat',     type: 'avatar', rarity: 'common', value: '🐱', name: 'Michi',       description: 'Ágil con los cálculos rápidos.', price: 105 },
  { id: 'av_frog',    type: 'avatar', rarity: 'common', value: '🐸', name: 'Ranita',      description: 'Salta de tabla en tabla.', price: 110 },
  { id: 'av_rabbit',  type: 'avatar', rarity: 'common', value: '🐰', name: 'Tambor',      description: 'Velocidad pura en sumas.', price: 110 },
  { id: 'av_bear',    type: 'avatar', rarity: 'common', value: '🐻', name: 'Osito',       description: 'Fuerza mental constante.', price: 115 },
  { id: 'av_chick',   type: 'avatar', rarity: 'common', value: '🐥', name: 'Pollito',     description: 'Pequeño pero muy despierto.', price: 115 },
  { id: 'av_duck',    type: 'avatar', rarity: 'common', value: '🦆', name: 'Patito',      description: 'Navega en aguas numéricas.', price: 120 },
  { id: 'av_pig',     type: 'avatar', rarity: 'common', value: '🐷', name: 'Cerdito',     description: 'Ahorrador de monedas.', price: 120 },
  { id: 'av_cow',     type: 'avatar', rarity: 'common', value: '🐮', name: 'Vaquita',     description: 'Tranquilidad al operar.', price: 125 },
  { id: 'av_sheep',   type: 'avatar', rarity: 'common', value: '🐑', name: 'Ovejita',     description: 'Cuenta ovejas sin sueño.', price: 125 },
  { id: 'av_mouse',   type: 'avatar', rarity: 'common', value: '🐭', name: 'Ratoncito',   description: 'Se escabulle de las trampas.', price: 130 },
  { id: 'av_penguin', type: 'avatar', rarity: 'common', value: '🐧', name: 'Pingüino',    description: 'Cálculo frío y preciso.', price: 135 },
  { id: 'av_turtle',  type: 'avatar', rarity: 'common', value: '🐢', name: 'Tortuguita',  description: 'Lenta pero segura al 100%.', price: 140 },
  { id: 'av_hamster', type: 'avatar', rarity: 'common', value: '🐹', name: 'Hámster',     description: 'Rueda sin parar por el 10.', price: 145 },
  { id: 'av_hedgehog',type: 'avatar', rarity: 'common', value: '🦔', name: 'Erizo',       description: 'Protegido ante el error.', price: 150 },

  // ─── Avanzados (15) ────────────────────────────────────────────────────────
  { id: 'av_koala',   type: 'avatar', rarity: 'advanced', value: '🐨', name: 'Koala Zen',   description: 'Calma ante problemas difíciles.', price: 250 },
  { id: 'av_panda',   type: 'avatar', rarity: 'advanced', value: '🐼', name: 'Panda Sabio', description: 'Maestro de la paciencia.', price: 250 },
  { id: 'av_fox',     type: 'avatar', rarity: 'advanced', value: '🦊', name: 'Zorro Astuto',description: 'Encuentra atajos al instante.', price: 260 },
  { id: 'av_lion',    type: 'avatar', rarity: 'advanced', value: '🦁', name: 'León Real',   description: 'El rey de la jungla matemática.', price: 270 },
  { id: 'av_tiger',   type: 'avatar', rarity: 'advanced', value: '🐯', name: 'Tigre Ágil',  description: 'Zarpazo en multiplicaciones.', price: 280 },
  { id: 'av_wolf',    type: 'avatar', rarity: 'advanced', value: '🐺', name: 'Lobo Guía',   description: 'Lidera la manada con lógica.', price: 280 },
  { id: 'av_owl',     type: 'avatar', rarity: 'advanced', value: '🦉', name: 'Búho Sabio',  description: 'Visión aguda en divisiones.', price: 290 },
  { id: 'av_eagle',   type: 'avatar', rarity: 'advanced', value: '🦅', name: 'Águila Real', description: 'Enfoca la respuesta desde lo alto.', price: 300 },
  { id: 'av_parrot',  type: 'avatar', rarity: 'advanced', value: '🦜', name: 'Loro Sabio',  description: 'Repite tablas de memoria.', price: 300 },
  { id: 'av_dolphin', type: 'avatar', rarity: 'advanced', value: '🐬', name: 'Delfín',      description: 'Salto acrobático fraccionario.', price: 310 },
  { id: 'av_whale',   type: 'avatar', rarity: 'advanced', value: '🐳', name: 'Ballena',     description: 'Grandes números sin temor.', price: 310 },
  { id: 'av_octopus', type: 'avatar', rarity: 'advanced', value: '🐙', name: 'Pulpo Multi', description: '8 brazos para 8 operaciones.', price: 320 },
  { id: 'av_monkey',  type: 'avatar', rarity: 'advanced', value: '🐵', name: 'Mono Genio',  description: 'Agilidad mental selvática.', price: 320 },
  { id: 'av_raccoon', type: 'avatar', rarity: 'advanced', value: '🦝', name: 'Mapache',     description: 'Lava las fracciones sucias.', price: 330 },
  { id: 'av_badger',  type: 'avatar', rarity: 'advanced', value: '🦡', name: 'Tejón Bravo', description: 'Determinación blindada.', price: 330 },

  // ─── Épicos (10) ───────────────────────────────────────────────────────────
  { id: 'av_robot',   type: 'avatar', rarity: 'epic', value: '🤖', name: 'Ciberbot-4',  description: 'Procesador cuántico infalible.', price: 520 },
  { id: 'av_ninja',   type: 'avatar', rarity: 'epic', value: '🥷', name: 'Ninja Sombra',description: 'Sigilo y precisión extrema.', price: 540 },
  { id: 'av_wizard',  type: 'avatar', rarity: 'epic', value: '🧙‍♂️', name: 'Mago Arcano',  description: 'Conjura soluciones mágicas.', price: 560 },
  { id: 'av_witch',   type: 'avatar', rarity: 'epic', value: '🧙‍♀️', name: 'Hechicera',   description: 'Pociones de fracciones exactas.', price: 580 },
  { id: 'av_knight',  type: 'avatar', rarity: 'epic', value: '🤺', name: 'Espadachín',  description: 'Corta problemas en mitades.', price: 590 },
  { id: 'av_unicorn', type: 'avatar', rarity: 'epic', value: '🦄', name: 'Unicornio',   description: 'Poder estelar homogéneo.', price: 610 },
  { id: 'av_alien',   type: 'avatar', rarity: 'epic', value: '🛸', name: 'Alienígena',  description: 'Tecnología de otra galaxia.', price: 630 },
  { id: 'av_trex',    type: 'avatar', rarity: 'epic', value: '🦖', name: 'T-Rex Fósil', description: 'Fuerza jurásica para operar.', price: 650 },
  { id: 'av_yeti',    type: 'avatar', rarity: 'epic', value: '🦍', name: 'Yeti Titán',  description: 'Congela las equivocaciones.', price: 660 },
  { id: 'av_cybero',  type: 'avatar', rarity: 'epic', value: '👾', name: 'Pixel Glitch',description: 'Hackea la matriz de ejercicios.', price: 680 },

  // ─── Míticos (5) ───────────────────────────────────────────────────────────
  { id: 'av_dragon',  type: 'avatar', rarity: 'mythic', value: '🐉', name: 'Dragón Dorado', description: 'La leyenda suprema de Aguachica.', price: 1500 },
  { id: 'av_king',    type: 'avatar', rarity: 'mythic', value: '👑', name: 'Rey Supremo',   description: 'Gobernante absoluto del 4.° grado.', price: 1750 },
  { id: 'av_phoenix', type: 'avatar', rarity: 'mythic', value: '⚡', name: 'Fénix Rayo',    description: 'Renace con cada racha perfecta.', price: 2000 },
  { id: 'av_rocket',  type: 'avatar', rarity: 'mythic', value: '🚀', name: 'Astronauta',    description: 'Capitán de la estación cósmica.', price: 2300 },
  { id: 'av_diamond', type: 'avatar', rarity: 'mythic', value: '💎', name: 'Diamante G4',   description: 'La joya más codiciada de EduAventura.', price: 2600 },

  // ═════════════════════════════════════════════════════════════════════════════
  // LEMAS Y TÍTULOS (26 TOTAL: 1 Básico, 5 Comunes, 7 Avanzados, 10 Épicos, 3 Míticos)
  // ═════════════════════════════════════════════════════════════════════════════

  // ─── Básico (1) ────────────────────────────────────────────────────────────
  { id: 'tit_novato',   type: 'title', rarity: 'basic',    value: 'Novato Matemático',       name: 'Novato Matemático',       description: 'El inicio de toda gran leyenda.', price: 0 },

  // ─── Comunes (5) ───────────────────────────────────────────────────────────
  { id: 'tit_aprendiz', type: 'title', rarity: 'common',   value: 'Aprendiz Veloz',          name: 'Aprendiz Veloz',          description: 'Siempre listo para practicar.', price: 100 },
  { id: 'tit_explora',  type: 'title', rarity: 'common',   value: 'Explorador Numérico',     name: 'Explorador Numérico',     description: 'Descubre patrones en todas partes.', price: 110 },
  { id: 'tit_libreta',  type: 'title', rarity: 'common',   value: 'Guerrero del Cuaderno',   name: 'Guerrero del Cuaderno',   description: 'A lápiz y papel sin dudar jamás.', price: 120 },
  { id: 'tit_curioso',  type: 'title', rarity: 'common',   value: 'Curioso Incansable',      name: 'Curioso Incansable',      description: 'Cada problema es un acertijo por abrir.', price: 125 },
  { id: 'tit_atento',   type: 'title', rarity: 'common',   value: 'Ojo de Lince Numérico',   name: 'Ojo de Lince Numérico',   description: 'No se le escapa ningún signo.', price: 130 },

  // ─── Avanzados (7) ─────────────────────────────────────────────────────────
  { id: 'tit_flash',    type: 'title', rarity: 'advanced', value: '⚡ Calculador Relámpago',  name: 'Calculador Relámpago',   description: 'Responde en un abrir y cerrar de ojos.', price: 240 },
  { id: 'tit_shield',   type: 'title', rarity: 'advanced', value: '🛡️ Sin Miedo al Error',   name: 'Sin Miedo al Error',      description: 'Aprende y se levanta más inteligente.', price: 260 },
  { id: 'tit_tables',   type: 'title', rarity: 'advanced', value: '✖️ Amo de las Tablas',     name: 'Amo de las Tablas',       description: 'Del 1 al 10 sin titubear ni titubear.', price: 280 },
  { id: 'tit_reparto',  type: 'title', rarity: 'advanced', value: '➗ Rey del Reparto',       name: 'Rey del Reparto',        description: 'Divide con equidad absoluta siempre.', price: 290 },
  { id: 'tit_arqui',    type: 'title', rarity: 'advanced', value: '📐 Arquitecto Mental',     name: 'Arquitecto Mental',      description: 'Estructura su pensamiento con orden.', price: 300 },
  { id: 'tit_blanco',   type: 'title', rarity: 'advanced', value: '🎯 Tiro Certero',         name: 'Tiro Certero',           description: 'Cálculo directo al resultado correcto.', price: 320 },
  { id: 'tit_racha',    type: 'title', rarity: 'advanced', value: '🔥 Racha Imparable',      name: 'Racha Imparable',        description: 'Los combos crecen sin freno.', price: 330 },

  // ─── Épicos (10) ───────────────────────────────────────────────────────────
  { id: 'tit_hunter',   type: 'title', rarity: 'epic',     value: '🏆 Cazador de Récords',   name: 'Cazador de Récords',      description: 'El terror de la tabla de puntuaciones.', price: 540 },
  { id: 'tit_frac',     type: 'title', rarity: 'epic',     value: '🍕 Señor de Fracciones',  name: 'Señor de Fracciones',     description: 'Reparte pizzas con precisión de cirujano.', price: 560 },
  { id: 'tit_ninja',    type: 'title', rarity: 'epic',     value: '🥷 Ninja Numérico',       name: 'Ninja Numérico',          description: 'Cálculo silencioso, veloz y letal.', price: 580 },
  { id: 'tit_mago',     type: 'title', rarity: 'epic',     value: '🧙 Mago del Algoritmo',   name: 'Mago del Algoritmo',      description: 'Conjura soluciones ante lo imposible.', price: 600 },
  { id: 'tit_acero',    type: 'title', rarity: 'epic',     value: '🧠 Cerebro de Acero',     name: 'Cerebro de Acero',        description: 'Resistencia total en desafíos extensos.', price: 620 },
  { id: 'tit_stars',    type: 'title', rarity: 'epic',     value: '⭐ Imán de 3 Estrellas',   name: 'Imán de 3 Estrellas',    description: 'La perfección hecha estudiante.', price: 640 },
  { id: 'tit_tempest',  type: 'title', rarity: 'epic',     value: '⚡ Tormenta Veloz',        name: 'Tormenta Veloz',         description: 'Imparable en el modo contrarreloj.', price: 660 },
  { id: 'tit_titan',    type: 'title', rarity: 'epic',     value: '🛡️ Titán Matemático',     name: 'Titán Matemático',       description: 'Ninguna división logra derribarlo.', price: 680 },
  { id: 'tit_cosmos',   type: 'title', rarity: 'epic',     value: '🌌 Viajero del Cosmos',   name: 'Viajero del Cosmos',      description: 'Explorador de las galaxias numéricas.', price: 700 },
  { id: 'tit_guardian', type: 'title', rarity: 'epic',     value: '🗝️ Guardián Numérico',    name: 'Guardián Numérico',     description: 'Descifra cualquier misterio matemático.', price: 720 },

  // ─── Míticos (3) ───────────────────────────────────────────────────────────
  { id: 'tit_mind',     type: 'title', rarity: 'mythic',   value: '🧠 Mente Invencible',     name: 'Mente Invencible',        description: 'Pensamiento lógico imparable e invicto.', price: 1500 },
  { id: 'tit_legend',   type: 'title', rarity: 'mythic',   value: '🌟 Leyenda de Laureano',  name: 'Leyenda de Laureano',     description: 'Orgullo supremo de Aguachica, Cesar.', price: 1850 },
  { id: 'tit_supreme',  type: 'title', rarity: 'mythic',   value: '👑 Supremo G4',           name: 'Supremo G4',              description: 'La máxima distinción de honor de EduAventura.', price: 2200 },
];

export function getAvatarRarity(avatarEmoji) {
  if (!avatarEmoji || avatarEmoji === '🧒' || avatarEmoji === '👧') return 'basic';
  const it = STORE_ITEMS.find((item) => item.type === 'avatar' && item.value === avatarEmoji);
  return it ? it.rarity : 'basic';
}

export function getTitleRarity(titleText) {
  if (!titleText || titleText === 'Novato Matemático') return 'basic';
  const it = STORE_ITEMS.find((item) => item.type === 'title' && item.value === titleText);
  return it ? it.rarity : 'basic';
}
