// The rules of Twin Tales: rounds, clicks, hints, the timer, scoring. No drawing
// here — the renderer only paints what this state says.
import {
  BIG_BTN,
  HINT_BTN,
  HINT_PULSE_SECONDS,
  LEFT_X,
  MISS_FLASH_SECONDS,
  PANEL_H,
  PANEL_W,
  PANEL_Y,
  POINTS_FOUND,
  POINTS_HINT,
  POINTS_MISS,
  POINTS_TIME_BONUS,
  POINTS_WIN_BONUS,
  RIGHT_X,
} from './config.js';
import { SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_ROUND_CLEAR = 'roundClear';
export const SCREEN_WIN = 'win';
export const SCREEN_TIME_UP = 'timeUp';

export const EVENT_FOUND = 1;
export const EVENT_MISS = 2;
export const EVENT_HINT = 4;
export const EVENT_ROUND_CLEAR = 8;
export const EVENT_WIN = 16;
export const EVENT_TIME_UP = 32;

function inside(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

export function createWorld(seed) {
  const state = {
    seed,
    screen: SCREEN_TITLE,
    roundIndex: 0,
    found: new Set(),
    foundAt: new Map(), // difference id -> seconds since round start, for the pop
    timeLeft: SCENES[0].timeLimit,
    elapsed: 0,
    score: 0,
    hintsLeft: SCENES[0].hints,
    misses: 0,
    hint: null, // { diff, until } while a hint ring pulses
    missFlash: null, // { x, y, until } while a wrong click shows a red X
    lastFoundName: '',
    roundsCleared: 0,
    totalFound: 0,
    best: 0,
  };

  function scene() {
    return SCENES[state.roundIndex];
  }

  function startRound(index) {
    state.roundIndex = index;
    state.found = new Set();
    state.foundAt = new Map();
    state.timeLeft = scene().timeLimit;
    state.elapsed = 0;
    state.hintsLeft = scene().hints;
    state.hint = null;
    state.missFlash = null;
    state.lastFoundName = '';
    state.screen = SCREEN_PLAY;
  }

  function startGame() {
    state.score = 0;
    state.misses = 0;
    state.roundsCleared = 0;
    state.totalFound = 0;
    startRound(0);
  }

  // A click in canvas coordinates. Returns an event bitmask. The panel a click
  // lands in decides which scene coordinates it means; both panels share them.
  function clickAt(x, y) {
    if (state.screen === SCREEN_TITLE) {
      startGame();
      return 0;
    }
    if (state.screen === SCREEN_ROUND_CLEAR) {
      if (inside(BIG_BTN, x, y)) {
        if (state.roundIndex + 1 < SCENES.length) startRound(state.roundIndex + 1);
        else state.screen = SCREEN_WIN;
      }
      return 0;
    }
    if (state.screen === SCREEN_WIN || state.screen === SCREEN_TIME_UP) {
      if (inside(BIG_BTN, x, y)) startGame();
      return 0;
    }
    if (state.screen !== SCREEN_PLAY) return 0;

    if (inside(HINT_BTN, x, y)) return useHint();

    const panel = panelAt(x, y);
    if (!panel) return 0;
    const sx = x - panel.x;
    const sy = y - PANEL_Y;
    // The nearest difference within reach wins, so overlapping hit areas (the
    // tea sign and the vendor's hat) can each still be found after the other.
    let nearest = null;
    let nearestDist = Infinity;
    for (const diff of scene().differences) {
      const dx = sx - diff.x;
      const dy = sy - diff.y;
      const dist = dx * dx + dy * dy;
      const reach = diff.r + 6; // a forgiving touch target
      if (dist <= reach * reach && dist < nearestDist) {
        nearest = diff;
        nearestDist = dist;
      }
    }
    if (nearest) {
      const diff = nearest;
      if (state.found.has(diff.id)) return 0; // tapping a found marker does nothing
      state.found.add(diff.id);
      state.foundAt.set(diff.id, state.elapsed);
      state.score += POINTS_FOUND;
      state.totalFound += 1;
      state.lastFoundName = diff.name;
      state.hint = null;
      if (state.found.size === scene().differences.length) {
        state.score += Math.round(state.timeLeft) * POINTS_TIME_BONUS;
        state.roundsCleared += 1;
        if (state.roundIndex + 1 >= SCENES.length) {
          state.score += POINTS_WIN_BONUS;
          state.screen = SCREEN_WIN;
          return EVENT_FOUND | EVENT_WIN;
        }
        state.screen = SCREEN_ROUND_CLEAR;
        return EVENT_FOUND | EVENT_ROUND_CLEAR;
      }
      return EVENT_FOUND;
    }
    // A click on a picture that finds nothing.
    state.score = Math.max(0, state.score + POINTS_MISS);
    state.misses += 1;
    state.missFlash = { x: sx, y: sy, panel: panel.side, until: state.elapsed + MISS_FLASH_SECONDS };
    return EVENT_MISS;
  }

  function panelAt(x, y) {
    if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
    if (x >= LEFT_X && x <= LEFT_X + PANEL_W) return { x: LEFT_X, side: 'left' };
    if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) return { x: RIGHT_X, side: 'right' };
    return null;
  }

  function useHint() {
    if (state.hintsLeft <= 0) return 0;
    const remaining = scene().differences.filter((d) => !state.found.has(d.id));
    if (remaining.length === 0) return 0;
    const diff = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score + POINTS_HINT);
    state.hint = { diff, until: state.elapsed + HINT_PULSE_SECONDS };
    return EVENT_HINT;
  }

  function step(dt) {
    if (state.screen !== SCREEN_PLAY) return 0;
    state.elapsed += dt;
    state.timeLeft -= dt;
    if (state.hint && state.elapsed >= state.hint.until) state.hint = null;
    if (state.missFlash && state.elapsed >= state.missFlash.until) state.missFlash = null;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = SCREEN_TIME_UP;
      return EVENT_TIME_UP;
    }
    return 0;
  }

  function remaining() {
    return scene().differences.length - state.found.size;
  }

  return { state, scene, startGame, startRound, clickAt, useHint, step, remaining, panelAt };
}
