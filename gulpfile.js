var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var obfuscate = require('gulp-obfuscate');
var js_obfuscator = require('gulp-js-obfuscator');
var jsfuck = require('gulp-jsfuck');


gulp.task('scripts', function() {
	gulp.src('./client/js/**/*.js')
		.pipe(js_obfuscator({}))
		.pipe(gulp.dest('./dist/'))
});
