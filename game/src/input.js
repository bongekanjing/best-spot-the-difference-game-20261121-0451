// Mouse and keyboard input, translated into canvas coordinates and actions.
// The canvas is scaled by CSS to fit the window; clicks are mapped back to the
// fixed 1280 x 800 logical board.
import { CANVAS_H, CANVAS_W } from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_HINT = 2;
export const ACTION_NEXT = 4;
export const ACTION_RESTART = 8;
export const ACTION_PAUSE = 16;

export function createInput(canvas) {
  let actions = 0;
  const clicks = [];

  function toLogical(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    clicks.push(toLogical(event));
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (event.code === 'Space' || event.code === 'Enter') {
      actions |= ACTION_CONFIRM;
      event.preventDefault();
    } else if (event.code === 'KeyH') actions |= ACTION_HINT;
    else if (event.code === 'KeyN') actions |= ACTION_NEXT;
    else if (event.code === 'KeyR') actions |= ACTION_RESTART;
    else if (event.code === 'KeyP' || event.code === 'Escape') actions |= ACTION_PAUSE;
  });

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    takeClicks() {
      return clicks.splice(0, clicks.length);
    },
  };
}
