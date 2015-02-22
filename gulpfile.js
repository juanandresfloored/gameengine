var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var reactify = require('reactify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var del = require('del');

var paths = {
  css: '',
  vendor: 'vendor/**/*.js',
  js: ['client/src/**/*.js'],
  apps: ['client/client.js', 'client/client2.js']
};

var devPaths = {
  all: 'client/dev/*',
  dev: 'client/dev/',
  watch: ['client/**/*.js', 'client/**/*.jsx', 'client/**/*.html', '!client/dev/*', '!client/dist/*']
};

var deployPaths = {
  all: 'client/dist/*',
  dist: 'client/dist/'
};

gulp.task('all:clean', ['dev:clean', 'deploy:clean']);

gulp.task('dev:clean', function(cb) {
  del([
    devPaths.all
  ], {force: true}, cb);
});

gulp.task('dev:watch', function() {
  gulp.watch(devPaths.watch, ['dev:build']);
});

gulp.task('dev:build', ['dev:clean'], function() {
  var browserifiedAndReactified = transform(function (filename) {
    var b = browserify(filename);
    b.transform(reactify);
    return b.bundle();
  });
  
  return gulp.src(paths.apps)
    .pipe(browserifiedAndReactified)
    .pipe(gulp.dest(devPaths.dev));
});

gulp.task('developer', ['dev:clean', 'dev:watch', 'dev:build'], function() {
  nodemon({
    script: 'server.js',
    ext: 'html js',
    env: { 'NODE_ENV': 'development' }, 
    ignore: ['client/dev/*', 'client/dist/*'] })
    .on('restart', function () {
      console.log('restarted!');
    });
});

// gulp.task('deploy:clean', function(cb) {
//   del([
//     deployPaths.all
//   ], {force: true}, cb);
// });

// gulp.task('deploy:build', ['deploy:clean'], function() {

//   var transformations = transform(function (filename) {
//     var b = browserify(filename);
//     b.transform(reactify);
//     return b.bundle();
//   });

//   return gulp.src(paths.apps)
//     .pipe(transformations)
//     .pipe(uglify())
//     .pipe(gulp.dest(deployPaths.dist));
// });