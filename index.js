import * as tome from 'chromotome';
import SimplexNoise from 'simplex-noise';
import { draw_line, draw_poly, draw_grid } from './display';

let sketch = function(p) {
  let THE_SEED;
  let simplex;
  let noise_grid;

  const palette = tome.get('tsu_akasaka');

  const grid_dim = 800;
  const padding = 80;
  const canvas_dim = grid_dim + 2 * padding;
  const cell_dim = 2;
  const n = grid_dim / cell_dim;

  const noise_dim = 0.0025;
  const persistence = 0.45;

  p.setup = function() {
    p.createCanvas(canvas_dim, canvas_dim);
    THE_SEED = p.floor(p.random(9999999));
    simplex = new SimplexNoise(THE_SEED);
    p.randomSeed(THE_SEED);

    noise_grid = build_noise_grid();

    p.background(palette.background);
    p.translate(padding, padding);

    draw_grid(p, grid_dim, 12);
    process_grid(0.3, 10, 0.7 / 10, ['#d4a710']);
    process_grid(-1, 120, 1.3 / 120, []);
  };

  function process_grid(init, steps, delta, fill_palette) {
    const thresholds = build_threshold_list(init, steps, delta, fill_palette);
    const filled = fill_palette.length !== 0;

    p.push();
    for (let y = 0; y < n; y++) {
      p.push();
      for (let x = 0; x < n; x++) {
        process_cell(x, y, filled, thresholds, delta);
        p.translate(cell_dim, 0);
      }
      p.pop();
      p.translate(0, cell_dim);
    }
    p.pop();
  }

  function process_cell(x, y, filled, thresholds, delta) {
    const v1 = get_noise(x, y);
    const v2 = get_noise(x + 1, y);
    const v3 = get_noise(x + 1, y + 1);
    const v4 = get_noise(x, y + 1);

    // Some optimization
    const min = p.min([v1, v2, v3, v4]);
    const max = p.max([v1, v2, v3, v4]);
    const relevant_thresholds = thresholds.filter(t => t.val >= min - delta && t.val <= max);

    for (const t of relevant_thresholds) {
      const b1 = v1 > t.val ? 8 : 0;
      const b2 = v2 > t.val ? 4 : 0;
      const b3 = v3 > t.val ? 2 : 0;
      const b4 = v4 > t.val ? 1 : 0;

      const id = b1 + b2 + b3 + b4;

      if (filled) {
        p.fill(t.col);
        draw_poly(p, id, v1, v2, v3, v4, t.val, cell_dim);
      } else {
        p.stroke(palette.stroke ? palette.stroke : '#111');
        draw_line(p, id, v1, v2, v3, v4, t.val, cell_dim);
      }
    }
  }

  function get_noise(x, y) {
    return noise_grid[y][x];
  }

  function build_noise_grid() {
    let grid = [];
    for (let y = 0; y < n + 1; y++) {
      let row = [];
      for (let x = 0; x < n + 1; x++) {
        row.push(sum_octave(16, x, y));
      }
      grid.push(row);
    }
    return grid;
  }

  function build_threshold_list(init, steps, delta, colors) {
    let thresholds = [];
    for (let t = 0; t <= steps; t++) {
      let col = colors.length === 0 ? '#fff' : colors[p.floor(p.random(colors.length))];
      thresholds.push({ val: init + t * delta, col: col });
    }
    return thresholds;
  }

  function sum_octave(num_iterations, x, y) {
    let noise = 0;
    let maxAmp = 0;
    let amp = 1;
    let freq = noise_dim;

    for (let i = 0; i < num_iterations; i++) {
      noise += simplex.noise2D(14.3 + x * freq, 5.71 + y * freq) * amp;
      maxAmp += amp;
      amp *= persistence;
      freq *= 2;
    }
    return noise / maxAmp;
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
