import * as tome from 'chromotome';
import SimplexNoise from 'simplex-noise';
import { draw_line, draw_poly, draw_grid } from './display';

let sketch = function(p) {
  let THE_SEED;
  let simplex;
  let noise_grid;
  let thresholds = [];

  const palette = tome.get('tsu_akasaka');

  const grid_dim = 800;
  const padding = 80;
  const canvas_dim = grid_dim + 2 * padding;
  const cell_dim = 2;
  const n = grid_dim / cell_dim;

  const noise_dim = 0.0025;
  const persistence = 0.45;

  const t_init = 0.2;
  const t_steps = 120;
  const t_delta = 0.8 / t_steps;

  p.setup = function() {
    p.createCanvas(canvas_dim, canvas_dim);
    THE_SEED = p.floor(p.random(9999999));
    simplex = new SimplexNoise(THE_SEED);
    p.randomSeed(THE_SEED);

    noise_grid = build_noise_grid();
    thresholds = build_threshold_list();

    p.background(palette.background);
    p.translate(padding, padding);

    p.push();
    for (let y = 0; y < n; y++) {
      p.push();
      for (let x = 0; x < n; x++) {
        process_cell(x, y);
        p.translate(cell_dim, 0);
      }
      p.pop();
      p.translate(0, cell_dim);
    }
    p.pop();

    draw_grid(p, grid_dim, 12);
  };

  function process_cell(x, y) {
    const v1 = get_noise(x, y);
    const v2 = get_noise(x + 1, y);
    const v3 = get_noise(x + 1, y + 1);
    const v4 = get_noise(x, y + 1);

    // Some optimization
    const min = p.min([v1, v2, v3, v4]);
    const max = p.max([v1, v2, v3, v4]);
    const relevant_thresholds = thresholds.filter(
      t => t.val >= min - t_delta && t.val <= max
    );

    for (const t of relevant_thresholds) {
      const b1 = v1 > t.val ? 8 : 0;
      const b2 = v2 > t.val ? 4 : 0;
      const b3 = v3 > t.val ? 2 : 0;
      const b4 = v4 > t.val ? 1 : 0;

      const id = b1 + b2 + b3 + b4;

      //p.fill(t.col);
      //draw_poly(p, id, v1, v2, v3, v4, t.val, cell_dim);
      p.stroke(palette.stroke);
      draw_line(p, id, v1, v2, v3, v4, t.val, cell_dim);
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

  function build_threshold_list() {
    let thresholds = [];
    for (let t = 0; t <= t_steps; t++) {
      let col = palette.colors[p.floor(p.random(palette.size))];
      thresholds.push({ val: t_init + t * t_delta, col: col });
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
