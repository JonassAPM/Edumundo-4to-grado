/**
 * @file overworld.js — Pantalla de Selección de Módulos (Overworld Panorámico)
 *
 * SPEC Referencias:
 *   Parámetro 108 — Vista del archipiélago temático: 4 islas de 4.° grado.
 *   Parámetro 109 — Tarjetas de módulo: título, niveles, barra de progreso, estrellas, botón.
 *   Parámetro 163 — Pantalla 2: módulos con candado visual si bloqueados.
 *   Parámetro 147 — Barra de progreso animada (transition: width 0.5s).
 *   Parámetro 12  — Transición al estado GAMEPLAY al tocar un módulo.
 *
 * NOTA: Implementación completa en fase de UI.
 */

'use strict';

/**
 * Renderiza la pantalla Overworld dentro del contenedor dado.
 *
 * @param {HTMLElement}                         container - Elemento donde se monta.
 * @param {import('../core/storage.js').SaveData} saveData - Datos de progreso actuales.
 * @param {Function} onModuleSelect - Callback(moduleKey: string) al seleccionar módulo.
 * @returns {{ destroy: Function, refresh: Function }}
 */
export function mountOverworld(container, saveData, onModuleSelect) {
  // TODO: Implementación en fase de UI.
  console.log('[Overworld] mountOverworld — pendiente de implementación.');
  return {
    destroy() {},
    refresh(_saveData) {},
  };
}
