(function () {
	'use strict'

	var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	sourcemaps = require('gulp-sourcemaps'),
	gcmq = require('gulp-group-css-media-queries'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync').create();

	gulp.task('default', ['sass', 'js', 'images', 'fonts', 'browser-sync', 'watch']);

	gulp.task('sass', function () {
		return gulp.src('./dev/scss/**/*.scss')
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer({
				browsers: ['last 6 versions'],
				cascade: false
			}))
			.pipe(gcmq())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./build/css'))
			.pipe(browserSync.stream());

	});

	gulp.task('watch', function () {
		gulp.watch('./dev/scss/**/*.scss', ['sass']);
		gulp.watch('./dev/js/**/*.js', ['js']);
		gulp.watch('./dev/images/*', ['images']);
		gulp.watch('./dev/fonts/**/*', ['fonts']);
		gulp.watch(['./build/**/*', './*.html']).on("change", browserSync.reload);

	});

	gulp.task('sassBuild', function () {
		return gulp.src('./dev/scss/**/*.scss')
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer({
				browsers: ['last 6 versions'],
				cascade: false
			}))
			.pipe(gcmq())
			.pipe(cssnano())
			.pipe(gulp.dest('./build/css'));
	});

	gulp.task('js', function(){
		return gulp.src('./dev/js/**/*.js')
			.pipe(gulp.dest('./build/js'))
			.pipe(browserSync.stream());

	});

	gulp.task('fonts', function(){
		return gulp.src('./dev/fonts/**/*')
			.pipe(gulp.dest('./build/fonts'))
			.pipe(browserSync.stream());

	});

	gulp.task('images', function(){
		return gulp.src('dev/images/*')
			.pipe(imagemin({
				interlaced: true,
				progressive: true,
				optimizationLevel: 5,
				svgoPlugins: [{removeViewBox: false}]
			}))
			.pipe(gulp.dest('./build/images'))
			.pipe(browserSync.stream());
	});

	gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 8080
    });
	});

	gulp.task('build', ['sassBuild']);

}())