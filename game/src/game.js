// The rules of Gull Cove: rounds, clicks, timer, hints and score.
// The game knows nothing about the DOM or the canvas — main.js renders
// whatever this module's state says, so the rules are testable on their own.

import { SCENES } from './scenes.js';

const POINTS_PER_FIND = 100;
const ROUND_BONUS_PER_SECOND = 10;
const HINTS_PER_ROUND = 3;
const HINT_SECONDS = 2.5;
const MISS_FLASH_MS = 450;

/** Tiny WebAudio synth: a pop for a find, a buzz for a miss, a chime for a round. */
function makeSounds() {
  let ctx = null;
  let muted = false;
  const ensure = () => {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        ctx = null;
      }
    }
    if (ctx && ctx.state === 'suspended') void ctx.resume();
    return ctx;
  };
  const tone = (freq, start, dur, type = 'sine', vol = 0.12) => {
    const ac = ensure();
    if (!ac || muted) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime + start);
    gain.gain.setValueAtTime(vol, ac.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(ac.currentTime + start);
    osc.stop(ac.currentTime + start + dur + 0.02);
  };
  return {
    pop() {
      tone(660, 0, 0.09);
      tone(990, 0.06, 0.12);
    },
    wrong() {
      tone(150, 0, 0.12, 'square', 0.06);
    },
    win() {
      tone(523, 0, 0.14);
      tone(659, 0.12, 0.14);
      tone(784, 0.24, 0.22);
    },
    setMuted(m) {
      muted = m;
    },
    isMuted: () => muted,
  };
}

export function createGame() {
  const sounds = makeSounds();
  const state = {
    status: 'menu', // menu | playing | roundDone | timeUp | finished
    roundIndex: 0,
    found: new Set(),
    foundAt: new Map(), // difference id -> performance.now() of the find
    misses: [], // { x, y, at } red-X flashes, in scene space
    hint: null, // { id, until } pulsing circle, or null
    hintsLeft: HINTS_PER_ROUND,
    score: 0,
    roundScore: 0,
    timeLeft: SCENES[0].timeLimit,
    totalTime: 0,
    message: '',
  };

  const scene = () => SCENES[state.roundIndex];
  const totalDiffs = () => scene().differences.length;

  function startRound(index) {
    state.roundIndex = index;
    state.found = new Set();
    state.foundAt = new Map();
    state.misses = [];
    state.hint = null;
    state.hintsLeft = HINTS_PER_ROUND;
    state.roundScore = 0;
    state.timeLeft = scene().timeLimit;
    state.status = 'playing';
    state.message = '';
  }

  function start() {
    state.score = 0;
    state.totalTime = 0;
    startRound(0);
  }

  /** A click in scene space (either panel — the panels are the same scene). */
  function click(x, y) {
    if (state.status !== 'playing') return null;
    const now = performance.now();
    for (const d of scene().differences) {
      if (state.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= (d.r + 10) * (d.r + 10)) {
        state.found.add(d.id);
        state.foundAt.set(d.id, now);
        state.score += POINTS_PER_FIND;
        state.roundScore += POINTS_PER_FIND;
        sounds.pop();
        if (state.found.size === totalDiffs()) {
          const bonus = Math.round(state.timeLeft) * ROUND_BONUS_PER_SECOND;
          state.score += bonus;
          state.roundScore += bonus;
          sounds.win();
          state.status = state.roundIndex === SCENES.length - 1 ? 'finished' : 'roundDone';
        }
        return { type: 'found', diff: d };
      }
    }
    state.misses.push({ x, y, at: now });
    sounds.wrong();
    return { type: 'miss', x, y };
  }

  /** Highlight one unfound difference on both panels for a few seconds. */
  function useHint() {
    if (state.status !== 'playing' || state.hintsLeft <= 0) return null;
    const remaining = scene().differences.filter((d) => !state.found.has(d.id));
    if (remaining.length === 0) return null;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft -= 1;
    state.hint = { id: pick.id, until: performance.now() + HINT_SECONDS * 1000 };
    return pick;
  }

  function nextRound() {
    if (state.status === 'roundDone') startRound(state.roundIndex + 1);
  }

  function retryRound() {
    startRound(state.roundIndex);
  }

  function restartAll() {
    start();
  }

  /** Advance the clock; called every animation frame with seconds elapsed. */
  function tick(dt) {
    if (state.status !== 'playing') return;
    state.timeLeft -= dt;
    state.totalTime += dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.status = 'timeUp';
      sounds.wrong();
    }
    const now = performance.now();
    state.misses = state.misses.filter((m) => now - m.at < MISS_FLASH_MS);
    if (state.hint && now > state.hint.until) state.hint = null;
  }

  function snapshot() {
    return {
      status: state.status,
      roundIndex: state.roundIndex,
      roundName: scene().name,
      roundSubtitle: scene().subtitle,
      foundCount: state.found.size,
      totalDiffs: totalDiffs(),
      remaining: totalDiffs() - state.found.size,
      hintsLeft: state.hintsLeft,
      score: state.score,
      roundScore: state.roundScore,
      timeLeft: Math.max(0, Math.ceil(state.timeLeft)),
      totalTime: Math.round(state.totalTime),
      rounds: SCENES.length,
      muted: sounds.isMuted(),
    };
  }

  return {
    state,
    scene,
    start,
    click,
    useHint,
    nextRound,
    retryRound,
    restartAll,
    tick,
    snapshot,
    sounds,
    foundAt: () => state.foundAt,
    misses: () => state.misses,
    hint: () => state.hint,
    foundIds: () => state.found,
  };
}
