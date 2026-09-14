/**
 * @file firebase.js — Servicio de Autenticación y Sincronización en la Nube
 * 
 * Gestiona el inicio de sesión y guardado de progreso para estudiantes de 4.° grado:
 * - Identificador único: Tarjeta de identidad / Cédula del estudiante.
 * - Nickname: Primer nombre y primer apellido.
 * - Guardado y recuperación en Cloud Firestore con fusión inteligente.
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ─── Credenciales del Proyecto Firebase ────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyC_1gJS9S_tSsBs_h-amtMJgqvsWJDxIiI",
  authDomain: "eduaventura-g4.firebaseapp.com",
  projectId: "eduaventura-g4",
  storageBucket: "eduaventura-g4.firebasestorage.app",
  messagingSenderId: "904915512944",
  appId: "1:904915512944:web:d265c5c10032d980f58eb5"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ─── Utilidades de formato ───────────────────────────────────────────────────

/**
 * Normaliza el documento de identidad eliminando puntos, guiones y espacios.
 * @param {string|number} rawId
 * @returns {string}
 */
export function cleanStudentId(rawId) {
  if (!rawId) return '';
  return String(rawId).replace(/[^a-zA-Z0-9]/g, '').trim().toLowerCase();
}

/**
 * Genera el correo sintético interno para Firebase Auth a partir de la tarjeta de identidad.
 * @param {string} studentId
 * @returns {string}
 */
function _idToEmail(studentId) {
  const clean = cleanStudentId(studentId);
  return `${clean}@edumundo.local`;
}

/**
 * Genera la contraseña basada en el documento asegurando el mínimo de 6 caracteres de Firebase.
 * @param {string} studentId
 * @returns {string}
 */
function _idToPassword(studentId) {
  const clean = cleanStudentId(studentId);
  if (clean.length < 6) {
    return clean.padEnd(6, '0');
  }
  return clean;
}

/**
 * Traduce errores de Firebase Auth a mensajes pedagógicos amigables.
 * @param {string} code
 * @returns {string}
 */
export function formatAuthError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'No encontramos una cuenta con ese documento de identidad. Revisa los números o crea una cuenta nueva.';
    case 'auth/wrong-password':
      return 'El documento o clave no coincide con los registros.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con este documento de identidad. Usa la opción "Iniciar Sesión".';
    case 'auth/weak-password':
      return 'El documento de identidad debe tener al menos 4 números.';
    case 'auth/operation-not-allowed':
      return 'El método de autenticación por Correo/Contraseña no está habilitado en Firebase Console.';
    case 'auth/network-request-failed':
      return 'Sin conexión a internet. Revisa tu red Wifi o cable.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos seguidos. Espera un momento antes de reintentar.';
    default:
      return code ? `Error del servidor (${code}). Por favor intenta de nuevo.` : 'Ocurrió un inconveniente al conectar con el servidor.';
  }
}

// ─── Métodos de Autenticación ────────────────────────────────────────────────

/**
 * Registra un nuevo estudiante usando su Tarjeta de Identidad y Nombre Completo.
 * @param {string} studentId - Tarjeta de Identidad / Cédula.
 * @param {string} fullName  - Primer nombre y primer apellido.
 * @returns {Promise<{ ok: boolean, user?: any, error?: string }>}
 */
export async function registerStudent(studentId, fullName) {
  const cleanId = cleanStudentId(studentId);
  const nickname = (fullName || '').trim();

  if (!cleanId || cleanId.length < 4) {
    return { ok: false, error: 'Por favor ingresa un documento de identidad válido (mínimo 4 dígitos).' };
  }
  if (!nickname || nickname.length < 2) {
    return { ok: false, error: 'Por favor escribe tu primer nombre y primer apellido.' };
  }

  const email = _idToEmail(cleanId);
  const password = _idToPassword(cleanId);

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Asignar el nickname como displayName
    await updateProfile(user, { displayName: nickname });

    // Guardar documento de perfil en Firestore
    const userDocRef = doc(db, 'students', user.uid);
    await setDoc(userDocRef, {
      studentId: cleanId,
      displayName: nickname,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return { ok: true, user: { uid: user.uid, studentId: cleanId, displayName: nickname } };
  } catch (err) {
    console.error('[Firebase Auth] registerStudent error:', err);
    return { ok: false, error: formatAuthError(err.code) };
  }
}

/**
 * Inicia sesión usando la Tarjeta de Identidad.
 * @param {string} studentId - Tarjeta de Identidad / Cédula.
 * @returns {Promise<{ ok: boolean, user?: any, error?: string }>}
 */
export async function loginStudent(studentId) {
  const cleanId = cleanStudentId(studentId);

  if (!cleanId || cleanId.length < 4) {
    return { ok: false, error: 'Por favor ingresa tu documento de identidad (mínimo 4 dígitos).' };
  }

  const email = _idToEmail(cleanId);
  const password = _idToPassword(cleanId);

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Intentar obtener el nombre guardado en Firestore si displayName estuviera vacío
    let displayName = user.displayName;
    if (!displayName) {
      try {
        const snap = await getDoc(doc(db, 'students', user.uid));
        if (snap.exists()) {
          displayName = snap.data().displayName;
        }
      } catch (_) {}
    }

    return { ok: true, user: { uid: user.uid, studentId: cleanId, displayName: displayName || 'Estudiante' } };
  } catch (err) {
    console.error('[Firebase Auth] loginStudent error:', err);
    return { ok: false, error: formatAuthError(err.code) };
  }
}

/**
 * Cierra la sesión activa en el dispositivo.
 * @returns {Promise<boolean>}
 */
export async function logoutStudent() {
  try {
    await signOut(auth);
    return true;
  } catch (err) {
    console.error('[Firebase Auth] logoutStudent error:', err);
    return false;
  }
}

/**
 * Actualiza el nickname (primer nombre y apellido) del estudiante en Firebase y Firestore.
 * @param {string} newNickname
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function updateStudentNickname(newNickname) {
  const user = auth.currentUser;
  if (!user) return { ok: false, error: 'No hay una sesión activa.' };

  const clean = (newNickname || '').trim();
  if (!clean || clean.length < 2) {
    return { ok: false, error: 'El nombre debe tener al menos 2 caracteres.' };
  }

  try {
    await updateProfile(user, { displayName: clean });
    await setDoc(doc(db, 'students', user.uid), {
      displayName: clean,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { ok: true };
  } catch (err) {
    console.error('[Firebase Auth] updateStudentNickname error:', err);
    return { ok: false, error: 'No se pudo actualizar el nombre en la nube.' };
  }
}

/**
 * Retorna la información básica del usuario con sesión activa.
 * @returns {{ uid: string, email: string, displayName: string, studentId: string } | null}
 */
export function getCurrentStudent() {
  const user = auth.currentUser;
  if (!user) return null;
  const studentId = user.email ? user.email.split('@')[0] : '';
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Estudiante',
    studentId: studentId,
  };
}

/**
 * Suscribe un callback a cambios de estado de autenticación.
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export function onStudentAuthStateChanged(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      callback(null);
    } else {
      const studentId = user.email ? user.email.split('@')[0] : '';
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Estudiante',
        studentId: studentId,
      });
    }
  });
}

// ─── Métodos de Guardado y Carga en Cloud Firestore ──────────────────────────

/**
 * Guarda el progreso completo en Cloud Firestore en la colección `saves/{uid}`.
 * @param {object} saveData - Estado canónico del juego.
 * @returns {Promise<{ ok: boolean, updatedAt?: string, error?: string }>}
 */
export async function saveProgressToCloud(saveData) {
  const user = auth.currentUser;
  if (!user) {
    return { ok: false, error: 'Debes iniciar sesión con tu cuenta para guardar en la nube.' };
  }

  try {
    const timestampISO = new Date().toISOString();
    const saveRef = doc(db, 'saves', user.uid);

    // Adjuntar fecha ISO al objeto para trazabilidad
    const clonedSave = JSON.parse(JSON.stringify(saveData));
    clonedSave.last_updated = timestampISO;

    await setDoc(saveRef, {
      uid: user.uid,
      studentId: user.email ? user.email.split('@')[0] : '',
      alias: clonedSave.user?.alias || user.displayName || 'Estudiante',
      stars: clonedSave.user?.stars_total || 0,
      coins: clonedSave.user?.coins || 0,
      gems: clonedSave.user?.gems || 0,
      saveData: clonedSave,
      updatedAtISO: timestampISO,
      serverTime: serverTimestamp(),
    }, { merge: true });

    return { ok: true, updatedAt: timestampISO };
  } catch (err) {
    console.error('[Firebase Firestore] saveProgressToCloud error:', err);
    return { ok: false, error: 'No se pudo guardar en la nube. Revisa tu conexión a internet.' };
  }
}

/**
 * Descarga el progreso del estudiante desde Cloud Firestore.
 * @returns {Promise<{ ok: boolean, data?: object, updatedAt?: string, notFound?: boolean, error?: string }>}
 */
export async function fetchProgressFromCloud() {
  const user = auth.currentUser;
  if (!user) {
    return { ok: false, error: 'Debes iniciar sesión con tu cuenta para cargar desde la nube.' };
  }

  try {
    const saveRef = doc(db, 'saves', user.uid);
    const snap = await getDoc(saveRef);

    if (!snap.exists()) {
      return { ok: false, notFound: true, error: 'No hay ninguna partida guardada en la nube para esta cuenta.' };
    }

    const docData = snap.data();
    return {
      ok: true,
      data: docData.saveData,
      updatedAt: docData.updatedAtISO || null,
      stars: docData.stars || 0,
      coins: docData.coins || 0,
      alias: docData.alias || 'Estudiante',
    };
  } catch (err) {
    console.error('[Firebase Firestore] fetchProgressFromCloud error:', err);
    return { ok: false, error: 'No se pudo descargar de la nube. Revisa tu conexión a internet.' };
  }
}

// ─── Fusión Inteligente de Partidas (Smart Merge) ────────────────────────────

/**
 * Combina la partida local y la partida en la nube, tomando lo mejor de ambas:
 * - Mayor cantidad de estrellas y monedas.
 * - Niveles superados con mejores estrellas en cada módulo.
 * - Unión de avatares y títulos desbloqueados.
 * - Unión de logros obtenidos.
 * - Mejor récord en modo libre.
 *
 * @param {object} localSave
 * @param {object} cloudSave
 * @returns {object} Objeto fusionado sin pérdidas.
 */
export function smartMergeSave(localSave, cloudSave) {
  if (!cloudSave) return localSave;
  if (!localSave) return cloudSave;

  const merged = JSON.parse(JSON.stringify(localSave));
  const cloud = JSON.parse(JSON.stringify(cloudSave));

  // 1. Monedas y Gemas: tomar el máximo
  merged.user.coins = Math.max(merged.user.coins || 0, cloud.user?.coins || 0);
  merged.user.gems = Math.max(merged.user.gems || 0, cloud.user?.gems || 0);

  // 2. Avatares y Títulos: unión única
  const localAvatars = new Set(merged.user.unlocked_avatars || ['🧒', '👧']);
  (cloud.user?.unlocked_avatars || []).forEach((av) => localAvatars.add(av));
  merged.user.unlocked_avatars = Array.from(localAvatars);

  const localTitles = new Set(merged.user.unlocked_titles || ['Novato Matemático']);
  (cloud.user?.unlocked_titles || []).forEach((ti) => localTitles.add(ti));
  merged.user.unlocked_titles = Array.from(localTitles);

  // 3. Logros: unión única
  const localAch = new Set(merged.user.achievements || []);
  (cloud.user?.achievements || []).forEach((a) => localAch.add(a));
  merged.user.achievements = Array.from(localAch);

  // 4. Módulos y Niveles: conservar el mejor intento en cada nivel
  const allModKeys = new Set([...Object.keys(merged.modules || {}), ...Object.keys(cloud.modules || {})]);
  for (const modKey of allModKeys) {
    if (!merged.modules[modKey]) {
      merged.modules[modKey] = cloud.modules[modKey] || { unlocked: false, completed: false, levels: {} };
      continue;
    }
    const cloudMod = cloud.modules?.[modKey];
    if (!cloudMod) continue;

    merged.modules[modKey].unlocked = Boolean(merged.modules[modKey].unlocked || cloudMod.unlocked);
    merged.modules[modKey].completed = Boolean(merged.modules[modKey].completed || cloudMod.completed);

    const allLvlKeys = new Set([
      ...Object.keys(merged.modules[modKey].levels || {}),
      ...Object.keys(cloudMod.levels || {}),
    ]);

    for (const lvlKey of allLvlKeys) {
      const locLvl = merged.modules[modKey].levels?.[lvlKey];
      const cldLvl = cloudMod.levels?.[lvlKey];

      if (!locLvl && cldLvl) {
        merged.modules[modKey].levels[lvlKey] = { ...cldLvl };
      } else if (locLvl && cldLvl) {
        // Si la nube tiene más estrellas o mejor tiempo, conservar la mejor
        const bestStars = Math.max(locLvl.stars || 0, cldLvl.stars || 0);
        const cleared = Boolean(locLvl.cleared || cldLvl.cleared);
        merged.modules[modKey].levels[lvlKey] = {
          cleared,
          stars: bestStars,
          errors: Math.min(locLvl.errors ?? 999, cldLvl.errors ?? 999),
          hints: Math.min(locLvl.hints ?? 999, cldLvl.hints ?? 999),
          time_sec: Math.min(locLvl.time_sec ?? 9999, cldLvl.time_sec ?? 9999),
        };
      }
    }
  }

  // 5. Recalcular estrellas totales de forma canónica
  let totalStars = 0;
  for (const mod of Object.values(merged.modules)) {
    for (const lvl of Object.values(mod.levels || {})) {
      if (lvl?.cleared && typeof lvl?.stars === 'number') {
        totalStars += lvl.stars;
      }
    }
  }
  merged.user.stars_total = totalStars;

  // 6. Récords Highscores
  merged.user.highscores = {
    free_mode: Math.max(merged.user.highscores?.free_mode || 0, cloud.user?.highscores?.free_mode || 0),
    m1: Math.max(merged.user.highscores?.m1 || 0, cloud.user?.highscores?.m1 || 0),
    m2: Math.max(merged.user.highscores?.m2 || 0, cloud.user?.highscores?.m2 || 0),
    m3: Math.max(merged.user.highscores?.m3 || 0, cloud.user?.highscores?.m3 || 0),
    m4: Math.max(merged.user.highscores?.m4 || 0, cloud.user?.highscores?.m4 || 0),
  };

  merged.last_updated = new Date().toISOString();
  return merged;
}
