const gulp = require('gulp');
const tasks = require('../../src/index');

const libraryTasks = tasks.libraryTasks({
    react: true
});

gulp.task('dev', libraryTasks.dev);
gulp.task('compile', libraryTasks.compile);