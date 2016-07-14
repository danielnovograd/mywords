var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function() {
  return gulp.src('./client/app/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
});

gulp.task('scripts', function() {
  return gulp.src('./client/app/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('public'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public'))
});

gulp.task('watch', function() {
  gulp.watch('./client/app/**/*.js', ['lint', 'scripts']);
});

