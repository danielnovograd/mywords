var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var ngAnnotate = require('gulp-ng-annotate')

gulp.task('lint', function() {
  return gulp.src(['./client/app/**/*.js', './server/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
});

gulp.task('scripts', function() {
  return gulp.src('./client/app/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('client/public'))
    .pipe(rename('all.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('client/public'));
});

gulp.task('watch', function() {
  gulp.watch(['./client/app/**/*.js', './server/**/*.js'], ['lint', 'scripts']);
});

gulp.task('default', ['lint', 'scripts', 'watch']);


