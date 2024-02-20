const gulp = require('gulp');
const prettify = require('gulp-prettify');
const fileinclude = require('gulp-file-include');
const injectString = require('gulp-inject-string');
const tap = require('gulp-tap');

gulp.task('fileinclude', function() {
  return gulp.src([
      "src/views/**/*.html",
      "!" + "src/views/include/**/*.html"  // include 폴더와 그 하위의 모든 html 파일을 제외
  ])
  .pipe(fileinclude({
      prefix: '@@',
      basepath: 'src/views'
  }))
  .pipe(gulp.dest('src/dist'));
});

gulp.task('injectString', function() {
  return gulp.src('src/dist/**/*.html')
      .pipe(tap((file) => {
          const indentation = file.contents.toString().match(/^\s*/)[0];
          file.contents = Buffer.from(indentation + file.contents.toString());
      }))
      .pipe(gulp.dest('src/dist'));
});

gulp.task('prettify', function() {
    return gulp.src('src/dist/**/*.html')
        .pipe(prettify({
            indent_size: 2
        }))
        .pipe(gulp.dest('src/dist'));
});

gulp.task('watch', () => {
    gulp.watch('src/views/**/*.html', gulp.series('fileinclude', 'prettify'));
});

gulp.task('default', gulp.parallel('fileinclude', 'prettify', 'watch'));
