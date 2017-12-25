const gulp = require('gulp');
const opack = require( '../../src/index');


const aTasks = opack.applicationTasks({});


gulp.task('build', aTasks.build);
gulp.task('dev', aTasks.dev);