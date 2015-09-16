var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
//var browserSync = require('browser-sync'); --can't install without updating OS version :(

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('app/css'));
	 });

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  //gulp.watch('app/*.html', browserSync.reload); 
  //gulp.watch('app/js/**/*.js', browserSync.reload); 
  });

gulp.task('useref', function(){
  var assets = useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(gulpIf('*.css', minifyCSS())) // minifies only CSS
    .pipe(gulpIf('*.js', uglify())) // Uglifies only Javascript files
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

//clean files unneeded
gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
});

gulp.task('clean:dist', function(callback){
  del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});

// Build Sequences
// ---------------



//COMMAND LINE NOTES
/*
gulp watch / gulp -- compile sass into css, watch js and html
gulp build -- compiles and writes to production directory ('dist')
gulp clean -- clears away any generated dist older caches, removing old files we don't need
gulp useref -- minifies specified files (noted between comments in HTML), and copies to "dist"/production-ready folder
*/