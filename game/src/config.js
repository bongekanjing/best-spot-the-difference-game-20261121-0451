// Twin Tales — Spot the Difference. Layout and tuning in one place, so the world,
// the renderer and the input all agree on where every panel and button lives.
// Canvas is a fixed 1280 x 800 logical board, scaled by CSS to fit the window.
export const CANVAS_W = 1280;
export const CANVAS_H = 800;

export const STEP = 1 / 60;

// The two picture panels. Each scene is drawn in a PANEL_W x PANEL_H box.
export const PANEL_W = 580;
export const PANEL_H = 510;
export const PANEL_Y = 104;
export const LEFT_X = 24;
export const RIGHT_X = 676;

// Footer strip with the counter, the progress dots and the hint button.
export const FOOTER_Y = 626;
export const HINT_BTN = { x: 1052, y: 640, w: 204, h: 64 };

// Centred overlay buttons on the round-clear, win and time-up screens.
export const BIG_BTN = { x: 540, y: 566, w: 200, h: 58 };

// Scoring.
export const POINTS_FOUND = 100;
export const POINTS_MISS = -10;
export const POINTS_HINT = -15;
export const POINTS_TIME_BONUS = 5; // per second left when a round is cleared
export const POINTS_WIN_BONUS = 500;
export const MISS_TIME_PENALTY = 0; // a miss costs points, never time

export const BEST_KEY = 'twin-tales-best';

// How long a found marker pops, a hint ring pulses and a wrong click flashes (seconds).
export const MARK_POP_SECONDS = 0.35;
export const HINT_PULSE_SECONDS = 3;
export const MISS_FLASH_SECONDS = 0.6;
