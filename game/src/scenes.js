// The three picture sets. Each scene draws the same world twice: once as the
// original (variant false) and once with its differences applied (variant true).
// A difference is data — an id, a hit position and a radius — plus a branch in the
// drawing code, so the two panels can only ever differ where a difference says so.
// Decorations use the seeded rng passed in, so both panels get identical scatter.
//
// Scene coordinates: 0..580 across, 0..510 down, inside one picture panel.

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rr(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 8 * s, 15 * s, 0, Math.PI * 2);
  ctx.arc(x + 40 * s, y, 17 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 14 * s, y, 68 * s, 14 * s);
}

function gull(ctx, x, y, s, stroke) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x - 8 * s, y, 8 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.arc(x + 8 * s, y, 8 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

function tulip(ctx, x, y, colour) {
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 22);
  ctx.stroke();
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 4);
  ctx.quadraticCurveTo(x - 9, y - 18, x, y - 12);
  ctx.quadraticCurveTo(x + 9, y - 18, x + 9, y - 4);
  ctx.quadraticCurveTo(x, y + 2, x - 9, y - 4);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Scene 1 — Morning Garden. 5 differences, a gentle first hunt.
// ---------------------------------------------------------------------------
function drawGarden(ctx, variant, rng, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#8ec9ee');
  sky.addColorStop(1, '#fdf3c9');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 580, 320);
  // Sun, top left. Difference 1: in A it smiles, in B it is plain.
  circle(ctx, 85, 75, 34, '#ffd93b');
  ctx.strokeStyle = '#f5b301';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2 + t * 0.1;
    ctx.beginPath();
    ctx.moveTo(85 + Math.cos(a) * 42, 75 + Math.sin(a) * 42);
    ctx.lineTo(85 + Math.cos(a) * 52, 75 + Math.sin(a) * 52);
    ctx.stroke();
  }
  if (!variant) {
    circle(ctx, 75, 70, 3.5, '#7a5200');
    circle(ctx, 95, 70, 3.5, '#7a5200');
    ctx.strokeStyle = '#7a5200';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(85, 78, 12, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  // Clouds. Difference 5: the middle cloud is missing in B.
  cloud(ctx, 180, 60, 0.9);
  if (!variant) cloud(ctx, 330, 82, 1.05);
  cloud(ctx, 470, 55, 0.8);
  // Rolling hills.
  ellipse(ctx, 120, 560, 330, 190, '#7cc46a');
  ellipse(ctx, 480, 580, 330, 200, '#66b354');
  // Pond, bottom left. Difference 4: the duck is gone in B.
  ellipse(ctx, 125, 435, 95, 34, '#5db8d6');
  ellipse(ctx, 125, 435, 78, 26, '#79c9e2');
  ctx.strokeStyle = '#3f93b5';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(95 + i * 32, 440 + (i % 2) * 8, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  if (!variant) {
    ellipse(ctx, 128, 428, 16, 11, '#ffffff');
    circle(ctx, 142, 418, 8, '#ffffff');
    poly(ctx, [[149, 416], [157, 419], [149, 422]], '#f5a623');
    circle(ctx, 144, 416, 1.8, '#222222');
    ctx.strokeStyle = '#f5a623';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(112, 428);
    ctx.quadraticCurveTo(118, 420, 124, 428);
    ctx.stroke();
  }
  // Wooden fence across the middle.
  ctx.fillStyle = '#a9805a';
  ctx.fillRect(0, 296, 580, 10);
  ctx.fillRect(0, 316, 580, 10);
  for (let x = 8; x < 580; x += 42) {
    ctx.fillStyle = '#c49a6c';
    ctx.fillRect(x, 284, 12, 52);
    poly(ctx, [[x, 284], [x + 12, 284], [x + 6, 274]], '#c49a6c');
  }
  // Big tree, right. Difference 2: one apple is missing in B.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(462, 250, 18, 90);
  ctx.fillStyle = '#4e9b47';
  circle(ctx, 440, 205, 52, '#4e9b47');
  circle(ctx, 505, 195, 48, '#57a84e');
  circle(ctx, 472, 158, 46, '#5cb85a');
  const apples = [[430, 190], [470, 175], [505, 150], [495, 210], [445, 225], [475, 205]];
  apples.forEach(([ax, ay], i) => {
    if (variant && i === 2) return; // the missing apple
    circle(ctx, ax, ay, 7, '#e8443a');
    ctx.strokeStyle = '#7a5200';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax, ay - 7);
    ctx.lineTo(ax + 3, ay - 12);
    ctx.stroke();
  });
  // Flower bed along the bottom. Difference 3: one tulip changes colour in B.
  const tulipColours = ['#e8443a', '#ff8fb3', '#e8443a', '#ff8fb3', '#e8443a', '#ff8fb3'];
  for (let i = 0; i < 6; i += 1) {
    const x = 250 + i * 46;
    tulip(ctx, x, 452, variant && i === 2 ? '#ffd93b' : tulipColours[i]);
  }
  for (let i = 0; i < 5; i += 1) tulip(ctx, 210 + i * 18, 478, '#b678e8');
  // Butterfly, drifting slowly (same spot on both panels for a given time).
  const bx = 250 + Math.sin(t * 0.7) * 14;
  const by = 348 + Math.cos(t * 0.9) * 8;
  ctx.fillStyle = '#ff9f1c';
  ctx.beginPath();
  ctx.ellipse(bx - 8, by, 10, 7, -0.5, 0, Math.PI * 2);
  ctx.ellipse(bx + 8, by, 10, 7, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6c4ab6';
  ctx.beginPath();
  ctx.ellipse(bx, by, 3, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Stepping stones.
  ellipse(ctx, 330, 492, 26, 8, '#d8d2c4');
  ellipse(ctx, 390, 478, 24, 8, '#d8d2c4');
  // Grass tufts, seeded scatter (identical on both panels).
  ctx.strokeStyle = '#3e8f3a';
  ctx.lineWidth = 2;
  for (let i = 0; i < 26; i += 1) {
    const gx = 10 + rng() * 560;
    const gy = 350 + rng() * 140;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 3, gy - 9);
    ctx.moveTo(gx + 3, gy);
    ctx.lineTo(gx + 5, gy - 8);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------------------
// Scene 2 — Harbour at Dusk. 7 differences, the hunt gets sharper.
// ---------------------------------------------------------------------------
function drawHarbour(ctx, variant, rng, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#5b4a8a');
  sky.addColorStop(0.55, '#c96f4a');
  sky.addColorStop(1, '#f7b267');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 580, 300);
  circle(ctx, 480, 130, 30, '#ffd166');
  ctx.fillStyle = 'rgba(255, 209, 102, 0.25)';
  ctx.beginPath();
  ctx.arc(480, 130, 46 + Math.sin(t * 0.8) * 3, 0, Math.PI * 2);
  ctx.fill();
  // Gulls. Difference 3: the middle gull is missing in B.
  gull(ctx, 180, 80, 1, '#3a2f4d');
  if (!variant) gull(ctx, 250, 95, 0.9, '#3a2f4d');
  gull(ctx, 330, 70, 1.1, '#3a2f4d');
  // Sea.
  const sea = ctx.createLinearGradient(0, 300, 0, 510);
  sea.addColorStop(0, '#2e6f8e');
  sea.addColorStop(1, '#174a63');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, 580, 210);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2.5;
  for (let row = 0; row < 5; row += 1) {
    const y = 322 + row * 38;
    for (let x = 20; x < 580; x += 90) {
      ctx.beginPath();
      ctx.arc(x + (row % 2) * 30, y, 16, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  }
  // Lighthouse on the pier, left. Difference 4 is its flag; difference 1 is its beam.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(0, 380, 220, 130);
  ctx.fillStyle = '#6e4525';
  for (let x = 0; x < 220; x += 28) ctx.fillRect(x, 380, 3, 130);
  // Harbour building with windows. Difference 5: one window goes dark in B.
  rr(ctx, 18, 400, 120, 78, 6, '#7a4a63');
  rr(ctx, 18, 400, 120, 14, 6, '#5d3550');
  for (let i = 0; i < 3; i += 1) {
    const wx = 34 + i * 36;
    const lit = !(variant && i === 1);
    rr(ctx, wx, 428, 22, 26, 3, lit ? '#ffd166' : '#2c2137');
    if (lit) {
      ctx.strokeStyle = '#5d3550';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wx + 11, 428);
      ctx.lineTo(wx + 11, 454);
      ctx.stroke();
    }
  }
  // Lighthouse tower.
  ctx.fillStyle = '#f2ead8';
  ctx.fillRect(84, 150, 44, 235);
  ctx.fillStyle = '#d94f3d';
  ctx.fillRect(84, 190, 44, 26);
  ctx.fillRect(84, 262, 44, 26);
  ctx.fillRect(84, 334, 44, 26);
  rr(ctx, 78, 118, 56, 32, 6, '#3a2f4d');
  circle(ctx, 106, 134, 9, variant ? '#3a2f4d' : '#ffe9a3');
  poly(ctx, [[78, 118], [134, 118], [106, 96]], '#d94f3d');
  // Flag on top. Difference 4: red to the right in A, green to the left in B.
  ctx.strokeStyle = '#3a2f4d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(106, 96);
  ctx.lineTo(106, 66);
  ctx.stroke();
  if (!variant) poly(ctx, [[106, 66], [136, 74], [106, 84]], '#d94f3d');
  else poly(ctx, [[106, 66], [76, 74], [106, 84]], '#3fae6a');
  // Beam. Difference 1: on in A, off in B.
  if (!variant) {
    const beam = ctx.createLinearGradient(134, 134, 420, 100);
    beam.addColorStop(0, 'rgba(255, 233, 163, 0.55)');
    beam.addColorStop(1, 'rgba(255, 233, 163, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(134, 124);
    ctx.lineTo(430, 96);
    ctx.lineTo(430, 172);
    ctx.lineTo(134, 144);
    ctx.closePath();
    ctx.fill();
  }
  // Sailboats. Difference 2: the near boat's sail changes colour in B.
  function sailboat(x, y, s, sailColour) {
    ctx.fillStyle = '#5d3550';
    ctx.beginPath();
    ctx.moveTo(x - 42 * s, y);
    ctx.lineTo(x + 42 * s, y);
    ctx.lineTo(x + 28 * s, y + 18 * s);
    ctx.lineTo(x - 28 * s, y + 18 * s);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3a2f4d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 62 * s);
    ctx.stroke();
    poly(ctx, [[x + 3, y - 58 * s], [x + 3, y - 8 * s], [x + 34 * s, y - 8 * s]], sailColour);
    poly(ctx, [[x - 3, y - 50 * s], [x - 3, y - 8 * s], [x - 24 * s, y - 8 * s]], '#f2ead8');
  }
  sailboat(300, 330, 1, variant ? '#2a9d8f' : '#d94f3d');
  sailboat(440, 368, 0.75, '#f2ead8');
  // Buoy. Difference 7: red in A, yellow in B.
  ctx.fillStyle = variant ? '#ffd93b' : '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(250, 404);
  ctx.lineTo(262, 404);
  ctx.lineTo(266, 424);
  ctx.lineTo(246, 424);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2ead8';
  ctx.fillRect(252, 396, 8, 10);
  // Crates on the pier. Difference 6: the top crate is missing in B.
  ctx.fillStyle = '#b07a45';
  ctx.fillRect(424, 440, 44, 40);
  ctx.fillRect(472, 440, 44, 40);
  if (!variant) ctx.fillRect(448, 400, 44, 40);
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 2;
  [[424, 440], [472, 440], [448, 400]].forEach(([cx, cy]) => {
    if (variant && cy === 400) return;
    ctx.strokeRect(cx + 2, cy + 2, 40, 36);
    ctx.beginPath();
    ctx.moveTo(cx + 2, cy + 2);
    ctx.lineTo(cx + 42, cy + 38);
    ctx.moveTo(cx + 42, cy + 2);
    ctx.lineTo(cx + 2, cy + 38);
    ctx.stroke();
  });
  // Rope coil.
  ctx.strokeStyle = '#d9c08a';
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(330, 452, 12 + i * 6, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Distant headland.
  ctx.fillStyle = '#4a3a6b';
  ctx.beginPath();
  ctx.moveTo(380, 300);
  ctx.quadraticCurveTo(480, 240, 580, 292);
  ctx.lineTo(580, 300);
  ctx.closePath();
  ctx.fill();
  // Seeded sparkle on the water (identical on both panels).
  ctx.fillStyle = 'rgba(255, 209, 102, 0.5)';
  for (let i = 0; i < 14; i += 1) {
    ctx.fillRect(40 + rng() * 500, 312 + rng() * 170, 8, 2);
  }
}

// ---------------------------------------------------------------------------
// Scene 3 — Night Market. 9 differences, the hardest hunt.
// ---------------------------------------------------------------------------
function drawMarket(ctx, variant, rng, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#141b3d');
  sky.addColorStop(1, '#2c2a5e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 580, 300);
  // Stars, seeded.
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 40; i += 1) {
    const sx = rng() * 580;
    const sy = rng() * 220;
    ctx.globalAlpha = 0.35 + rng() * 0.6;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;
  // Moon. Difference 1: crescent in A, full in B.
  circle(ctx, 500, 70, 26, '#f7ead0');
  if (!variant) circle(ctx, 510, 64, 24, '#141b3d');
  // String lights across the top. Difference 8: one bulb is dark in B.
  ctx.strokeStyle = '#0d0d1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 44);
  ctx.quadraticCurveTo(290, 96, 580, 44);
  ctx.stroke();
  for (let i = 0; i < 11; i += 1) {
    const lx = 30 + i * 52;
    const ly = 44 + Math.sin((lx / 580) * Math.PI) * 34 + 8;
    ctx.strokeStyle = '#0d0d1a';
    ctx.beginPath();
    ctx.moveTo(lx, ly - 8);
    ctx.lineTo(lx, ly);
    ctx.stroke();
    const dark = variant && i === 6;
    circle(ctx, lx, ly + 6, 6, dark ? '#3a3a55' : ['#ffd93b', '#ff6b6b', '#6bcBff', '#9dff6b'][i % 4]);
    if (!dark) {
      ctx.fillStyle = 'rgba(255, 217, 59, 0.18)';
      ctx.beginPath();
      ctx.arc(lx, ly + 6, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Ground.
  ctx.fillStyle = '#3a2b4d';
  ctx.fillRect(0, 380, 580, 130);
  ctx.fillStyle = '#4a3560';
  ctx.fillRect(0, 380, 580, 8);
  // Stalls. Left: fruit. Middle: tea (vendor). Right: lanterns.
  function stall(x, w, awningA, awningB, counter) {
    ctx.fillStyle = '#6e4525';
    ctx.fillRect(x, 330, 10, 60);
    ctx.fillRect(x + w - 10, 330, 10, 60);
    rr(ctx, x - 6, 322, w + 12, 22, 6, counter);
    for (let i = 0; i < 6; i += 1) {
      ctx.fillStyle = i % 2 === 0 ? awningA : awningB;
      ctx.beginPath();
      ctx.moveTo(x - 8 + i * ((w + 16) / 6), 150);
      ctx.lineTo(x - 8 + (i + 1) * ((w + 16) / 6), 150);
      ctx.lineTo(x - 8 + (i + 1) * ((w + 16) / 6) - 4, 178);
      ctx.lineTo(x - 8 + i * ((w + 16) / 6) + 4, 178);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = awningA;
    ctx.fillRect(x - 8, 146, w + 16, 8);
  }
  stall(30, 150, '#d94f3d', '#f2ead8', '#8a5a33');
  stall(210, 160, '#3fae6a', '#f2ead8', '#8a5a33');
  // Right stall awning. Difference 6: red/white in A, blue/white in B.
  stall(400, 150, variant ? '#3a7bd5' : '#d94f3d', '#f2ead8', '#8a5a33');
  // Fruit baskets on the left stall. Difference 3: the orange basket is gone in B.
  ellipse(ctx, 105, 316, 34, 12, '#5d3a1a');
  for (let i = 0; i < 5; i += 1) circle(ctx, 84 + i * 11, 308 - (i % 2) * 6, 7, '#ff8c42');
  if (!variant) {
    ellipse(ctx, 155, 316, 26, 10, '#5d3a1a');
    circle(ctx, 146, 308, 7, '#e8443a');
    circle(ctx, 158, 306, 7, '#e8443a');
    circle(ctx, 164, 310, 7, '#e8443a');
  }
  // Apple basket on the middle stall. Difference 7: five apples in A, four in B.
  ellipse(ctx, 250, 316, 30, 11, '#5d3a1a');
  const apples = [[232, 308], [244, 304], [256, 308], [268, 304], [250, 300]];
  apples.forEach(([ax, ay], i) => {
    if (variant && i === 4) return;
    circle(ctx, ax, ay, 6.5, '#e8443a');
  });
  // Tea sign on the middle stall. Difference 5: yellow in A, pink in B.
  rr(ctx, 268, 186, 64, 40, 8, variant ? '#ff8fb3' : '#ffd93b');
  ctx.fillStyle = '#3a2b4d';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TEA', 300, 207);
  // Vendor behind the middle stall. Difference 9: straw hat in A, red cap in B.
  circle(ctx, 300, 252, 20, '#f2c29b');
  ctx.fillStyle = '#3fae6a';
  ctx.beginPath();
  ctx.moveTo(272, 322);
  ctx.quadraticCurveTo(272, 272, 300, 272);
  ctx.quadraticCurveTo(328, 272, 328, 322);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 292, 250, 2.5, '#222222');
  circle(ctx, 308, 250, 2.5, '#222222');
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(300, 256, 7, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  if (!variant) {
    ellipse(ctx, 300, 236, 30, 8, '#e8c85a');
    ctx.fillStyle = '#e8c85a';
    ctx.beginPath();
    ctx.arc(300, 236, 14, Math.PI, 0);
    ctx.fill();
  } else {
    ctx.fillStyle = '#d94f3d';
    ctx.beginPath();
    ctx.arc(300, 234, 15, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(300, 232, 22, 5);
  }
  // Paper lanterns on the right stall. Difference 2: one lantern changes colour in B.
  function lantern(x, y, colour) {
    ctx.strokeStyle = '#0d0d1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 26);
    ctx.lineTo(x, y - 14);
    ctx.stroke();
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1.5;
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.ellipse(x, y + i * 7, 15, 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffd93b';
    ctx.fillRect(x - 5, y - 22, 10, 6);
    ctx.fillRect(x - 5, y + 16, 10, 6);
  }
  lantern(440, 232, variant ? '#3fae6a' : '#d94f3d');
  lantern(505, 232, '#ffd93b');
  lantern(472, 262, '#ff8fb3');
  // Cat on a crate, right. Difference 4: the cat is gone in B.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(500, 440, 56, 46);
  ctx.strokeStyle = '#5d3a1a';
  ctx.lineWidth = 2;
  ctx.strokeRect(502, 442, 52, 42);
  if (!variant) {
    ctx.fillStyle = '#2b2b3a';
    ellipse(ctx, 528, 428, 18, 12, '#2b2b3a');
    circle(ctx, 514, 414, 9, '#2b2b3a');
    poly(ctx, [[508, 408], [512, 396], [516, 407]], '#2b2b3a');
    poly(ctx, [[520, 407], [524, 396], [527, 408]], '#2b2b3a');
    ctx.strokeStyle = '#2b2b3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(544, 432);
    ctx.quadraticCurveTo(556, 428, 552, 414);
    ctx.stroke();
    circle(ctx, 511, 413, 1.6, '#ffd93b');
  }
  // Lantern glow on the ground, swaying slightly.
  ctx.fillStyle = 'rgba(255, 180, 80, 0.12)';
  ctx.beginPath();
  ctx.ellipse(290 + Math.sin(t * 0.6) * 6, 470, 150, 22, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// The catalogue the world and the renderer share.
// ---------------------------------------------------------------------------
export const SCENES = [
  {
    id: 'garden',
    name: 'Morning Garden',
    tagline: 'Five small changes hide in the garden.',
    timeLimit: 120,
    hints: 3,
    draw: drawGarden,
    differences: [
      { id: 'sun-face', x: 85, y: 75, r: 36, name: 'The smiling sun' },
      { id: 'apple', x: 505, y: 150, r: 18, name: 'A missing apple' },
      { id: 'tulip', x: 342, y: 440, r: 20, name: 'A tulip changed colour' },
      { id: 'duck', x: 125, y: 428, r: 24, name: 'The pond duck' },
      { id: 'cloud', x: 351, y: 80, r: 32, name: 'A missing cloud' },
    ],
  },
  {
    id: 'harbour',
    name: 'Harbour at Dusk',
    tagline: 'Seven changes hide where the boats come home.',
    timeLimit: 150,
    hints: 3,
    draw: drawHarbour,
    differences: [
      { id: 'beam', x: 150, y: 138, r: 30, name: 'The lighthouse beam' },
      { id: 'sail', x: 300, y: 300, r: 26, name: 'A sail changed colour' },
      { id: 'gull', x: 250, y: 95, r: 18, name: 'A missing gull' },
      { id: 'flag', x: 106, y: 74, r: 20, name: 'The lighthouse flag' },
      { id: 'window', x: 81, y: 441, r: 18, name: 'A dark window' },
      { id: 'crate', x: 470, y: 420, r: 22, name: 'A missing crate' },
      { id: 'buoy', x: 256, y: 412, r: 20, name: 'A buoy changed colour' },
    ],
  },
  {
    id: 'market',
    name: 'Night Market',
    tagline: 'Nine changes hide among the lanterns. Look twice.',
    timeLimit: 180,
    hints: 3,
    draw: drawMarket,
    differences: [
      { id: 'moon', x: 500, y: 70, r: 28, name: 'The moon changed phase' },
      { id: 'lantern', x: 440, y: 232, r: 20, name: 'A lantern changed colour' },
      { id: 'basket', x: 155, y: 312, r: 24, name: 'A missing basket' },
      { id: 'cat', x: 528, y: 420, r: 22, name: 'The cat on the crate' },
      { id: 'sign', x: 300, y: 206, r: 24, name: 'The tea sign changed colour' },
      { id: 'awning', x: 475, y: 164, r: 26, name: 'An awning changed colour' },
      { id: 'apples', x: 250, y: 300, r: 18, name: 'A missing apple' },
      { id: 'bulb', x: 342, y: 91, r: 14, name: 'A dark festival bulb' },
      { id: 'hat', x: 300, y: 236, r: 22, name: 'The vendor changed hats' },
    ],
  },
];
