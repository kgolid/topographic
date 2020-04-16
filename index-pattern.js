import * as dat from 'dat.gui';
import * as tome from 'chromotome';
import SimplexNoise from 'simplex-noise';
import { draw_poly } from './display';

let sketch = function(p) {
  let simplex;
  let noise_grid;

  let opts;
  let palette;

  let tick;

  const grid_dim_x = 1100;
  const grid_dim_y = 1100;
  const padding = 0;
  const canvas_dim_x = grid_dim_x + 2 * padding;
  const canvas_dim_y = grid_dim_y + 2 * padding;
  const cell_dim = 5;
  const nx = grid_dim_x / cell_dim;
  const ny = grid_dim_y / cell_dim;

  p.setup = function() {
    p.createCanvas(canvas_dim_x, canvas_dim_y);
    p.frameRate(5);

    opts = {
      noise_scale: 50,
      noise_persistence: 0.5,
      apply_sigmoid: 0,
      num_shapes: 20,
      bottom_size: -0.1,
      top_size: 0.5,
      gradient: 'radial',
      palette: 'delphi'
    };

    const gui = new dat.GUI();
    gui.width = 300;
    const f1 = gui.addFolder('Noise field');
    f1.add(opts, 'noise_scale', 10, 200, 20).name('Noise scale');
    f1.add(opts, 'noise_persistence', 0.1, 1, 0.05).name('Noise persistence');
    f1.add(opts, 'num_shapes', 5, 50, 5).name('Layers');
    f1.add(opts, 'bottom_size', -1, 1, 0.1).name('Bottom threshold');
    f1.add(opts, 'top_size', -1, 1, 0.1).name('Top threshold');
    f1.add(opts, 'gradient', ['fill', 'linear', 'radial', 'ring']).name('Gradient');
    f1.open();

    const f2 = gui.addFolder('Style');
    f2.add(opts, 'palette', tome.getNames());
    f2.open();

    reset();
  };

  function reset() {
    palette = tome.get(opts.palette);
    palette.colors = p.shuffle(palette.colors);
    tick = 0;
  }

  p.draw = function() {
    p.push();
    p.translate(padding, padding);

    if (tick === 0) {
      p.background(palette.background ? palette.background : '#f5f5f5');
    }
    if (tick < opts.num_shapes) {
      const range = opts.top_size - opts.bottom_size;
      const z_val = opts.bottom_size + (range * tick) / opts.num_shapes;
      const col = palette.colors[tick % palette.colors.length];

      simplex = new SimplexNoise();
      noise_grid = build_noise_grid(opts.gradient);
      p.fill(col);
      process_grid(z_val);
      p.pop();
    }

    tick++;
    if (tick === opts.num_shapes + 5) reset();
  };

  function process_grid(z_val) {
    p.push();
    for (let y = 0; y < ny; y++) {
      p.push();
      for (let x = 0; x < nx; x++) {
        process_cell(x, y, z_val);
        p.translate(cell_dim, 0);
      }
      p.pop();
      p.translate(0, cell_dim);
    }
    p.pop();
  }

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

    if (id === 0) return;

    draw_poly(p, id, v1, v2, v3, v4, threshold, cell_dim);
  }

  function get_noise(x, y) {
    return noise_grid[y][x];
  }

  function build_noise_grid(gradient) {
    return [...Array(ny + 1)].map((_, y) =>
      [...Array(nx + 1)].map((_, x) => sum_octave(16, x, y) + get_offset(gradient, x, y))
    );
  }

  function get_offset(gradient, x, y) {
    if (gradient === 'fill') return 0;
    if (gradient === 'linear') return y / nx - 0.5;
    if (gradient === 'radial') return 0.2 - distance_from_centre(x, y) / (nx / 2);
    if (gradient === 'ring') return -Math.abs(-1 + distance_from_centre(x, y) / (nx / 4));
  }

  function distance_from_centre(x, y) {
    return Math.sqrt(Math.pow(nx / 2 - x, 2) + Math.pow(ny / 2 - y, 2));
  }

  function sum_octave(num_iterations, x, y) {
    let noise = 0;
    let maxAmp = 0;
    let amp = 1;
    let freq = 1 / opts.noise_scale;

    for (let i = 0; i < num_iterations; i++) {
      noise += simplex.noise3D(x * freq, y * freq, i) * amp;
      maxAmp += amp;
      amp *= opts.noise_persistence;
      freq *= 2;
    }

    return noise / maxAmp;
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('topollock', 'jpeg');
  };
};
new p5(sketch);
