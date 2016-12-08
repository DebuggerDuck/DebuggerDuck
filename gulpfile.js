var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var es2015 = require('babel-preset-es2015');
var reactjsx = require('babel-preset-react');

function compile(watch) {
  var bundler = browserify('./client/src/index.js', { debug: false }).transform(babel, { presets: [es2015, reactjsx] });
  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./client/dist/'));
  }

  if (watch) {
    bundler.plugin(watchify);
    bundler.on('update', function() {
      console.log('-> bundling...');
      return rebundle();
    });
  }

  rebundle();
}

function watch() {
  console.log('please run: "npm run server" on another window to run nodemon')
  return compile(true);
};

gulp.task('build', function() { 
  console.log('Please run "npm run watch", on a separate window to enable watchify')
  return compile(); 
});
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);