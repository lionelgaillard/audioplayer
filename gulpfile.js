var gulp       = require('gulp');
var jshint     = require('gulp-jshint');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat     = require('gulp-concat');
var spawn      = require('child_process').spawn;

gulp.task('default', ['config', 'scripts']);

gulp.task('scripts', ['scripts:lint', 'scripts:bundle']);

gulp.task('scripts:lint', function () {
  gulp
    .src('src/**/*')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
  ;
});

gulp.task('scripts:bundle', function () {
  gulp
    .src('src/audioplayer.js')
    .pipe(sourcemaps.init())
      .pipe(uglify({ compress: true }))
      .pipe(concat('audioplayer.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('config', ['config:lint']);

gulp.task('config:lint', function () {
  gulp
    .src(__filename)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
  ;
});

gulp.task('watch', ['watch:reload']);

gulp.task('watch:reload', function () {
  var p;

  function reload () {
    if (p) {
      p.kill();
    }

    p = spawn('gulp', ['watch:watching'], { stdio: 'inherit' });
  }

  gulp.watch(__filename, ['config', reload]);
  reload();
});

/**
 * Watching
 */
gulp.task('watch:watching', function (cb) {
  gulp.watch('src/**/*', ['scripts']);
});
