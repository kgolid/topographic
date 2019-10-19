export function draw_line(p, id, nw, ne, se, sw, threshold, dim) {
  const n = [p.map(threshold, nw, ne, 0, dim), 0];
  const e = [dim, p.map(threshold, ne, se, 0, dim)];
  const s = [p.map(threshold, sw, se, 0, dim), dim];
  const w = [0, p.map(threshold, nw, sw, 0, dim)];

  if (id === 1 || id === 14) p.line(...s, ...w);
  else if (id === 2 || id === 13) p.line(...e, ...s);
  else if (id === 3 || id === 12) p.line(...e, ...w);
  else if (id === 4 || id === 11) p.line(...n, ...e);
  else if (id === 6 || id === 9) p.line(...n, ...s);
  else if (id === 7 || id === 8) p.line(...w, ...n);
  else if (id === 5 || id == 10) {
    p.line(...e, ...s);
    p.line(...w, ...n);
  }
}

export function draw_poly(p, id, v1, v2, v3, v4, threshold, dim) {
  const n = [p.map(threshold, v1, v2, 0, dim), 0];
  const e = [dim, p.map(threshold, v2, v3, 0, dim)];
  const s = [p.map(threshold, v4, v3, 0, dim), dim];
  const w = [0, p.map(threshold, v1, v4, 0, dim)];
  const nw = [0, 0];
  const ne = [dim, 0];
  const se = [dim, dim];
  const sw = [0, dim];

  p.noStroke();
  p.beginShape();
  if (id === 1) {
    p.vertex(...s);
    p.vertex(...w);
    p.vertex(...sw);
  } else if (id === 2) {
    p.vertex(...e);
    p.vertex(...s);
    p.vertex(...se);
  } else if (id === 3) {
    p.vertex(...e);
    p.vertex(...w);
    p.vertex(...sw);
    p.vertex(...se);
  } else if (id === 4) {
    p.vertex(...n);
    p.vertex(...e);
    p.vertex(...ne);
  } else if (id === 5) {
    p.vertex(...e);
    p.vertex(...s);
    p.vertex(...sw);
    p.vertex(...w);
    p.vertex(...n);
    p.vertex(...ne);
  } else if (id === 6) {
    p.vertex(...n);
    p.vertex(...s);
    p.vertex(...se);
    p.vertex(...ne);
  } else if (id === 7) {
    p.vertex(...w);
    p.vertex(...n);
    p.vertex(...ne);
    p.vertex(...se);
    p.vertex(...sw);
  } else if (id === 15) {
    p.vertex(...nw);
    p.vertex(...ne);
    p.vertex(...se);
    p.vertex(...sw);
  } else if (id === 14) {
    p.vertex(...s);
    p.vertex(...w);
    p.vertex(...nw);
    p.vertex(...ne);
    p.vertex(...se);
  } else if (id === 13) {
    p.vertex(...e);
    p.vertex(...s);
    p.vertex(...sw);
    p.vertex(...nw);
    p.vertex(...ne);
  } else if (id === 12) {
    p.vertex(...e);
    p.vertex(...w);
    p.vertex(...nw);
    p.vertex(...ne);
  } else if (id === 11) {
    p.vertex(...n);
    p.vertex(...e);
    p.vertex(...se);
    p.vertex(...sw);
    p.vertex(...nw);
  } else if (id === 10) {
    p.vertex(...e);
    p.vertex(...se);
    p.vertex(...s);
    p.vertex(...w);
    p.vertex(...nw);
    p.vertex(...n);
  } else if (id === 9) {
    p.vertex(...n);
    p.vertex(...s);
    p.vertex(...sw);
    p.vertex(...nw);
  } else if (id === 8) {
    p.vertex(...w);
    p.vertex(...n);
    p.vertex(...nw);
  }
  p.endShape(p.CLOSE);
}

export function draw_grid(p, dim, num) {
  const spacing = dim / num;
  p.stroke(0, 70);
  for (let i = 0; i <= num; i++) {
    p.line(i * spacing, 0, i * spacing, dim);
    p.line(0, i * spacing, dim, i * spacing);
  }
}
