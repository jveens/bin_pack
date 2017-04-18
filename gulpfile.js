const gulp = require( 'gulp' );
const plumber = require('gulp-plumber');
const sass = require( 'gulp-sass');
const notify = require( 'gulp-notify' );
const concat = require( 'gulp-concat' );
const uglify = require( 'gulp-uglify' );
const autoprefixer = require( 'gulp-autoprefixer' );

gulp.task('scripts', () => {
    return gulp.src('./src//**/*.js')
        .on('error',notify.onError({
            message: "Error: <%= error.message %>",
            title: 'JS Error!!'
        }))
        .pipe(concat('brick.js'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('styles', () => {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
        	browsers: [ 'last 2 versions', '> 2%']
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles'))
});

gulp.task( 'watch', function(){

	gulp.watch( './src/styles/**/*.scss', [ 'styles' ]);
	gulp.watch( './src/scripts/**/*.js', [ 'scripts' ]);

});

gulp.task('default', [ 'scripts', 'styles', 'watch' ] );
