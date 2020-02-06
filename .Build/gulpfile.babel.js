'use strict';

import {src, dest, series, watch} from 'gulp';
import log from 'gulplog';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import http from 'http';
import normalize from 'node-normalize-scss';
import path from 'path';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import tsify from 'tsify';

const server = browserSync.create();

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

// JS
let typescriptTask = () => {
  let b = browserify({
    entries: [
      path.join(tasks.typescript.src, 'App.ts')
    ],
    debug: true
  });

  return b
    .plugin(tsify, {project: 'tsconfig.json'})
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // This will output the non-minified version
    .pipe(dest(path.join(paths.dest, tasks.typescript.dest)))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .on('error', log.error)
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(tasks.typescript.dest))
    .pipe(server.stream());
};

// CSS
let stylesTask = () => {
  return src(path.join(tasks.scss.src, '*.scss'), {base: tasks.scss.src})
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: normalize.includePaths
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(tasks.scss.dest))
    .pipe(server.stream());
};

let serveTask = () => {
  server.init({
    server: '../public',
    open: false, // don't open tab in browser
    ui: false
  });

  /**
   * @var IncomingMessage request
   * @var ServerResponse response
   */
  http.createServer((request, response) => {
    if (request.method === 'POST') {
      let body = '';
      request.on('data', (data) => {
        body += data;
        console.log('Partial body: ' + body)
      });

      request.on('end', function () {
        console.log('Body: ' + body);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('post received')
      })
    }
  }).listen(9000);

  watch(path.join(tasks.scss.src, '*.scss'), series(stylesTask));
  watch(path.join(tasks.typescript.src, '*.ts'), series(typescriptTask));
};

/*
  return DoServerRequest({
    method: 'get',
    url: Constants.POE_STASH_ITEMS_URL,
    options: {
      headers: {
        'Cookie': `${Constants.POE_COOKIE_NAME}=${cookie}`
      },
      params: options
    },
    onSuccess: `STASH_TAB_RESPONSE`,
    onError: `STASH_TAB_ERROR`
  })
*/

exports.typescript = typescriptTask;

exports.scss = stylesTask;

exports.build = series(typescriptTask, stylesTask);

exports.serve = series(stylesTask, typescriptTask, serveTask);
exports.default = exports.serve;
