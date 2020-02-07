'use strict';

// Common
import * as gulp from 'gulp';
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
import * as http from 'http';

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
    .pipe(gulp.dest(path.join(paths.dest, tasks.typescript.dest)))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .on('error', log.error)
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(tasks.typescript.dest))
    .pipe(server.stream());
};

// CSS
let stylesTask = () => {
  return gulp.src(path.join(tasks.scss.src, '*.scss'), {base: tasks.scss.src})
    .pipe(sourcemaps.init())
    .pipe(
      sass().on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(tasks.scss.dest))
    .pipe(server.stream());
};

// Serve
let serveTask = () => {
  server.init({
    server: '../public',
    open: false, // don't open tab in browser
    ui: false
  });

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

  gulp.watch(path.join(tasks.scss.src, '*.scss'), gulp.series(stylesTask));
  gulp.watch(path.join(tasks.typescript.src, '*.ts'), gulp.series(typescriptTask));
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

exports.build = gulp.series(typescriptTask, stylesTask);

exports.serve = gulp.series(stylesTask, typescriptTask, serveTask);
exports.default = exports.serve;
