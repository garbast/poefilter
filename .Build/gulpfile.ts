'use strict';

// Common
import {src, dest, series, watch} from 'gulp';
import * as path from 'path';

// JS
import * as browserify from 'browserify';
import * as tsify from 'tsify';
import * as source from 'vinyl-source-stream';
import * as buffer from 'vinyl-buffer';
import * as uglify from 'gulp-uglify';
import * as log from 'gulplog';
import * as rename from 'gulp-rename';

// CSS
import * as sourcemaps from 'gulp-sourcemaps';
import * as sass from 'gulp-sass';
import * as autoprefixer from 'autoprefixer';
import * as postcss from 'gulp-postcss';

// Serve
import * as browserSync from 'browser-sync';
import { PoeService } from './PoeService';

const paths = {
  src: 'src',
  dest: '../public/Resources/Public'
};

const tasks = {
  scss: {
    src: `${paths.src}/Scss`,
    dest: `${paths.dest}/Stylesheets`
  },
  typescript: {
    src: `${paths.src}/TypeScript`,
    dest: `${paths.dest}/JavaScript`
  }
};

const server = browserSync.create();

// JS
let typescriptTask = async () => {
  browserify()
    .add(path.join(tasks.typescript.src, 'App.ts'))
    .plugin(tsify, {project: 'tsconfig.json'})
    .bundle()
    .on('error', log.error)

    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(dest(tasks.typescript.dest))

    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(tasks.typescript.dest));
};

// CSS
let stylesTask = () => {
  return src(
      path.join(tasks.scss.src, '*.scss'),
      {base: tasks.scss.src}
    )
    .pipe(sourcemaps.init())
    .pipe(
      sass().on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(tasks.scss.dest))
    .pipe(server.stream());
};

// Serve
let serveTask = () => {
  server.init({
    server: '../public',
    open: false,
    ui: false
  });

  new PoeService();

  watch(path.join(tasks.scss.src, '*.scss'), stylesTask);
  watch(path.join(tasks.typescript.src, '*.ts'), typescriptTask);
};

exports.typescript = typescriptTask;

exports.scss = stylesTask;

exports.build = series(typescriptTask, stylesTask);

exports.serve = series(stylesTask, typescriptTask, serveTask);
exports.default = exports.serve;
