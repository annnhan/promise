var fs = require('fs');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var version = JSON.parse(fs.readFileSync('package.json')).version;

gulp.task('default', ['build']);

gulp.task('build', function () {
    gulp.src('./src/*')
        .pipe(concat('bee.' + version + '.js'))
        .pipe(gulp.dest('./prd'))
        .pipe(uglify())
        .pipe(concat('bee.' + version + '.min.js'))
        .pipe(gulp.dest('./prd'))
});