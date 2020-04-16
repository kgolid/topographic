import * as dat from 'dat.gui';
import * as tome from 'chromotome';
import SimplexNoise from 'simplex-noise';
import { draw_poly } from './display';
import PoissonDiskSampling from 'poisson-disk-sampling';

let sketch = function (p) {
  let simplex;
  let noise_grid;

  let sampling;
  let points;

  let opts;
  let palette;

  const grid_dim_x = 800;
  const grid_dim_y = 800;

  const nx = Math.floor(grid_dim_x / 20);
  const ny = Math.floor(grid_dim_y / 20);

  let cell_dim;

  p.setup = function () {
    p.createCanvas(grid_dim_x, grid_dim_y);
    //p.noLoop();
    p.frameRate(0.5);

    opts = {
      noise_scale: 30,
      noise_persistence: 0.3,
      baseline: 0.5,
      center_magnitude: 2,
      cell_dim: 4,
      min_dist: 120,
      tries: 15,
      palette: 'nowak',
      shadow: true,
      run: () => reset(),
    };

    const gui = new dat.GUI();
    gui.width = 300;
    const f1 = gui.addFolder('Noise field');
    f1.add(opts, 'noise_scale', 5, 100, 10).name('Noise scale');
    f1.add(opts, 'noise_persistence', 0.1, 1, 0.05).name('Noise persistence');
    f1.add(opts, 'baseline', 0, 1, 0.05).name('Baseline');
    f1.add(opts, 'center_magnitude', 0.75, 4, 0.25).name('Center magnitude');
    f1.add(opts, 'cell_dim', 1, 10, 0.5).name('Zoom level');
    f1.add(opts, 'min_dist', 10, 150, 10).name('Min distance');
    f1.add(opts, 'tries', 1, 20, 2).name('Tries');
    f1.open();

    const f2 = gui.addFolder('Style');
    f2.add(opts, 'palette', tome.getNames());
    f2.add(opts, 'shadow').name('Shadow');
    f2.open();

    gui.add(opts, 'run');

    reset();
  };

  p.draw = function () {
    reset();
  };

  function reset() {
    palette = tome.get(opts.palette);

    sampling = new PoissonDiskSampling({
      shape: [grid_dim_x, grid_dim_y],
      minDistance: opts.min_dist,
      tries: opts.tries,
    });
    points = sampling.fill();

    cell_dim = opts.cell_dim;
    display();
  }

  function display() {
    p.push();
    p.translate((-nx * cell_dim) / 2, (-ny * cell_dim) / 2);
    p.background(palette.background ? palette.background : '#f5f5f5');
    for (let t = 0; t < 1; t++) {
      for (let i = 0; i < points.length; i++) {
        simplex = new SimplexNoise();
        const pnt = points[i];
        const col = palette.colors[Math.floor(Math.random() * palette.colors.length)];

        noise_grid = build_noise_grid(opts.baseline, opts.center_magnitude);

        p.push();
        p.translate(Math.floor(pnt[0]), Math.floor(pnt[1]));
        if (opts.shadow) {
          p.fill(palette.stroke);
          process_grid();
          p.translate(5, -10);
        }
        p.fill(col);
        process_grid();
        //p.ellipse((cell_dim * nx) / 2, (cell_dim * ny) / 2, 10, 10);
        p.pop();
      }
    }
    p.pop();
  }

  function process_grid() {
    p.push();
    for (let y = 0; y < ny; y++) {
      p.push();
      for (let x = 0; x < nx; x++) {
        process_cell(x, y, 0);
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

  function build_noise_grid(baseline, offset_mag) {
    return [...Array(ny + 1)].map((_, y) =>
      [...Array(nx + 1)].map(
        (_, x) => sum_octave(16, x, y) + offset_mag * (center_offset(x, y) - baseline)
      )
    );
  }

  // Output range [-1, 1]
  function center_offset(x, y) {
    return 1 - distance_from_centre(x, y) * 2;
  }

  // Output range: [0, 1] (within tangent circle);
  function distance_from_centre(x, y) {
    return Math.sqrt(Math.pow(nx / 2 - x, 2) + Math.pow(ny / 2 - y, 2)) / nx;
  }

  // Output range: [-1, 1]
  function sum_octave(num_iterations, x, y) {
    let noise = 0;
    let maxAmp = 0;
    let amp = 1;
    let freqx = 1 / opts.noise_scale;
    let freqy = 1 / opts.noise_scale;

    for (let i = 0; i < num_iterations; i++) {
      noise += simplex.noise3D(x * freqx, y * freqy, i) * amp;
      maxAmp += amp;
      amp *= opts.noise_persistence;
      freqx *= 2;
      freqy *= 2;
    }
    //return 0;
    return noise / maxAmp;
  }

  p.keyPressed = function () {
    if (p.keyCode === 80) p.saveCanvas('topollock', 'jpeg');
  };
};
new p5(sketch);
