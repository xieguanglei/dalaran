const gulp = require('gulp');
const opack = require( '../../src/index');


const lTasks = opack.libraryTasks({
    umdName: 'Caculator'
});


gulp.task('build', lTasks.build);

gulp.task('dev', lTasks.dev);