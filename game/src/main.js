// Boot and render loop for Gull Cove.
// Draws the current scene twice (variant A on the left, B on the right),
// then the found markers, the hint pulse and the miss flashes on both
// panels, and keeps the HUD and the overlays in step with the game state.

import { SCENES } from './scenes.js';
import { createGame } from './game.js';

const SCENE_W = 600;
const SCENE_H = 450;

const $ = (id) => document.getElementById(id);
const canvasA = $('canvas-a');
const canvasB = $('canvas-b');
const ctxA = canvasA.getContext('2d');
const ctxB = canvasB.getContext('2d');

const game = createGame();

/** A found marker: a green ring with a check, popping in just after the find. */
function drawMarker(ctx, diff, now) {
  const foundAt = game.foundAt().get(diff.id);
  const age = foundAt === undefined ? 1000 : now - foundAt;
  const pop = 1 + 0.45 * Math.exp(-age / 160);
  const r = (diff.r + 7) * pop;
  ctx.save();
  ctx.strokeStyle = '#37d67a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(diff.x - r * 0.45, diff.y);
  ctx.lineTo(diff.x - r * 0.1, diff.y + r * 0.35);
  ctx.lineTo(diff.x + r * 0.5, diff.y - r * 0.35);
  ctx.stroke();
  ctx.restore();
}

/** The hint's pulsing dashed circle, drawn on both panels at once. */
function drawHint(ctx, diff, now) {
  const pulse = 0.55 + 0.45 * Math.sin(now / 180);
  ctx.save();
  ctx.strokeStyle = `rgba(255,209,102,${0.5 + 0.5 * pulse})`;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r + 10 + 3 * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** A red X where a click found nothing, fading fast. */
function drawMiss(ctx, miss, now) {
  const age = now - miss.at;
  const alpha = Math.max(0, 1 - age / 450);
  const s = 10;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ff5a5a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(miss.x - s, miss.y - s);
  ctx.lineTo(miss.x + s, miss.y + s);
  ctx.moveTo(miss.x + s, miss.y - s);
  ctx.lineTo(miss.x - s, miss.y + s);
  ctx.stroke();
  ctx.restore();
}

/** One frame: both panels, then every marker on both. */
function render(now) {
  const scene = game.scene();
  const found = game.foundIds();
  const hint = game.hint();
  const misses = game.misses();
  for (const [ctx, variant] of [[ctxA, 0], [ctxB, 1]]) {
    ctx.clearRect(0, 0, SCENE_W, SCENE_H);
    scene.draw(ctx, SCENE_W, SCENE_H, variant);
    for (const d of scene.differences) if (found.has(d.id)) drawMarker(ctx, d, now);
    if (hint) {
      const d = scene.differences.find((x) => x.id === hint.id);
      if (d) drawHint(ctx, d, now);
    }
    for (const m of misses) drawMiss(ctx, m, now);
  }
}

/** mm:ss for the countdown. */
function clock(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function show(id, on) {
  $(id).classList.toggle('hidden', !on);
}

/** The hint's whispered clue, shown in the subtitle slot for a few seconds. */
let hintMessage = '';
let hintMessageUntil = 0;
function showHint(pick) {
  if (!pick) return;
  hintMessage = pick.hint;
  hintMessageUntil = performance.now() + 5000;
}

function syncHud() {
  const s = game.snapshot();
  $('hud-round').textContent = s.roundName;
  $('hud-sub').textContent = performance.now() < hintMessageUntil ? hintMessage : s.roundSubtitle;
  $('hud-found').textContent = `Found ${s.foundCount} / ${s.totalDiffs} · ${s.remaining} to go`;
  $('hud-time').textContent = clock(s.timeLeft);
  $('hud-timebar').style.width = `${(s.timeLeft / SCENES[s.roundIndex].timeLimit) * 100}%`;
  $('hud-timebar').classList.toggle('low', s.timeLeft <= 30);
  $('hud-score').textContent = `Score ${s.score}`;
  $('btn-hint').textContent = `Hint (${s.hintsLeft})`;
  $('btn-hint').disabled = s.hintsLeft <= 0 || s.status !== 'playing';
  $('btn-mute').textContent = s.muted ? 'Sound off' : 'Sound on';
  show('overlay-menu', s.status === 'menu');
  show('overlay-round', s.status === 'roundDone');
  show('overlay-time', s.status === 'timeUp');
  show('overlay-end', s.status === 'finished');
  if (s.status === 'roundDone') {
    $('round-score').textContent = `Round score ${s.roundScore} — total ${s.score}`;
  }
  if (s.status === 'finished') {
    $('end-score').textContent = `You found all ${SCENES.length * 8} differences! Score ${s.score} · ${Math.floor(s.totalTime / 60)}:${String(s.totalTime % 60).padStart(2, '0')}`;
  }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  game.tick(dt);
  render(now);
  syncHud();
  requestAnimationFrame(frame);
}

/** A canvas click, in scene space, on either panel. */
function onPanelClick(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * SCENE_W;
  const y = ((event.clientY - rect.top) / rect.height) * SCENE_H;
  game.click(x, y);
}

canvasA.addEventListener('click', onPanelClick);
canvasB.addEventListener('click', onPanelClick);

$('btn-start').addEventListener('click', () => game.start());
$('btn-next').addEventListener('click', () => game.nextRound());
$('btn-retry').addEventListener('click', () => game.retryRound());
$('btn-again').addEventListener('click', () => game.restartAll());
$('btn-hint').addEventListener('click', () => showHint(game.useHint()));
$('btn-mute').addEventListener('click', () => {
  game.sounds.setMuted(!game.sounds.isMuted());
  syncHud();
});
$('btn-restart').addEventListener('click', () => game.restartAll());

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') {
    showHint(game.useHint());
  } else if (event.key === 'r' || event.key === 'R') {
    game.retryRound();
  } else if (event.key === 'm' || event.key === 'M') {
    game.sounds.setMuted(!game.sounds.isMuted());
    syncHud();
  } else if (event.key === 'Enter') {
    const s = game.snapshot();
    if (s.status === 'menu') game.start();
    else if (s.status === 'roundDone') game.nextRound();
    else if (s.status === 'timeUp') game.retryRound();
    else if (s.status === 'finished') game.restartAll();
  }
});

// The menu shows the first scene behind it, so the game is visible at once.
render(performance.now());
syncHud();
requestAnimationFrame(frame);
