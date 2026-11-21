// Shared canvas drawing helpers for the Gull Cove scenes.
// Every helper draws in the scene's own 600x450 space, so the two panels
// of a round stay pixel-identical except for the differences a scene toggles.

/** Fill a vertical gradient over the whole scene. */
export function sky(ctx, width, height, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, height);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

/** A filled circle. */
export function disc(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** A filled ellipse. */
export function blob(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** A filled polygon from [x, y] points. */
export function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

/** A rounded-rectangle path (fill with the current fillStyle). */
export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** A four-point sparkle star, the kind night skies are made of. */
export function sparkle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/** A seagull: two shallow arcs, wings up. */
export function gull(ctx, x, y, s, stroke) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s, y);
  ctx.quadraticCurveTo(x - s / 2, y - s * 0.7, x, y);
  ctx.quadraticCurveTo(x + s / 2, y - s * 0.7, x + s, y);
  ctx.stroke();
}

/** A pine tree: three stacked triangles and a trunk. */
export function pine(ctx, x, y, s, color, trunk = '#4a3226') {
  ctx.fillStyle = trunk;
  ctx.fillRect(x - s * 0.08, y - s * 0.12, s * 0.16, s * 0.14);
  poly(ctx, [[x, y - s], [x - s * 0.42, y - s * 0.28], [x + s * 0.42, y - s * 0.28]], color);
  poly(ctx, [[x, y - s * 0.72], [x - s * 0.5, y - s * 0.05], [x + s * 0.5, y - s * 0.05]], color);
  poly(ctx, [[x, y - s * 0.42], [x - s * 0.58, y + s * 0.22], [x + s * 0.58, y + s * 0.22]], color);
}

/** A paper lantern: round body, top and bottom caps, hanging string. */
export function lantern(ctx, x, y, r, color, glow = true) {
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y - r - 14);
  ctx.lineTo(x, y - r);
  ctx.stroke();
  if (glow) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.2);
    g.addColorStop(0, color + '66');
    g.addColorStop(1, color + '00');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  disc(ctx, x, y, r, color);
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1;
  for (const dy of [-r * 0.45, 0, r * 0.45]) {
    ctx.beginPath();
    ctx.moveTo(x - r * 0.92, y + dy);
    ctx.lineTo(x + r * 0.92, y + dy);
    ctx.stroke();
  }
  ctx.fillStyle = '#d8a24a';
  ctx.fillRect(x - 5, y - r - 4, 10, 5);
  ctx.fillRect(x - 5, y + r - 1, 10, 5);
}

/** A sitting cat silhouette, tail up or down. */
export function cat(ctx, x, y, s, fill, tailUp = true) {
  ctx.fillStyle = fill;
  // body
  ctx.beginPath();
  ctx.ellipse(x, y, s * 0.55, s * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();
  // head + ears
  disc(ctx, x + s * 0.1, y - s * 0.85, s * 0.42, fill);
  poly(ctx, [[x - s * 0.22, y - s * 1.05], [x - s * 0.28, y - s * 1.45], [x + s * 0.05, y - s * 1.2]], fill);
  poly(ctx, [[x + s * 0.28, y - s * 1.05], [x + s * 0.4, y - s * 1.42], [x + s * 0.5, y - s * 1.08]], fill);
  // tail
  ctx.strokeStyle = fill;
  ctx.lineWidth = s * 0.16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (tailUp) {
    ctx.moveTo(x - s * 0.5, y + s * 0.55);
    ctx.quadraticCurveTo(x - s * 1.1, y + s * 0.2, x - s * 0.95, y - s * 0.6);
  } else {
    ctx.moveTo(x - s * 0.5, y + s * 0.55);
    ctx.quadraticCurveTo(x - s * 1.05, y + s * 0.7, x - s * 1.15, y + s * 0.15);
  }
  ctx.stroke();
}

/** A jar with a lid, sitting on a counter. */
export function jar(ctx, x, y, w, h, fill, lid = '#c98f4e') {
  ctx.fillStyle = lid;
  rr(ctx, x - w * 0.28, y - h - 6, w * 0.56, 7, 3);
  ctx.fill();
  ctx.fillStyle = fill;
  rr(ctx, x - w / 2, y - h, w, h, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  rr(ctx, x - w / 2 + 4, y - h + 5, 5, h - 12, 2);
  ctx.fill();
}

/** Centered text with a font string. */
export function label(ctx, text, x, y, font, fill, align = 'center') {
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}
