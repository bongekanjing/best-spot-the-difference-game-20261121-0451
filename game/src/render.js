// Everything the player sees: the header, the two picture panels with their
// found markers, the footer counter and hints, and the title / round / win /
// time-up overlays. The renderer never decides anything — it paints the world.
import {
  BIG_BTN,
  CANVAS_H,
  CANVAS_W,
  FOOTER_Y,
  HINT_BTN,
  LEFT_X,
  MARK_POP_SECONDS,
  PANEL_H,
  PANEL_W,
  PANEL_Y,
  RIGHT_X,
} from './config.js';
import { createRandom } from './random.js';
import { SCENES } from './scenes.js';
import {
  SCREEN_PLAY,
  SCREEN_ROUND_CLEAR,
  SCREEN_TIME_UP,
  SCREEN_TITLE,
  SCREEN_WIN,
} from './world.js';

const GOLD = '#ffd93b';
const CREAM = '#fdf6e3';
const INK = '#2b2b3a';

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function starsFor(timeLeft, timeLimit) {
  if (timeLeft >= timeLimit * 0.5) return 3;
  if (timeLeft >= timeLimit * 0.25) return 2;
  return 1;
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function drawPanel(x, scene, variant, seed, t, found, foundAt, elapsed, hint) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, PANEL_Y, PANEL_W, PANEL_H);
    ctx.clip();
    ctx.translate(x, PANEL_Y);
    scene.draw(ctx, variant, createRandom(seed), t);
    ctx.restore();
    // Frame and a small corner badge naming the panel.
    ctx.strokeStyle = '#3a2b4d';
    ctx.lineWidth = 4;
    ctx.strokeRect(x, PANEL_Y, PANEL_W, PANEL_H);
    ctx.fillStyle = '#3a2b4d';
    ctx.beginPath();
    ctx.arc(x + 16, PANEL_Y + 16, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CREAM;
    ctx.font = 'bold 17px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(variant ? 'B' : 'A', x + 16, PANEL_Y + 17);
    // Found markers on both panels, popping in when found.
    for (const diff of scene.differences) {
      if (!found.has(diff.id)) continue;
      const age = elapsed - (foundAt.get(diff.id) ?? 0);
      const pop = age < MARK_POP_SECONDS ? 0.6 + 0.4 * (age / MARK_POP_SECONDS) : 1;
      const cx = x + diff.x;
      const cy = PANEL_Y + diff.y;
      const r = (diff.r + 8) * pop;
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = GOLD;
      ctx.beginPath();
      ctx.arc(cx, cy, 13 * pop, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy);
      ctx.lineTo(cx - 1, cy + 5);
      ctx.lineTo(cx + 7, cy - 5);
      ctx.stroke();
    }
    // Hint pulse on the unfound difference.
    if (hint) {
      const pulse = 1 + 0.25 * Math.sin(elapsed * 6);
      const cx = x + hint.diff.x;
      const cy = PANEL_Y + hint.diff.y;
      ctx.strokeStyle = '#6bcBff';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, (hint.diff.r + 12) * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function drawHeader(state, scene) {
    ctx.fillStyle = '#241d33';
    ctx.fillRect(0, 0, CANVAS_W, 96);
    ctx.fillStyle = GOLD;
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('TWIN TALES', 24, 34);
    ctx.fillStyle = '#cbb8ff';
    ctx.font = '18px sans-serif';
    ctx.fillText('Spot the Difference', 24, 68);
    ctx.textAlign = 'center';
    ctx.fillStyle = CREAM;
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`Round ${state.roundIndex + 1} of 3 — ${scene.name}`, 640, 32);
    ctx.fillStyle = '#cbb8ff';
    ctx.font = '16px sans-serif';
    ctx.fillText(scene.tagline, 640, 62);
    // Timer, with a bar that drains and turns red under 30 seconds.
    const low = state.timeLeft <= 30;
    ctx.textAlign = 'right';
    ctx.fillStyle = low ? '#ff6b6b' : CREAM;
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(fmtTime(state.timeLeft), 1256, 32);
    ctx.fillStyle = '#4a3560';
    ctx.fillRect(1056, 56, 200, 10);
    ctx.fillStyle = low ? '#ff6b6b' : '#6bcBff';
    ctx.fillRect(1056, 56, 200 * Math.max(0, state.timeLeft / scene.timeLimit), 10);
    ctx.fillStyle = '#cbb8ff';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Score ${state.score}`, 1256, 86);
  }

  function drawFooter(state, scene) {
    ctx.fillStyle = '#241d33';
    ctx.fillRect(0, FOOTER_Y, CANVAS_W, CANVAS_H - FOOTER_Y);
    const total = scene.differences.length;
    const found = state.found.size;
    ctx.textAlign = 'left';
    ctx.fillStyle = CREAM;
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`Found ${found} / ${total}`, 24, FOOTER_Y + 46);
    ctx.fillStyle = found === total ? '#9dff6b' : '#cbb8ff';
    ctx.font = '18px sans-serif';
    ctx.fillText(
      found === total ? 'All found — lovely hunting!' : `${total - found} still hiding — look twice!`,
      24, FOOTER_Y + 82,
    );
    // One dot per difference: gold when found, hollow while hiding.
    const dotsW = total * 34;
    let dx = 640 - dotsW / 2;
    scene.differences.forEach((diff) => {
      const isFound = state.found.has(diff.id);
      ctx.beginPath();
      ctx.arc(dx + 13, FOOTER_Y + 46, 12, 0, Math.PI * 2);
      ctx.fillStyle = isFound ? GOLD : '#4a3560';
      ctx.fill();
      if (!isFound) {
        ctx.strokeStyle = '#cbb8ff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(dx + 8, FOOTER_Y + 46);
        ctx.lineTo(dx + 12, FOOTER_Y + 51);
        ctx.lineTo(dx + 19, FOOTER_Y + 41);
        ctx.stroke();
      }
      dx += 34;
    });
    // Hint button.
    const disabled = state.hintsLeft <= 0;
    ctx.fillStyle = disabled ? '#4a3560' : '#3a7bd5';
    ctx.beginPath();
    ctx.roundRect(HINT_BTN.x, HINT_BTN.y, HINT_BTN.w, HINT_BTN.h, 12);
    ctx.fill();
    ctx.fillStyle = disabled ? '#8a7fa8' : CREAM;
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Hint  (${state.hintsLeft} left)`, HINT_BTN.x + HINT_BTN.w / 2, HINT_BTN.y + HINT_BTN.h / 2 + 1);
    ctx.fillStyle = '#cbb8ff';
    ctx.font = '15px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Click a difference · H hint · P pause', 1036, FOOTER_Y + 116);
    ctx.textAlign = 'left';
    ctx.fillText(state.lastFoundName ? `Last find: ${state.lastFoundName}` : 'Find every difference before time runs out.', 24, FOOTER_Y + 116);
    // Wrong-click flash.
    if (state.missFlash) {
      const fx = (state.missFlash.panel === 'left' ? LEFT_X : RIGHT_X) + state.missFlash.x;
      const fy = PANEL_Y + state.missFlash.y;
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(fx - 12, fy - 12);
      ctx.lineTo(fx + 12, fy + 12);
      ctx.moveTo(fx + 12, fy - 12);
      ctx.lineTo(fx - 12, fy + 12);
      ctx.stroke();
      ctx.fillStyle = '#ff6b6b';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Not that one!  −10', fx, fy - 22);
    }
  }

  function drawOverlay(title, lines, buttonLabel, stars) {
    ctx.fillStyle = 'rgba(20, 14, 32, 0.72)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#241d33';
    ctx.beginPath();
    ctx.roundRect(340, 150, 600, 380, 20);
    ctx.fill();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = GOLD;
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(title, 640, 222);
    if (stars) {
      ctx.font = '44px sans-serif';
      ctx.fillText('★'.repeat(stars) + '☆'.repeat(3 - stars), 640, 282);
    }
    ctx.fillStyle = CREAM;
    ctx.font = '20px sans-serif';
    lines.forEach((line, i) => ctx.fillText(line, 640, 322 + i * 34));
    ctx.fillStyle = '#3a7bd5';
    ctx.beginPath();
    ctx.roundRect(BIG_BTN.x, BIG_BTN.y, BIG_BTN.w, BIG_BTN.h, 12);
    ctx.fill();
    ctx.fillStyle = CREAM;
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(buttonLabel, 640, BIG_BTN.y + BIG_BTN.h / 2 + 1);
    ctx.fillStyle = '#cbb8ff';
    ctx.font = '16px sans-serif';
    ctx.fillText('or press the key in brackets', 640, BIG_BTN.y + BIG_BTN.h + 28);
  }

  function draw(state, scene, screen, t) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#241d33';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawHeader(state, scene);
    drawPanel(LEFT_X, scene, false, state.seed, t, state.found, state.foundAt, state.elapsed, state.hint);
    drawPanel(RIGHT_X, scene, true, state.seed, t, state.found, state.foundAt, state.elapsed, state.hint);
    drawFooter(state, scene);

    if (screen === SCREEN_TITLE) {
      ctx.fillStyle = 'rgba(20, 14, 32, 0.78)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.textAlign = 'center';
      ctx.fillStyle = GOLD;
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText('TWIN TALES', 640, 250);
      ctx.fillStyle = CREAM;
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('Spot the Difference', 640, 300);
      ctx.font = '21px sans-serif';
      ctx.fillText('Two pictures sit side by side. They look the same — they are not.', 640, 366);
      ctx.fillText('Click every difference on either picture. Rings mark your finds.', 640, 400);
      ctx.fillText('Three rounds, 5 then 7 then 9 differences, against the clock.', 640, 434);
      ctx.fillStyle = '#9dff6b';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('Click anywhere, or press Space, to start hunting', 640, 500);
      ctx.fillStyle = '#cbb8ff';
      ctx.font = '17px sans-serif';
      ctx.fillText('H hint (3 a round) · P pause · R restart', 640, 540);
    } else if (screen === SCREEN_ROUND_CLEAR) {
      drawOverlay(
        'Round Clear!',
        [
          `You found all ${scene.differences.length} differences in ${scene.name}.`,
          `Time bonus banked. Score: ${state.score}`,
          `Next up: ${state.roundIndex + 1 < SCENES.length ? 'a harder picture' : 'the final picture'}.`,
        ],
        'Next Round  (N)',
        starsFor(state.timeLeft, scene.timeLimit),
      );
    } else if (screen === SCREEN_WIN) {
      drawOverlay(
        'You Found Them All!',
        [
          `All 21 differences across three pictures — sharp eyes!`,
          `Final score: ${state.score}   ·   Misses: ${state.misses}`,
          `Best score: ${Math.max(state.best, state.score)}`,
        ],
        'Play Again  (R)',
        3,
      );
    } else if (screen === SCREEN_TIME_UP) {
      drawOverlay(
        "Time's Up!",
        [
          `You found ${state.found.size} of ${scene.differences.length} differences in ${scene.name}.`,
          `${scene.differences.length - state.found.size} were still hiding. So close!`,
          `Score so far: ${state.score}`,
        ],
        'Try Again  (R)',
        0,
      );
    }
  }

  return { draw };
}
