// The three rounds of Gull Cove: each scene draws itself twice, once per
// panel, and a `variant` of 1 flips every difference to its B state.
// A difference is { id, x, y, r, hint }: where to click and what the
// hint button whispers. Coordinates are in the 600x450 scene space.

import { sky, disc, blob, poly, rr, sparkle, gull, pine, lantern, cat, jar, label } from './art.js';

/** Draw the shared dusk sky: gradient, early stars, soft clouds. */
function duskSky(ctx, w, h) {
  sky(ctx, w, h, [[0, '#1c2450'], [0.45, '#5b3a7a'], [0.72, '#c96a5e'], [1, '#ff9e64']]);
  for (const [x, y, r] of [[60, 40, 3], [150, 90, 2], [300, 35, 2.5], [420, 60, 2]]) sparkle(ctx, x, y, r, '#fff8e0');
  blob(ctx, 120, 110, 46, 12, 'rgba(255,190,160,0.35)');
  blob(ctx, 380, 80, 56, 13, 'rgba(255,190,160,0.3)');
}

/** Round 1: dusk at Gull Cove — lighthouse, cottage, boat, one sleepy cat. */
function drawCove(ctx, w, h, variant) {
  duskSky(ctx, w, h);
  // setting sun, half-dipped in the sea
  disc(ctx, 470, 292, 26, '#ffd166');
  disc(ctx, 470, 292, 34, 'rgba(255,209,102,0.25)');
  // sea
  const sea = ctx.createLinearGradient(0, 300, 0, h);
  sea.addColorStop(0, '#2e5f7a');
  sea.addColorStop(1, '#16324a');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, w, h - 300);
  // sun's reflection column
  ctx.fillStyle = 'rgba(255,209,102,0.35)';
  for (let i = 0; i < 5; i++) ctx.fillRect(452 + i * 8, 306 + i * 24, 30 - i * 3, 4);
  // wave strokes
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 2;
  for (const [x, y, len] of [[60, 330, 70], [200, 360, 90], [330, 340, 60], [120, 410, 80], [300, 420, 70], [480, 390, 80]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();
  }
  // cliffs, left
  poly(ctx, [[0, 200], [70, 250], [110, 300], [140, 450], [0, 450]], '#3a3348');
  poly(ctx, [[0, 200], [70, 250], [40, 300], [0, 320]], '#4a4260');
  // rocks under the lighthouse, right
  poly(ctx, [[440, 450], [470, 350], [560, 340], [600, 400], [600, 450]], '#3a3348');
  // cottage
  ctx.fillStyle = '#f2e3c6';
  ctx.fillRect(95, 300, 110, 70);
  poly(ctx, [[85, 302], [150, 262], [215, 302]], '#8c3b2e');
  // chimney + smoke (difference 4)
  ctx.fillStyle = '#6e3b2a';
  ctx.fillRect(185, 268, 14, 26);
  if (variant === 0) {
    blob(ctx, 196, 252, 10, 7, 'rgba(240,240,240,0.75)');
    blob(ctx, 204, 238, 13, 8, 'rgba(240,240,240,0.55)');
    blob(ctx, 214, 222, 15, 9, 'rgba(240,240,240,0.35)');
  }
  // cat asleep on the roof (difference 8)
  if (variant === 0) cat(ctx, 175, 278, 13, '#2b2118');
  // door + window (difference 3: lit vs dark)
  ctx.fillStyle = '#5a3a26';
  ctx.fillRect(138, 332, 22, 38);
  ctx.fillStyle = variant === 0 ? '#ffd166' : '#2c2438';
  ctx.fillRect(176, 318, 20, 20);
  ctx.strokeStyle = '#5a3a26';
  ctx.lineWidth = 2;
  ctx.strokeRect(176, 318, 20, 20);
  // lighthouse tower, striped
  ctx.fillStyle = '#f5efe0';
  ctx.fillRect(498, 210, 34, 140);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(498, 240, 34, 18);
  ctx.fillRect(498, 290, 34, 18);
  // gallery + lamp room
  ctx.fillStyle = '#2b2118';
  ctx.fillRect(492, 196, 46, 14);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(500, 176, 30, 20);
  ctx.fillStyle = '#2b2118';
  poly(ctx, [[496, 176], [515, 160], [534, 176]], '#2b2118');
  // the beam (difference 1): a wedge of light, only in A
  if (variant === 0) {
    const beam = ctx.createLinearGradient(500, 186, 330, 120);
    beam.addColorStop(0, 'rgba(255,224,130,0.55)');
    beam.addColorStop(1, 'rgba(255,224,130,0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(500, 178);
    ctx.lineTo(330, 108);
    ctx.lineTo(330, 168);
    ctx.closePath();
    ctx.fill();
  }
  // boat with its flag (difference 5: red vs blue)
  poly(ctx, [[385, 335], [435, 335], [425, 352], [395, 352]], '#4a2c20');
  ctx.strokeStyle = '#4a2c20';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(410, 335);
  ctx.lineTo(410, 292);
  ctx.stroke();
  poly(ctx, [[410, 294], [410, 322], [434, 312]], '#f5efe0');
  poly(ctx, [[410, 292], [430, 296], [410, 301]], variant === 0 ? '#c0392b' : '#2e6fb0');
  // gulls: three in A, two in B (difference 2)
  gull(ctx, 130, 70, 12, '#1c2450');
  gull(ctx, 250, 55, 10, '#1c2450');
  if (variant === 0) gull(ctx, 175, 95, 11, '#1c2450');
  // one bright star, A only (difference 7)
  if (variant === 0) sparkle(ctx, 525, 42, 5, '#fff8e0');
  // foreground grass + one tulip (difference 6: red vs yellow)
  ctx.fillStyle = '#22442c';
  ctx.fillRect(0, 420, w, 30);
  ctx.strokeStyle = '#2e5a38';
  ctx.lineWidth = 2;
  for (const x of [40, 90, 200, 340, 460, 560]) {
    ctx.beginPath();
    ctx.moveTo(x, 450);
    ctx.lineTo(x + 6, 424);
    ctx.stroke();
  }
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(285, 428);
  ctx.lineTo(285, 410);
  ctx.stroke();
  disc(ctx, 285, 406, 6, variant === 0 ? '#d63031' : '#f5c542');
}

/** Round 2: the night market — lanterns, jars, bunting and a cat on a crate. */
function drawMarket(ctx, w, h, variant) {
  sky(ctx, w, h, [[0, '#0d1b3e'], [0.6, '#1d2f5e'], [1, '#2c4a7a']]);
  for (const [x, y, r] of [[50, 50, 2.5], [200, 40, 2], [330, 70, 2.5], [470, 35, 2], [90, 110, 2]]) sparkle(ctx, x, y, r, '#fff8e0');
  // moon: full in A, a crescent in B (difference 4)
  disc(ctx, 505, 65, 26, '#f5ead0');
  if (variant === 1) disc(ctx, 516, 58, 24, '#1d2f5e');
  // string lights across the top
  ctx.strokeStyle = '#0a1226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(300, 95, 600, 30);
  ctx.stroke();
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    const x = t * 600;
    const y = 30 + Math.sin(t * Math.PI) * 48;
    disc(ctx, x, y + 6, 4, ['#ff5a5a', '#ffd166', '#7ec8e3'][i % 3]);
  }
  // back buildings
  ctx.fillStyle = '#101d3d';
  ctx.fillRect(0, 190, 80, 260);
  ctx.fillRect(520, 170, 80, 280);
  // stall: posts, counter, striped awning
  ctx.fillStyle = '#5a3a26';
  ctx.fillRect(120, 170, 10, 200);
  ctx.fillRect(460, 170, 10, 200);
  ctx.fillStyle = '#8a5a32';
  ctx.fillRect(100, 320, 390, 90);
  ctx.fillStyle = '#6e4525';
  ctx.fillRect(100, 320, 390, 10);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#c0392b' : '#f5efe0';
    poly(ctx, [[120 + i * 45, 130], [165 + i * 45, 130], [157 + i * 45, 172], [128 + i * 45, 172]], ctx.fillStyle);
  }
  ctx.fillStyle = '#5a3a26';
  ctx.fillRect(115, 170, 360, 6);
  // sign board with the price (difference 6: 5 vs 8)
  ctx.fillStyle = '#f2e3c6';
  rr(ctx, 150, 202, 60, 48, 6);
  ctx.fill();
  label(ctx, variant === 0 ? '5' : '8', 180, 221, 'bold 26px Georgia, serif', '#8c3b2e');
  label(ctx, 'coins', 180, 240, '10px Georgia, serif', '#5a3a26');
  // bunting under the awning: one flag missing in B (difference 2)
  ctx.strokeStyle = '#0a1226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 178);
  ctx.quadraticCurveTo(300, 205, 470, 178);
  ctx.stroke();
  const flags = ['#ff5a5a', '#ffd166', '#7ec8e3', '#9b59b6', '#ff5a5a', '#ffd166', '#7ec8e3'];
  for (let i = 0; i < 7; i++) {
    if (variant === 1 && i === 3) continue;
    const x = 145 + i * 50;
    poly(ctx, [[x, 186], [x + 26, 186], [x + 13, 208]], flags[i]);
  }
  // hanging lanterns: the middle one is red in A, green in B (difference 1)
  lantern(ctx, 250, 210, 16, '#ff5a5a');
  lantern(ctx, 300, 222, 18, variant === 0 ? '#ff5a5a' : '#3fae6a');
  lantern(ctx, 350, 210, 16, '#ffd166');
  // jars on the counter: three in A, two in B (difference 3)
  jar(ctx, 235, 318, 26, 34, '#7ec8e3');
  jar(ctx, 285, 318, 26, 34, '#9b59b6');
  if (variant === 0) jar(ctx, 260, 318, 26, 34, '#ff8c69');
  // pot with steam (difference 7)
  ctx.fillStyle = '#2b2118';
  rr(ctx, 395, 296, 44, 24, 8);
  ctx.fill();
  if (variant === 0) {
    blob(ctx, 412, 284, 8, 6, 'rgba(240,240,240,0.7)');
    blob(ctx, 420, 270, 10, 7, 'rgba(240,240,240,0.45)');
  }
  // crate + cat (difference 5: tail up vs down)
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(440, 350, 70, 60);
  ctx.strokeStyle = '#5a3a26';
  ctx.lineWidth = 2;
  ctx.strokeRect(440, 350, 70, 60);
  ctx.beginPath();
  ctx.moveTo(440, 380);
  ctx.lineTo(510, 380);
  ctx.stroke();
  cat(ctx, 475, 348, 15, '#1c1c22', variant === 0);
  // firefly, A only (difference 8)
  if (variant === 0) {
    disc(ctx, 85, 140, 3, '#d8ff7a');
    disc(ctx, 85, 140, 9, 'rgba(216,255,122,0.25)');
  }
  // cobblestones
  ctx.fillStyle = '#233a5e';
  ctx.fillRect(0, 410, w, 40);
  ctx.fillStyle = '#2c4a7a';
  for (let row = 0; row < 2; row++) {
    for (let x = 10 + (row % 2) * 25; x < w; x += 50) blob(ctx, x, 420 + row * 16, 20, 7, '#2c4a7a');
  }
}

/** Round 3: observatory hill — dome, pines, campfire and an owl on watch. */
function drawObservatory(ctx, w, h, variant) {
  sky(ctx, w, h, [[0, '#050914'], [0.55, '#0d1b3e'], [1, '#1d2f5e']]);
  // milky way band
  for (const [x, y, r] of [[80, 60, 2], [120, 90, 1.5], [160, 70, 2], [200, 110, 1.5], [240, 80, 2], [280, 120, 1.5], [320, 90, 2], [360, 130, 1.5], [400, 100, 2], [440, 140, 1.5]]) sparkle(ctx, x, y, r, 'rgba(255,255,255,0.8)');
  for (const [x, y, r] of [[60, 150, 2], [520, 50, 2.5], [460, 180, 2], [40, 220, 2], [300, 40, 2]]) sparkle(ctx, x, y, r, '#fff8e0');
  // moon with a crater in A (difference 8)
  disc(ctx, 505, 65, 24, '#f5ead0');
  if (variant === 0) {
    disc(ctx, 498, 58, 5, '#d8c9a3');
    disc(ctx, 512, 72, 3.5, '#d8c9a3');
  }
  // shooting star, A only (difference 5)
  if (variant === 0) {
    const trail = ctx.createLinearGradient(150, 60, 200, 95);
    trail.addColorStop(0, 'rgba(255,255,255,0.9)');
    trail.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = trail;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(150, 60);
    ctx.lineTo(200, 95);
    ctx.stroke();
    disc(ctx, 150, 60, 3, '#ffffff');
  }
  // hill
  ctx.fillStyle = '#0e2418';
  ctx.beginPath();
  ctx.moveTo(0, 450);
  ctx.lineTo(0, 340);
  ctx.quadraticCurveTo(300, 270, 600, 340);
  ctx.lineTo(600, 450);
  ctx.closePath();
  ctx.fill();
  // observatory dome
  ctx.fillStyle = '#c8ccd4';
  ctx.beginPath();
  ctx.arc(300, 300, 62, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9aa0ac';
  ctx.fillRect(238, 296, 124, 10);
  // dome slit: open with the telescope out in A, shut in B (difference 1)
  if (variant === 0) {
    ctx.fillStyle = '#0d1b3e';
    poly(ctx, [[292, 244], [308, 244], [312, 296], [288, 296]], '#0d1b3e');
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(300, 252);
    ctx.lineTo(322, 216);
    ctx.stroke();
    disc(ctx, 324, 213, 7, '#7ec8e3');
  } else {
    ctx.strokeStyle = '#8a8f98';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(300, 300, 62, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // dome window: lit in A, dark in B (difference 6)
  ctx.fillStyle = variant === 0 ? '#ffd166' : '#2c2438';
  rr(ctx, 318, 248, 14, 18, 4);
  ctx.fill();
  // flag on the dome, A only (difference 7)
  if (variant === 0) {
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 238);
    ctx.lineTo(300, 108);
    ctx.stroke();
    poly(ctx, [[300, 108], [326, 114], [300, 120]], '#c0392b');
  }
  // pines: one missing in B (difference 4)
  pine(ctx, 80, 400, 64, '#12351f');
  pine(ctx, 160, 420, 80, '#0e2a18');
  pine(ctx, 525, 360, 72, '#12351f');
  if (variant === 0) pine(ctx, 480, 400, 58, '#0e2a18');
  // branch + owl: the branch is always there, the owl only in A (difference 2)
  ctx.strokeStyle = '#4a3226';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(60, 190);
  ctx.quadraticCurveTo(110, 175, 150, 185);
  ctx.stroke();
  if (variant === 0) {
    blob(ctx, 112, 168, 13, 16, '#8a6f4d');
    disc(ctx, 106, 162, 3, '#ffd166');
    disc(ctx, 118, 162, 3, '#ffd166');
    poly(ctx, [[110, 170], [114, 176], [118, 170]], '#e8a13c');
  }
  // campfire: big flame in A, embers in B (difference 3)
  disc(ctx, 415, 392, 26, 'rgba(255,140,40,0.18)');
  ctx.fillStyle = '#6e6e6e';
  for (const a of [0, 1.2, 2.4, 3.6, 4.8]) disc(ctx, 415 + Math.cos(a) * 16, 392 + Math.sin(a) * 7, 5, '#6e6e6e');
  ctx.strokeStyle = '#4a3226';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(403, 392);
  ctx.lineTo(427, 388);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(427, 392);
  ctx.lineTo(403, 388);
  ctx.stroke();
  if (variant === 0) {
    blob(ctx, 415, 380, 10, 16, '#ff8c28');
    blob(ctx, 415, 372, 6, 11, '#ffd166');
  } else {
    disc(ctx, 411, 388, 3, '#ff8c28');
    disc(ctx, 419, 390, 2.5, '#ff5a3c');
    disc(ctx, 415, 386, 2, '#ffd166');
  }
  // path of pale stones up the hill
  ctx.fillStyle = 'rgba(200,204,212,0.5)';
  for (const [x, y] of [[300, 430], [310, 412], [295, 394], [305, 376], [298, 358]]) blob(ctx, x, y, 5, 3, 'rgba(200,204,212,0.5)');
}

export const SCENES = [
  {
    id: 'cove',
    name: 'Round 1 · Dusk at Gull Cove',
    subtitle: 'The lighthouse keeper lit the lamp — or did he?',
    timeLimit: 180,
    differences: [
      { id: 'beam', x: 400, y: 152, r: 30, hint: 'Look for the lighthouse beam.' },
      { id: 'gull', x: 175, y: 95, r: 17, hint: 'Count the gulls in the sky.' },
      { id: 'window', x: 186, y: 328, r: 15, hint: 'Is the cottage window lit?' },
      { id: 'smoke', x: 204, y: 238, r: 20, hint: 'Something rises from the chimney.' },
      { id: 'flag', x: 420, y: 296, r: 13, hint: 'Check the little boat’s flag.' },
      { id: 'flower', x: 285, y: 406, r: 13, hint: 'One flower in the grass changed colour.' },
      { id: 'star', x: 525, y: 42, r: 11, hint: 'A star is missing from the top right.' },
      { id: 'cat', x: 175, y: 278, r: 17, hint: 'Something sleeps on the cottage roof.' },
    ],
    draw: drawCove,
  },
  {
    id: 'market',
    name: 'Round 2 · The Night Market',
    subtitle: 'Lanterns, jars and one very patient cat.',
    timeLimit: 180,
    differences: [
      { id: 'lantern', x: 300, y: 222, r: 15, hint: 'One lantern changed colour.' },
      { id: 'bunting', x: 308, y: 196, r: 13, hint: 'A flag is missing from the bunting.' },
      { id: 'jar', x: 260, y: 300, r: 15, hint: 'Count the jars on the counter.' },
      { id: 'moon', x: 505, y: 65, r: 24, hint: 'Look closely at the moon.' },
      { id: 'tail', x: 460, y: 348, r: 15, hint: 'The cat’s tail tells a tale.' },
      { id: 'sign', x: 180, y: 227, r: 15, hint: 'The price on the sign changed.' },
      { id: 'steam', x: 416, y: 276, r: 18, hint: 'The pot stopped steaming.' },
      { id: 'firefly', x: 85, y: 140, r: 11, hint: 'A tiny light blinks on the left.' },
    ],
    draw: drawMarket,
  },
  {
    id: 'observatory',
    name: 'Round 3 · Observatory Hill',
    subtitle: 'The dome is open, the owl is watching.',
    timeLimit: 180,
    differences: [
      { id: 'dome', x: 300, y: 260, r: 28, hint: 'Is the dome open or shut?' },
      { id: 'owl', x: 112, y: 168, r: 17, hint: 'Something perches on the branch, left.' },
      { id: 'fire', x: 415, y: 385, r: 20, hint: 'The campfire burned down.' },
      { id: 'pine', x: 480, y: 380, r: 18, hint: 'A pine tree vanished from the hill.' },
      { id: 'shooting', x: 170, y: 75, r: 17, hint: 'A streak crossed the sky.' },
      { id: 'window', x: 325, y: 257, r: 13, hint: 'The little dome window — lit or dark?' },
      { id: 'flag', x: 310, y: 112, r: 13, hint: 'A flag flies from the dome.' },
      { id: 'crater', x: 505, y: 65, r: 18, hint: 'The moon lost a crater.' },
    ],
    draw: drawObservatory,
  },
];
