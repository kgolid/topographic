import * as tome from 'chromotome';
import SimplexNoise from 'simplex-noise';
import { draw_line, draw_poly } from './display';

let sketch = function(p) {
  let THE_SEED;
  let simplex;

  const palette = tome.get('empusa');

  const dim = 800;
  const padding = 50;
  const canvas_dim = dim + 2 * padding;

  const cell_dim = 4;
  const noise_dim = 0.012;
  const persistence = 0.25;

  const t_init = -1;
  const t_steps = 20;
  const t_delta = 0.1;

  p.setup = function() {
    p.createCanvas(canvas_dim, canvas_dim);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    simplex = new SimplexNoise(THE_SEED);

    p.background(palette.background);
    p.noStroke();

    for (let t = 0; t <= t_steps; t++) {
      p.strokeWeight(t % 4 === 0 ? 2 : 1);
      p.fill(palette.colors[p.floor(p.random(palette.size))]);

      p.push();
      p.translate(padding, padding);
      for (let y = 0; y < dim / cell_dim; y++) {
        p.push();
        for (let x = 0; x < dim / cell_dim; x++) {
          process_cell(x, y, t_init + t * t_delta);
          p.translate(cell_dim, 0);
        }
        p.pop();
        p.translate(0, cell_dim);
      }
      p.pop();
    }
  };

  function process_cell(x, y, threshold) {
    const v1 = get_noise(x, y);
    const v2 = get_noise(x + 1, y);
    const v3 = get_noise(x + 1, y + 1);
    const v4 = get_noise(x, y + 1);

    const b1 = v1 > threshold ? 8 : 0;
    const b2 = v2 > threshold ? 4 : 0;
    const b3 = v3 > threshold ? 2 : 0;
    const b4 = v4 > threshold ? 1 : 0;

    const id = b1 + b2 + b3 + b4;

    draw_poly(p, id, v1, v2, v3, v4, threshold, cell_dim);
  }

  function get_noise(x, y) {
    return sum_octave(16, x, y, persistence, noise_dim);
  }

  function sum_octave(num_iterations, x, y, persistence, scale) {
    let maxAmp = 0;
    let amp = 1;
    let freq = scale;
    let noise = 0;

    for (let i = 0; i < num_iterations; ++i) {
      noise += simplex.noise2D(x * freq, y * freq) * amp;
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
