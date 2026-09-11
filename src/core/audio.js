/**
 * @file audio.js — Sintetizador de Audio Procedimental Web Audio API
 * EduAventura G4 · Zero-CDN · 100% Offline · Compatible con file:// y web
 */

'use strict';

let _audioCtx = null;
let _sfxEnabled = true;
let _musicEnabled = true;
let _bgmOsc = null;
let _bgmGain = null;
let _bgmTimer = null;

function _getAudioContext() {
  if (!_audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      _audioCtx = new AudioContextClass();
    }
  }
  if (_audioCtx && _audioCtx.state === 'suspended') {
    _audioCtx.resume().catch(() => {});
  }
  return _audioCtx;
}

// ─── Efectos SFX Procedimentales ───────────────────────────────────────────────

/** Sonido elástico tipo 'Pop' de botón arcade */
export function playPop() {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (_) {}
}

/** Clic sutil para teclados e interactivos */
export function playClick() {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (_) {}
}

/** Acorde ascendente triunfal con escala variable según el combo (¡Dopamina pura!) */
export function playCorrect(combo = 1) {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const baseFreqs = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do alto
    const pitchShift = Math.min(combo * 1.08, 1.8);
    const now = ctx.currentTime;

    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitchShift, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch (_) {}
}

/** Sonido tintineante de monedas doradas ("¡Ching!") */
export function playCoin() {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    [987.77, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = now + i * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.28);
    });
  } catch (_) {}
}

/** Sonido mágico para cada estrella que cae (index: 1, 2, 3) */
export function playStar(index = 1) {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const freqs = [587.33, 739.99, 880.00, 1174.66];
    const freq = freqs[index % freqs.length];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc2.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 1.5, now);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.48);
    osc2.stop(now + 0.48);
  } catch (_) {}
}

/** Sonido cómico y suave de fallo (sin frustración) */
export function playError() {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (_) {}
}

/** Campanilla alegre de bombillo o idea ("¡Eureka!") para la guía */
export function playGuide() {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    [659.25, 1046.50].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = now + i * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, st);

      gain.gain.setValueAtTime(0.25, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.38);
    });
  } catch (_) {}
}

/** Fanfarria triunfal completa estilo Brawl Stars / Duolingo */
export function playVictory() {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const notes = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.14 },
      { f: 1046.50, d: 0.32 },
    ];
    let time = ctx.currentTime;

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.24, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + n.d + 0.02);

      time += n.d * 0.75;
    });
  } catch (_) {}
}

/** Sonido 'Whoosh' de apertura de ventanas o cartas */
export function playWhoosh() {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (_) {}
}

/** Sonido de reloj 'Tick' para cuenta regresiva intensa */
export function playTick(urgent = false) {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(urgent ? 880 : 540, now);
    osc.frequency.exponentialRampToValueAtTime(urgent ? 1100 : 200, now + 0.04);

    gain.gain.setValueAtTime(urgent ? 0.35 : 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (_) {}
}

/** Sonido y suspense de ruleta frenética con desaceleración dramática e intriga */
export function playRouletteSpinSound(durationSec = 4.2) {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    let t = 0;
    let step = 0.045; // Empieza a alta velocidad frenética

    while (t < durationSec - 0.15) {
      const clickTime = now + t;
      const progress = t / durationSec;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = 680 - (progress * 280) + (Math.random() * 40 - 20);
      osc.type = progress > 0.5 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, clickTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(100, freq * 0.35), clickTime + 0.028);

      const vol = 0.18 * (1 - progress * 0.4);
      gain.gain.setValueAtTime(vol, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.032);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(clickTime);
      osc.stop(clickTime + 0.035);

      if (progress < 0.35) {
        step = 0.045 + progress * 0.03;
      } else if (progress < 0.7) {
        step = 0.06 + Math.pow(progress, 2) * 0.18;
      } else {
        step = 0.12 + Math.pow(progress, 3) * 0.42;
      }
      t += step;
    }

    // Tono drone de intriga / tensión creciente de fondo
    const chordOsc = ctx.createOscillator();
    const chordGain = ctx.createGain();
    chordOsc.type = 'triangle';
    chordOsc.frequency.setValueAtTime(261.63, now); // Do4
    chordOsc.frequency.exponentialRampToValueAtTime(329.63, now + durationSec * 0.75); // Sube a Mi4 para generar intriga
    chordGain.gain.setValueAtTime(0.03, now);
    chordGain.gain.linearRampToValueAtTime(0.08, now + durationSec * 0.65);
    chordGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
    chordOsc.connect(chordGain);
    chordGain.connect(ctx.destination);
    chordOsc.start(now);
    chordOsc.stop(now + durationSec);
  } catch (_) {}
}

/** Sonido de compra exitosa en la tienda (caja registradora festiva) */
/** Sonido triunfal de Desbloqueo de Avatar, Título o Módulo (Fanfarria Mágica) */
export function playUnlock() {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 - E5 - G5 - C6 - E6 - G6

    arpeggio.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = now + idx * 0.055;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0, st);
      gain.gain.linearRampToValueAtTime(0.28, st + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.38);
    });

    // Brillo armónico final
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    const shimSt = now + 0.32;
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(2093.00, shimSt); // C7
    shimmerGain.gain.setValueAtTime(0.18, shimSt);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, shimSt + 0.45);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.start(shimSt);
    shimmer.stop(shimSt + 0.48);
  } catch (_) {}
}

/** Sonido de compra exitosa en la tienda (caja registradora festiva + chimes) */
export function playBuy() {
  if (!_sfxEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Golpe metálico de caja
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(320, now);
    clickOsc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
    clickGain.gain.setValueAtTime(0.25, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.06);

    // Acorde festivo brillante
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = now + 0.03 + idx * 0.045;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0, st);
      gain.gain.linearRampToValueAtTime(0.26, st + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.3);
    });
  } catch (_) {}
}

// ─── Motor de Música Procedimental Multi-Pista Polifónico ─────────────────────

const NOTE = {
  // Octava 2
  C2: 65.41, Cs2: 69.30, D2: 73.42, Ds2: 77.78, E2: 82.41, F2: 87.31, Fs2: 92.50, G2: 98.00, Gs2: 103.83, A2: 110.00, As2: 116.54, B2: 123.47,
  // Octava 3
  C3: 130.81, Cs3: 138.59, D3: 146.83, Ds3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Gs3: 207.65, A3: 220.00, As3: 233.08, B3: 246.94,
  // Octava 4
  C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00, As4: 466.16, B4: 493.88,
  // Octava 5
  C5: 523.25, Cs5: 554.37, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.00, As5: 932.33, B5: 987.77,
  // Octava 6
  C6: 1046.50, Cs6: 1108.73, D6: 1174.66, Ds6: 1244.51, E6: 1318.51, F6: 1396.91, Fs6: 1479.98, G6: 1567.98, Gs6: 1661.22, A6: 1760.00, As6: 1864.66, B6: 1975.53,
  // Octava 7
  C7: 2093.00, D7: 2349.32, E7: 2637.02, F7: 2793.83, G7: 3135.96,
  _: 0, // Silencio
};

// Generador de ruido blanco para percusiones procedurales (hi-hats, snares)
let _noiseBuf = null;
function _getNoiseBuffer(ctx) {
  if (!_noiseBuf) {
    const size = Math.floor(ctx.sampleRate * 0.4);
    const buf = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    _noiseBuf = buf;
  }
  return _noiseBuf;
}

// ─── Instrumentos Sintetizados Procedurales ───────────────────────────────────

function _synthKick(ctx, time, vol = 0.38) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(145, time);
  osc.frequency.exponentialRampToValueAtTime(36, time + 0.08);
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.085);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.09);
}

function _synthSnare(ctx, time, vol = 0.22) {
  // Golpe tonal
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(185, time);
  osc.frequency.exponentialRampToValueAtTime(65, time + 0.045);
  oscGain.gain.setValueAtTime(vol * 0.8, time);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.06);

  // Explosión de ruido blanco
  const noise = ctx.createBufferSource();
  noise.buffer = _getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(950, time);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(vol, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(time);
  noise.stop(time + 0.085);
}

function _synthHiHat(ctx, time, vol = 0.08, open = false) {
  const noise = ctx.createBufferSource();
  noise.buffer = _getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(7500, time);
  const gain = ctx.createGain();
  const dur = open ? 0.09 : 0.035;
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(time);
  noise.stop(time + dur + 0.01);
}

function _synthLead(ctx, time, freq, dur, wave = 'triangle', vol = 0.045) {
  if (!freq || freq <= 0) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, time);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + dur + 0.02);
}

function _synthBass(ctx, time, freq, dur, wave = 'sawtooth', vol = 0.042) {
  if (!freq || freq <= 0) return;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = wave;
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(380, time);
  filter.frequency.exponentialRampToValueAtTime(140, time + dur);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + dur + 0.02);
}

function _synthChord(ctx, time, freqs, dur, vol = 0.022) {
  if (!freqs || !freqs.length) return;
  freqs.forEach((f) => {
    if (!f || f <= 0) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  });
}

// ─── Sintetizadores Especiales para Modo Libre ───────────────────────────────

function _synthAcidBass(ctx, time, freq, dur, vol = 0.052) {
  if (!freq || freq <= 0) return;
  const osc = ctx.createOscillator();
  const sub = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);

  sub.type = 'square';
  sub.frequency.setValueAtTime(freq * 0.5, time); // Sub-octava arenosa

  filter.type = 'lowpass';
  filter.Q.setValueAtTime(5.5, time); // Resonancia estilo TB-303
  filter.frequency.setValueAtTime(1500, time);
  filter.frequency.exponentialRampToValueAtTime(140, time + dur * 0.9);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  osc.connect(filter);
  sub.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  sub.start(time);
  osc.stop(time + dur + 0.02);
  sub.stop(time + dur + 0.02);
}

function _synthArcadeLead(ctx, time, freq, dur, vol = 0.046) {
  if (!freq || freq <= 0) return;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc1.type = 'sawtooth';
  osc2.type = 'square';
  osc1.frequency.setValueAtTime(freq, time);
  osc2.frequency.setValueAtTime(freq * 1.005, time); // Detune para sonido arcade grueso y agresivo

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2800, time);
  filter.frequency.exponentialRampToValueAtTime(700, time + dur);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + dur + 0.02);
  osc2.stop(time + dur + 0.02);
}

// ─── Composiciones Musicales Completas ─────────────────────────────────────────

const COMPOSITIONS = {
  // 1. LOBBY (Menú Principal): Alegre, Pop-Funk animado a ~83 BPM (10% más lento, 32 pasos)
  lobby: {
    baseStepSec: 0.180, // ~83 BPM (10% más lento a petición)
    stepsCount: 32,
    playStep(ctx, time, step, dur) {
      // Batería rítmica alegre
      if (step % 8 === 0 || step % 8 === 4) _synthKick(ctx, time, 0.28);
      if (step % 8 === 4)                   _synthSnare(ctx, time, 0.18);
      if (step % 2 === 0)                   _synthHiHat(ctx, time, 0.06, step % 4 === 2);

      // Bajo slap caminante (C - Am - F - G)
      const bassProg = [
        NOTE.C3, NOTE._, NOTE.E3, NOTE._, NOTE.G3, NOTE._, NOTE.A3, NOTE.B3, // Compás 1 (C)
        NOTE.A2, NOTE._, NOTE.C3, NOTE._, NOTE.E3, NOTE._, NOTE.G3, NOTE._,  // Compás 2 (Am)
        NOTE.F2, NOTE._, NOTE.A2, NOTE._, NOTE.C3, NOTE._, NOTE.D3, NOTE._,  // Compás 3 (F)
        NOTE.G2, NOTE._, NOTE.B2, NOTE._, NOTE.D3, NOTE._, NOTE.F3, NOTE._,  // Compás 4 (G)
      ];
      _synthBass(ctx, time, bassProg[step % 32], dur * 1.6, 'triangle', 0.045);

      // Acordes staccato en contratiempos (pasos 2, 6 de cada compás)
      if (step % 4 === 2) {
        const chordProg = [
          [NOTE.E4, NOTE.G4, NOTE.C5], // C
          [NOTE.E4, NOTE.A4, NOTE.C5], // Am
          [NOTE.F4, NOTE.A4, NOTE.C5], // F
          [NOTE.G4, NOTE.B4, NOTE.D5], // G
        ];
        const cIdx = Math.floor(step / 8) % 4;
        _synthChord(ctx, time, chordProg[cIdx], dur * 1.1, 0.024);
      }

      // Melodía principal alegre y memorable (32 pasos)
      const melProg = [
        // Frase 1
        NOTE.E5, NOTE.G5, NOTE.A5, NOTE.C6, NOTE.B5, NOTE.G5, NOTE.E5, NOTE.D5,
        // Frase 2
        NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.A5, NOTE._,  NOTE.G5, NOTE._,
        // Frase 3
        NOTE.A5, NOTE.C6, NOTE.D6, NOTE.E6, NOTE.D6, NOTE.C6, NOTE.A5, NOTE.C6,
        // Frase 4
        NOTE.G5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.D5, NOTE.E5, NOTE.C5, NOTE._,
      ];
      _synthLead(ctx, time, melProg[step % 32], dur * 0.9, 'triangle', 0.042);
    },
  },

  // 2. GAMEPLAY (Campaña / Niveles): Muy calmada, serena, ambiental para pensar (~55 BPM, 20% más lenta, 32 pasos)
  gameplay: {
    baseStepSec: 0.270, // ~55 BPM (20% más lenta a petición, máxima serenidad mental)
    stepsCount: 32,
    playStep(ctx, time, step, dur) {
      // Percusión susurrante y sutil (cero intrusión acústica)
      if (step === 0 || step === 16) _synthKick(ctx, time, 0.09);
      if (step % 8 === 4)            _synthHiHat(ctx, time, 0.022, false);

      // Bajo sub-sine cálido, envolvente y suave
      const bassProg = [
        NOTE.F2, NOTE._, NOTE._, NOTE._, NOTE.F2, NOTE._, NOTE._, NOTE._,
        NOTE.D2, NOTE._, NOTE._, NOTE._, NOTE.D2, NOTE._, NOTE._, NOTE._,
        NOTE.As2,NOTE._, NOTE._, NOTE._, NOTE.As2,NOTE._, NOTE._, NOTE._,
        NOTE.C3, NOTE._, NOTE._, NOTE._, NOTE.C3, NOTE._, NOTE._, NOTE._,
      ];
      _synthBass(ctx, time, bassProg[step % 32], dur * 3.8, 'sine', 0.038);

      // Acordes de séptima flotantes con caída muy suave (Fmaj7 - Dm9 - Bbmaj7 - C9)
      if (step % 8 === 0) {
        const chordProg = [
          [NOTE.A3, NOTE.C4, NOTE.E4], // Fmaj7
          [NOTE.F3, NOTE.A3, NOTE.C4], // Dm7
          [NOTE.D3, NOTE.F3, NOTE.A3], // Bbmaj7
          [NOTE.G3, NOTE.As3,NOTE.D4], // C9
        ];
        const cIdx = Math.floor(step / 8) % 4;
        _synthChord(ctx, time, chordProg[cIdx], dur * 7.5, 0.016);
      }

      // Melodía tipo kalimba / flauta zen, muy espaciosa con aire para pensar (32 pasos)
      const melProg = [
        // Frase 1: Suave y meditativa
        NOTE.A4, NOTE._,  NOTE.C5, NOTE.E5, NOTE._,  NOTE.G5, NOTE.E5, NOTE._,
        // Frase 2: Respuesta relajante
        NOTE.D5, NOTE._,  NOTE.F5, NOTE.A5, NOTE._,  NOTE.G5, NOTE.D5, NOTE._,
        // Frase 3: Flotando en calma
        NOTE.F5, NOTE._,  NOTE.A5, NOTE.C6, NOTE._,  NOTE.B5, NOTE.G5, NOTE._,
        // Frase 4: Cadencia pacífica
        NOTE.E5, NOTE._,  NOTE.D5, NOTE.C5, NOTE.D5, NOTE.E5, NOTE.C5, NOTE._,
      ];
      _synthLead(ctx, time, melProg[step % 32], dur * 1.8, 'sine', 0.030);
    },
  },

  // 3. FREEMODE (Modo Libre): ¡COMPLETAMENTE DISTINTA Y FRENÉTICA!
  // Estilo Cyber Breakbeat / Arcade Speedrun en Mi menor (64 pasos · ~102 BPM, 10% más lento)
  freemode: {
    baseStepSec: 0.140, // ~102 BPM (10% más lento a petición)
    stepsCount: 64,
    playStep(ctx, time, step, dur) {
      // Ritmo sincopado Breakbeat / Drum & Bass (CERO patrón genérico 4-on-the-floor)
      const isKick = [0, 6, 10, 16, 22, 26, 32, 38, 42, 48, 54, 58].includes(step % 64);
      if (isKick) {
        _synthKick(ctx, time, 0.38);
      }
      // Cajas potentes y cajas fantasma sincopadas
      const isSnare = [4, 12, 20, 28, 36, 44, 52, 60].includes(step % 64);
      const isGhostSnare = [14, 27, 46, 59].includes(step % 64);
      if (isSnare) {
        _synthSnare(ctx, time, 0.26);
      } else if (isGhostSnare) {
        _synthSnare(ctx, time, 0.12);
      }
      // Hi-hats cortantes con dinámicas de velocidad en contratiempo
      _synthHiHat(ctx, time, step % 2 === 1 ? 0.08 : 0.04, step % 4 === 2);

      // Bajo Ácido resonante en Mi menor / Frigio (tensión y velocidad)
      const acidBassProg = [
        // Compás 1: Tensión en Mi menor (Em)
        NOTE.E2, NOTE.E3, NOTE.E2, NOTE.G2, NOTE.E2, NOTE.B2, NOTE.E2, NOTE.D3,
        NOTE.E2, NOTE.E3, NOTE.E2, NOTE.G2, NOTE.A2, NOTE.G2, NOTE.Fs2, NOTE.D2,
        // Compás 2: Escalada en Do y Re (C -> D)
        NOTE.C2, NOTE.C3, NOTE.C2, NOTE.E2, NOTE.C2, NOTE.G2, NOTE.D2, NOTE.D3,
        NOTE.D2, NOTE.Fs2, NOTE.D2, NOTE.A2, NOTE.B1, NOTE.B2, NOTE.C2, NOTE.D2,
        // Compás 3: Carrera rápida ascendente
        NOTE.E2, NOTE.E3, NOTE.G2, NOTE.A2, NOTE.B2, NOTE.E3, NOTE.D3, NOTE.B2,
        NOTE.E2, NOTE.E3, NOTE.G2, NOTE.A2, NOTE.B2, NOTE.D3, NOTE.E3, NOTE.G3,
        // Compás 4: Clímax de acordes potentes
        NOTE.C2, NOTE.C3, NOTE.E2, NOTE.G2, NOTE.D2, NOTE.D3, NOTE.Fs2, NOTE.A2,
        NOTE.Ds2, NOTE.Ds3, NOTE.Fs2, NOTE.B2, NOTE.E2, NOTE.B2, NOTE.E3, NOTE._,
      ];
      _synthAcidBass(ctx, time, acidBassProg[step % 64], dur * 0.92, 0.052);

      // Arpegio de fondo láser sintetizado en semicorcheas
      const laserArp = [
        NOTE.B5, NOTE.E6, NOTE.G6, NOTE.B6, NOTE.A5, NOTE.D6, NOTE.Fs6, NOTE.A6,
      ];
      if (step % 2 === 1) {
        _synthLead(ctx, time, laserArp[(step * 3) % laserArp.length], dur * 0.55, 'sawtooth', 0.018);
      }

      // Melodía principal: Riffs de stabs retro arcade y carreras veloces (64 pasos)
      const arcadeRiff = [
        // Frase 1: Stabs rítmicos de tensión
        NOTE.B5, NOTE._,  NOTE.B5, NOTE.E6, NOTE._,  NOTE.E6, NOTE.G6, NOTE.Fs6,
        NOTE.E6, NOTE.D6, NOTE.B5, NOTE.D6, NOTE.E6, NOTE._,  NOTE._,  NOTE._,
        // Frase 2: Respuesta agresiva
        NOTE.G6, NOTE._,  NOTE.G6, NOTE.A6, NOTE._,  NOTE.G6, NOTE.Fs6, NOTE.E6,
        NOTE.Fs6,NOTE.D6, NOTE.B5, NOTE.D6, NOTE.Fs6,NOTE._,  NOTE._,  NOTE._,
        // Frase 3: Carrera frenética a toda velocidad
        NOTE.E6, NOTE.G6, NOTE.B6, NOTE.E7, NOTE.D7, NOTE.B6, NOTE.A6, NOTE.G6,
        NOTE.A6, NOTE.B6, NOTE.D7, NOTE.E7, NOTE.G7, NOTE.Fs7,NOTE.E7, NOTE.D7,
        // Frase 4: Cascada veloz y resolución potente
        NOTE.E7, NOTE.D7, NOTE.C7, NOTE.B6, NOTE.C7, NOTE.B6, NOTE.A6, NOTE.G6,
        NOTE.Fs6,NOTE.G6, NOTE.A6, NOTE.B6, NOTE.E6, NOTE._,  NOTE._,  NOTE._,
      ];
      _synthArcadeLead(ctx, time, arcadeRiff[step % 64], dur * 0.9, 0.048);
    },
  },

  // 4. STORE (Minitienda): Vals de bazar estilo Zelda / Tienda RPG en 3/4 a ~71 BPM (10% más lento, 36 pasos)
  store: {
    baseStepSec: 0.280, // Paso de negra muy relajado y pausado (~71 BPM, 10% más lento)
    stepsCount: 36,
    playStep(ctx, time, step, dur) {
      const beatInBar = step % 3; // 0 = Tiempo 1 (Bajo), 1 = Tiempo 2 (Acorde), 2 = Tiempo 3 (Acorde)

      // Acompañamiento Oom-Pah-Pah clásico de tienda, suave y tranquilo (sin percusiones duras)
      if (beatInBar === 0) {
        // Tiempo 1: Bajo pizzicato suave y cálido
        const bassNotes = [
          NOTE.G2, NOTE.G2, NOTE.E2, NOTE.E2, NOTE.C3, NOTE.C3, NOTE.D3, NOTE.D3,
          NOTE.G2, NOTE.G2, NOTE.C3, NOTE.C3, NOTE.D3, NOTE.D3, NOTE.G2, NOTE.G2,
          NOTE.D3, NOTE.G2,
        ];
        const barIdx = Math.floor(step / 3) % bassNotes.length;
        _synthBass(ctx, time, bassNotes[barIdx], dur * 1.8, 'sine', 0.045);
      } else {
        // Tiempos 2 y 3: Acordes delicados estilo caja de música / arpa
        const chordNotes = [
          [NOTE.B3, NOTE.D4, NOTE.G4], // G
          [NOTE.B3, NOTE.D4, NOTE.G4],
          [NOTE.G3, NOTE.B3, NOTE.E4], // Em
          [NOTE.G3, NOTE.B3, NOTE.E4],
          [NOTE.G3, NOTE.C4, NOTE.E4], // C
          [NOTE.G3, NOTE.C4, NOTE.E4],
          [NOTE.Fs3,NOTE.C4, NOTE.D4], // D7
          [NOTE.Fs3,NOTE.C4, NOTE.D4],
        ];
        const barIdx = Math.floor(step / 3) % chordNotes.length;
        _synthChord(ctx, time, chordNotes[barIdx], dur * 0.7, 0.018);
      }

      // Melodía dulce, pausada y curiosa de tienda (36 pasos)
      const melProg = [
        // Compás 1 - 3
        NOTE.B4, NOTE.D5, NOTE.G5,  NOTE.Fs5,NOTE.E5, NOTE.D5,  NOTE.C5, NOTE.B4, NOTE.A4,
        // Compás 4 - 6
        NOTE.B4, NOTE.D5, NOTE.G5,  NOTE.B5, NOTE.A5, NOTE.G5,  NOTE.Fs5,NOTE.G5, NOTE.A5,
        // Compás 7 - 9
        NOTE.C5, NOTE.E5, NOTE.G5,  NOTE.A5, NOTE.G5, NOTE.E5,  NOTE.D5, NOTE.Fs5,NOTE.A5,
        // Compás 10 - 12
        NOTE.B5, NOTE.A5, NOTE.G5,  NOTE.Fs5,NOTE.G5, NOTE.E5,  NOTE.D5, NOTE.C5, NOTE.B4,
      ];
      _synthLead(ctx, time, melProg[step % 36], dur * 1.15, 'triangle', 0.038);
    },
  },
};

// ─── Secuenciador Lookahead de Alta Precisión (Cero Desfase ni Jitter) ─────────

let _currentThemeName = 'lobby';
let _currentStep = 0;
let _nextNoteTime = 0.0;
let _schedulerTimer = null;
let _baseSpeedMult = 1.0;

const LOOKAHEAD_MS = 25.0;      // Frecuencia de revisión del reloj (ms)
const SCHEDULE_AHEAD_SEC = 0.1; // Margen de programación anticipada (segundos)

function _scheduleNextStep(ctx) {
  const comp = COMPOSITIONS[_currentThemeName] || COMPOSITIONS.lobby;
  const stepDur = comp.baseStepSec / _baseSpeedMult;

  comp.playStep(ctx, _nextNoteTime, _currentStep, stepDur);

  _nextNoteTime += stepDur;
  _currentStep = (_currentStep + 1) % comp.stepsCount;
}

function _schedulerLoop() {
  if (!_musicEnabled) return;
  const ctx = _getAudioContext();
  if (!ctx) return;

  try {
    // Si el contexto estuvo suspendido o se inicia por primera vez
    if (_nextNoteTime < ctx.currentTime) {
      _nextNoteTime = ctx.currentTime + 0.02;
    }

    while (_nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_SEC) {
      _scheduleNextStep(ctx);
    }
  } catch (_) {}

  _schedulerTimer = setTimeout(_schedulerLoop, LOOKAHEAD_MS);
}

export function setBgmTheme(themeName) {
  if (!COMPOSITIONS[themeName]) return;
  if (_currentThemeName === themeName && _schedulerTimer) return;

  _currentThemeName = themeName;
  _currentStep = 0;

  const ctx = _getAudioContext();
  if (ctx) {
    _nextNoteTime = ctx.currentTime + 0.02;
  }

  if (_musicEnabled && !_schedulerTimer) {
    startBGM();
  }
}

export function setBgmSpeed(multiplier = 1) {
  _baseSpeedMult = Math.max(0.7, Math.min(2.4, multiplier));
}

export function startBGM() {
  if (!_musicEnabled) return;
  if (_schedulerTimer) return;

  const ctx = _getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  _nextNoteTime = ctx.currentTime + 0.03;
  _schedulerLoop();
}

export function stopBGM() {
  if (_schedulerTimer) {
    clearTimeout(_schedulerTimer);
    _schedulerTimer = null;
  }
}

// ─── Controles Globales ───────────────────────────────────────────────────────

export function setSfxEnabled(val) {
  _sfxEnabled = !!val;
}

export function isSfxEnabled() {
  return _sfxEnabled;
}

export function setMusicEnabled(val) {
  _musicEnabled = !!val;
  if (_musicEnabled) {
    startBGM();
  } else {
    stopBGM();
  }
}

export function isMusicEnabled() {
  return _musicEnabled;
}

/** Inicializador genérico para compatibilidad */
export function initAudio(startMuted = false) {
  _sfxEnabled = !startMuted;
  _musicEnabled = !startMuted;
}
