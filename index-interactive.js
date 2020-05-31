import * as dat from 'dat.gui';
import SimplexNoise from 'simplex-noise';
import { draw_line, draw_poly, draw_grid } from './display';

let sketch = function (p) {
  let THE_SEED;
  let simplex;
  let noise_grid;

  let gui_opts;

  const grid_dim_x = 1300;
  const grid_dim_y = 900;
  const padding = 40;
  const canvas_dim_x = grid_dim_x + 2 * padding;
  const canvas_dim_y = grid_dim_y + 2 * padding;
  const cell_dim = 2;
  const nx = grid_dim_x / cell_dim;
  const ny = grid_dim_y / cell_dim;

  p.setup = function () {
    p.createCanvas(canvas_dim_x, canvas_dim_y);
    p.pixelDensity(4);

    gui_opts = {
      noise_scale: 350,
      noise_persistence: 0.55,
      apply_sigmoid: 9,
      color: '#ffc70b',
      bg_color: '#ffffff',
      stroke_weight: 1,
      line_density: 15,
      range: 0.5,
      full_reset: () => reset(true),
      partial_reset: () => reset(false),
    };

    const gui = new dat.GUI();
    gui.width = 300;
    const f1 = gui.addFolder('Noise field');
    f1.add(gui_opts, 'noise_scale', 100, 1000, 50).name('Noise scale');
    f1.add(gui_opts, 'noise_persistence', 0.2, 0.8, 0.05).name('Noise persistence');
    f1.add(gui_opts, 'apply_sigmoid', 0, 10, 1).name('Sigmoid intensity');
    f1.open();

    const f2 = gui.addFolder('Style');
    f2.add(gui_opts, 'line_density', 5, 30, 5).name('Line density');
    f2.add(gui_opts, 'range', 0, 1, 0.05).name('Land/ocean ratio');
    f2.addColor(gui_opts, 'color').name('Ocean color');
    f2.addColor(gui_opts, 'bg_color').name('Background color');
    f2.add(gui_opts, 'stroke_weight', 1, 5, 1).name('Stroke Weight');
    f2.open();

    gui.add(gui_opts, 'partial_reset').name('Redraw');
    gui.add(gui_opts, 'full_reset').name('New noise + redraw');

    reset(true);
  };

  function reset(new_seed) {
    if (new_seed) {
      THE_SEED = p.floor(p.random(9999999));
      simplex = new SimplexNoise(THE_SEED);
      p.randomSeed(THE_SEED);
    }

    noise_grid = build_noise_grid();
    draw(gui_opts);
  }

  function draw(opts) {
    const ratio = opts.range * 2;
    const number_of_lines = ratio * opts.line_density;

    p.push();
    p.background(opts.bg_color);
    p.translate(padding, padding);
    process_grid(-1 + ratio, 1, 2 - ratio, [opts.color]);
    // process_grid(-1 + ratio + 0.2, 1, 2 - ratio - 0.2, [opts.color]);
    process_grid(-1, number_of_lines, 1 / opts.line_density, []);
    p.pop();
  }

  function process_grid(init, steps, delta, fill_palette) {
    const thresholds = build_threshold_list(init, steps, delta, fill_palette);
    const filled = fill_palette.length !== 0;

    p.push();
    for (let y = 0; y < ny; y++) {
      p.push();
      for (let x = 0; x < nx; x++) {
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
    const relevant_thresholds = thresholds.filter((t) => t.val >= min - delta && t.val <= max);

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
        p.stroke('#000');
        p.strokeWeight(gui_opts.stroke_weight);
        draw_line(p, id, v1, v2, v3, v4, t.val, cell_dim);
      }
    }
  }

  function get_noise(x, y) {
    return noise_grid[y][x];
  }

  function build_noise_grid() {
    const grid = [];
    for (let y = 0; y < ny + 1; y++) {
      let row = [];
      for (let x = 0; x < nx + 1; x++) {
        row.push(sum_octave(16, x, y));
      }
      grid.push(row);
    }
    return grid;
  }

  function build_threshold_list(init, steps, delta, colors) {
    const thresholds = [];
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
    let freq = 1 / gui_opts.noise_scale;

    for (let i = 0; i < num_iterations; i++) {
      noise += simplex.noise3D(x * freq, y * freq, i) * amp;
      maxAmp += amp;
      amp *= gui_opts.noise_persistence;
      freq *= 2;
    }
    var output = apply_sigmoid(noise / maxAmp, gui_opts.apply_sigmoid);
    return output;
  }
  function apply_sigmoid(value, intensity) {
    if (intensity === 0) return value;
    return 2 * sigmoid(value * intensity) - 1;
  }

  function sigmoid(x) {
    return 1 / (1 + p.exp(-x));
  }

  p.keyPressed = function () {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
