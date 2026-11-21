// The screenshot scenes behind ?shot=start|play|round2|win. Each one stages a
// real game state through the world's own click path — a found difference in a
// screenshot was really clicked, with the real rules — then freezes the timer so
// the frame is identical every run for the same seed.
import { LEFT_X, PANEL_Y } from './config.js';
import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './world.js';

function clickDifference(world, diff) {
  world.clickAt(LEFT_X + diff.x, PANEL_Y + diff.y);
}

export function stageShot(name, world) {
  const state = world.state;
  if (name === 'start') {
    state.screen = SCREEN_TITLE;
    return SCREEN_TITLE;
  }
  if (name === 'play') {
    world.startGame();
    const scene = world.scene();
    clickDifference(world, scene.differences[0]);
    clickDifference(world, scene.differences[2]);
    state.timeLeft = 97;
    state.elapsed = 23;
    return SCREEN_PLAY;
  }
  if (name === 'round2') {
    world.startGame();
    world.startRound(1);
    const scene = world.scene();
    clickDifference(world, scene.differences[0]);
    clickDifference(world, scene.differences[3]);
    clickDifference(world, scene.differences[5]);
    state.timeLeft = 118;
    state.elapsed = 32;
    return SCREEN_PLAY;
  }
  if (name === 'win') {
    world.startGame();
    world.startRound(2);
    const scene = world.scene();
    for (const diff of scene.differences) clickDifference(world, diff);
    state.screen = SCREEN_WIN;
    state.timeLeft = 64;
    state.elapsed = 116;
    return SCREEN_WIN;
  }
  state.screen = SCREEN_TITLE;
  return SCREEN_TITLE;
}
