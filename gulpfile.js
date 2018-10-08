var gulp  = require('gulp');
var webpack = require('webpack-stream');
var gulpLess = require('gulp-less');
var gulpConcat = require('gulp-concat');
var gulpRename = require('gulp-rename');
var gulpUglify = require('gulp-uglify');
var gulpMinifyCSS = require('gulp-minify-css');


gulp.task('less', function() { 
  return gulp.src('./build/less/index.less')
    .pipe(gulpLess())
    .pipe(gulpMinifyCSS())
    .pipe(gulpRename('app.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', function() { 
  return gulp.src('./build/js/index.js')
    .pipe(webpack({
      mode: 'none',
      output: {
        filename: 'index.js'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/env']
              }
            }
          }
        ]
      }
    }))
    .pipe(gulpConcat('index.js'))
    .pipe(gulpRename('app.js'))
    .pipe(gulpUglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy', function () {
  return gulp.src([
      './node_modules/bootstrap/**',
      './node_modules/jquery/**',
      './node_modules/font-awesome/**',
    ], {base: 'node_modules'})
    .pipe(gulp.dest('./dist/libs/'));
});

gulp.task('watch', function() {
  gulp.watch('./build/less/*.less', ['less']);
  gulp.watch('./build/js/*.js', ['js']);
});