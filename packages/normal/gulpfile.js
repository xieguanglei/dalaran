const gulp = require('gulp');
const opack = require( '../../src/index');


const lTasks = opack.libraryTasks();


gulp.task('build', lTasks.build);

gulp.task('dev', lTasks.dev);