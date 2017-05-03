const gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  babel = require('gulp-babel'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  gulpif = require('gulp-if'),
  runSequence = require('run-sequence'),
  del = require('del'),

  DEST = 'dist'

gulp.task('js', () => {
  return gulp.src('src/scripts/**/*.*')
    .pipe(plumber())
    .pipe(gulpif(/\.es6$/, babel()))
    .pipe(gulp.dest(`${DEST}/scripts`))
})

gulp.task('css', () => {
  return gulp.src('src/styles/**/*.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe(gulp.dest(`${DEST}/styles`))
})

gulp.task('images', () => {
 return gulp.src('src/images/**/**.*')
   .pipe(gulp.dest(`${DEST}/images`))
})

gulp.task('bootstrap', () => {
  return gulp.src('src/bootstrap/**/**.*')
    .pipe(gulp.dest(`${DEST}/bootstrap`))
})

gulp.task('ueditor', () => {
  return gulp.src('ueditor/**/**.*')
    .pipe(gulp.dest(`${DEST}/ueditor`))
})

gulp.task('clean', () => del(['dist']))

gulp.task('build', () => {
  runSequence(['clean'], ['js', 'css', 'images', 'bootstrap'])
})

gulp.task('dist', () => {
  runSequence(['clean'], ['js', 'css', 'images', 'bootstrap', 'ueditor'])
})

gulp.task('watch', () => {
  gulp.watch('src/scripts/**/*.es6', ['js']).on('change', (event) => {
    console.log(event)
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  })
  gulp.watch('src/styles/**/*.styl', ['css']).on('change', (event) => {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  })
})
