const gulp = require('gulp');
const tasks = require( '../../src/index');

const appTasks = tasks.applicationTasks({});

gulp.task('dev', appTasks.dev);
gulp.task('build', appTasks.build);