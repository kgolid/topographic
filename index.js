import * as tome from 'chromotome';
import { draw_line, draw_poly } from './display';

let sketch = function(p) {
  let THE_SEED;

  const dim = 800;
  const cell_dim = 4;
  const noise_dim = 0.01;
  const padding = 50;
  const canvas_dim = dim + 2 * padding;
  const palette = tome.get('empusa');

  const t_init = 0.2;
  const t_steps = 20;
  const t_delta = 0.03;

  p.setup = function() {
    p.createCanvas(canvas_dim, canvas_dim);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);

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
    const v1 = p.noise(x * noise_dim, y * noise_dim);
    const v2 = p.noise((x + 1) * noise_dim, y * noise_dim);
    const v3 = p.noise((x + 1) * noise_dim, (y + 1) * noise_dim);
    const v4 = p.noise(x * noise_dim, (y + 1) * noise_dim);

    const b1 = v1 > threshold ? 8 : 0;
    const b2 = v2 > threshold ? 4 : 0;
    const b3 = v3 > threshold ? 2 : 0;
    const b4 = v4 > threshold ? 1 : 0;

    const id = b1 + b2 + b3 + b4;

    draw_poly(p, id, v1, v2, v3, v4, threshold, cell_dim);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
