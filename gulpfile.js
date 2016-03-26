var fs = require('fs');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var version = require('./package').version;

gulp.task('default', ['build']);

gulp.task('build', function () {
    gulp.src('./src/*.js')
        .pipe(concat('promise.' + version + '.js'))
        .pipe(gulp.dest('./prd'))
        .pipe(uglify())
        .pipe(concat('promise.' + version + '.min.js'))
        .pipe(gulp.dest('./prd'))
});