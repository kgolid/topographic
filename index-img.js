import * as dat from 'dat.gui';
import * as tome from 'chromotome';
import SimplexNoise from 'simplex-noise';
import { draw_poly, draw_line } from './display';

let sketch = function(p) {
  let THE_SEED;
  let simplex;
  let noise_grid;

  let gui_opts;
  let palette;

  let img;
  let imgpixels;
  const img_resolution = 1;

  const grid_dim = 750;
  const padding = 80;
  const canvas_dim = grid_dim + 2 * padding;
  const cell_dim = 2;
  const n = grid_dim / cell_dim;

  p.preload = function() {
    img = p.loadImage('./eye.jpg');
  };

  p.setup = function() {
    p.createCanvas(canvas_dim, canvas_dim);

    img.loadPixels();
    p.loadPixels();

    imgpixels = newArray(grid_dim).map((_, j) =>
      newArray(grid_dim).map((_, i) => {
        var loc = (i + j * img.width) * 4 * img_resolution;
        return [img.pixels[loc + 0], img.pixels[loc + 1], img.pixels[loc + 2]];
      })
    );

    gui_opts = {
      noise_scale: 400,
      noise_persistence: 0.2,
      apply_sigmoid: 0,
      palette: 'empusa',
      line_density: 2,
      full_reset: () => reset(true),
      partial_reset: () => reset(false)
    };

    const gui = new dat.GUI();
    gui.width = 300;
    const f1 = gui.addFolder('Noise field');
    f1.add(gui_opts, 'noise_scale', 100, 1000, 50).name('Noise scale');
    f1.add(gui_opts, 'noise_persistence', 0.1, 0.6, 0.05).name('Noise persistence');
    f1.add(gui_opts, 'apply_sigmoid', 0, 10, 1).name('Sigmoid intensity');
    f1.open();

    const f2 = gui.addFolder('Style');
    f2.add(gui_opts, 'palette', tome.getNames());
    f2.add(gui_opts, 'line_density', 5, 100, 5).name('Line density');
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

    palette = tome.get(gui_opts.palette);
    noise_grid = build_noise_grid();
    draw(gui_opts);
  }

  function draw(opts) {
    p.push();
    p.background(palette.background ? palette.background : '#f5f5f5');
    p.translate(padding, padding);
    process_grid(-1, 2 * opts.line_density, 1 / opts.line_density, palette.colors);
    p.pop();
  }

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
    const relevant_thresholds = thresholds.filter(
      t => t.val >= min - delta && t.val <= max
    );

    for (const t of relevant_thresholds) {
      const b1 = v1 > t.val ? 8 : 0;
      const b2 = v2 > t.val ? 4 : 0;
      const b3 = v3 > t.val ? 2 : 0;
      const b4 = v4 > t.val ? 1 : 0;

      const id = b1 + b2 + b3 + b4;

      if (filled) {
        p.fill(t.col);
        draw_poly(p, id, v1, v2, v3, v4, t.val, cell_dim);
      }
    }
  }

  function get_noise(x, y) {
    return noise_grid[y][x];
  }

  function build_noise_grid() {
    const grid = [];
    for (let y = 0; y < n + 1; y++) {
      let row = [];
      let ypos = p.floor((y / (n + 1)) * imgpixels.length);
      for (let x = 0; x < n + 1; x++) {
        let xpos = p.floor((x / (n + 1)) * imgpixels[0].length);
        let pixel = imgpixels[ypos][xpos];
        let px_value = (pixel[0] + pixel[1] + pixel[2]) / 765;
        row.push(px_value * 2 - 1);
        //row.push(sum_octave(16, x, y));
      }
      grid.push(row);
    }
    return grid;
  }

  function build_threshold_list(init, steps, delta, colors) {
    const thresholds = [];
    for (let t = 0; t <= steps; t++) {
      let col = colors[p.floor((t / (steps + 1)) * colors.length)];
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

  function newArray(n, value) {
    n = n || 0;
    var array = new Array(n);
    for (var i = 0; i < n; i++) {
      array[i] = value;
    }
    return array;
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };
};
new p5(sketch);
