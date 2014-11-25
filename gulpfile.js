var gulp       = require('gulp');
var jshint     = require('gulp-jshint');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat     = require('gulp-concat');
var rename     = require('gulp-rename');
var del        = require('del');
var spawn      = require('child_process').spawn;
var webpack    = require('gulp-webpack');

gulp.task('default', ['config', 'scripts']);

gulp.task('scripts', ['scripts:lint', 'scripts:bundles']);

gulp.task('scripts:lint', function () {
  gulp
    .src('src/**/*')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
  ;
});

gulp.task('scripts:bundles', ['scripts:clean', 'scripts:bundles:soundmanager', 'scripts:bundles:soundjs']);

gulp.task('scripts:clean', function (cb) {
  del(['dist/**/*'], cb);
});

gulp.task('scripts:bundles:soundmanager', function () {
  gulp
    .src('src/audioplayer-soundmanager.js')
    .pipe(webpack({
      output: {
        library: 'audioplayer-soundmanager',
        libraryTarget: 'umd'
      },
      externals: {
        jquery: true,
        soundManager: true
      }
    }))
    .pipe(concat('audioplayer-soundmanager.js'))
    .pipe(gulp.dest('dist'))
    .pipe(sourcemaps.init())
    .pipe(uglify({ compress: true }))
    .pipe(concat('audioplayer-soundmanager.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('scripts:bundles:soundjs', function () {
  gulp
    .src('src/audioplayer-soundjs.js')
    .pipe(webpack({
      output: {
        library: 'audioplayer-soundjs',
        libraryTarget: 'umd'
      },
      externals: {
        jquery: true,
        createjs: true
      }
    }))
    .pipe(concat('audioplayer-soundjs.js'))
    .pipe(gulp.dest('dist'))
    .pipe(sourcemaps.init())
    .pipe(uglify({ compress: true }))
    .pipe(concat('audioplayer-soundjs.min.js'))
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
