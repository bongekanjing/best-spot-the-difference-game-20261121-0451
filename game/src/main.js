// Boot and the one loop: input is read every frame, the world advances in fixed
// 1/60 s steps (several in a slow frame, none in a fast one), and the renderer
// paints what is there. The game moves between five screens: title, play, round
// clear, win and time up.
//
// ?seed=N fixes the scene decorations. ?shot=start|play|round2|win (with
// &seed=N) stages that scene instead of running the loop, paints it twice and
// sets window.__shotReady for a screenshot.
import { BEST_KEY, STEP } from './config.js';
import { createWorld, EVENT_FOUND, EVENT_HINT, EVENT_MISS, EVENT_ROUND_CLEAR, EVENT_TIME_UP, EVENT_WIN, SCREEN_PLAY, SCREEN_ROUND_CLEAR, SCREEN_TIME_UP, SCREEN_TITLE, SCREEN_WIN } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_NEXT, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createRenderer } from './render.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';

/** The longest frame the loop catches up on; a longer stall (a hidden tab) is dropped, not replayed. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(seed);
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

// A debug handle for play-testing: the page's own state, readable from the console.
window.__game = { world, seed };

function runShot(name) {
  const screen = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, world.scene(), screen, 4.2);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let best = readBest();
  world.state.best = best;
  let accumulator = 0;
  let last = performance.now();
  let paused = false;

  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    world.startGame();
    accumulator = 0;
    paused = false;
    screen = SCREEN_PLAY;
    announce(`Playing. Find ${world.scene().differences.length} differences in ${world.scene().name}.`);
  }

  function handleEvents(events) {
    if (events & EVENT_FOUND) {
      audio.found();
      announce(`Found: ${world.state.lastFoundName}. ${world.remaining()} to go.`);
    }
    if (events & EVENT_MISS) {
      audio.miss();
      announce('Not a difference. Ten points lost.');
    }
    if (events & EVENT_HINT) {
      audio.hint();
      announce('Hint: look inside the blue ring.');
    }
    if (events & EVENT_ROUND_CLEAR) {
      audio.roundClear();
      screen = SCREEN_ROUND_CLEAR;
      announce(`Round clear! Score ${world.state.score}.`);
    }
    if (events & EVENT_WIN) {
      audio.win();
      screen = SCREEN_WIN;
      if (world.state.score > best) {
        best = world.state.score;
        world.state.best = best;
        saveBest(best);
      }
      announce(`You found them all! Final score ${world.state.score}.`);
    }
    if (events & EVENT_TIME_UP) {
      audio.timeUp();
      screen = SCREEN_TIME_UP;
      announce(`Time's up. You found ${world.state.found.size} of ${world.scene().differences.length}.`);
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_RESTART && screen !== SCREEN_TITLE) startGame();
    else if (actions & ACTION_CONFIRM && (screen === SCREEN_TITLE || screen === SCREEN_WIN || screen === SCREEN_TIME_UP)) startGame();
    else if (actions & ACTION_NEXT && screen === SCREEN_ROUND_CLEAR) {
      world.clickAt(640, 595); // the Next Round button's centre
    } else if (actions & ACTION_HINT && screen === SCREEN_PLAY) {
      handleEvents(world.useHint());
    } else if (actions & ACTION_PAUSE && screen === SCREEN_PLAY) {
      paused = !paused;
      announce(paused ? 'Paused.' : 'Playing.');
    }
    for (const click of input.takeClicks()) {
      audio.unlock();
      handleEvents(world.clickAt(click.x, click.y));
      screen = world.state.screen;
    }
    screen = world.state.screen;
  }

  function step() {
    if (screen !== SCREEN_PLAY || paused) return;
    handleEvents(world.step(STEP));
    screen = world.state.screen;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    if (screen === SCREEN_TITLE || screen === SCREEN_PLAY) {
      while (accumulator >= STEP && (screen === SCREEN_TITLE || screen === SCREEN_PLAY)) {
        step();
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }
    renderer.draw(world.state, world.scene(), screen, now / 1000);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      paused = true;
      announce('Paused.');
    }
  });

  announce('Twin Tales, spot the difference. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
