const gulp = require('gulp');
const opack = require( '../../src/index');


const aTasks = opack.applicationTasks({
    demo: './pages',
    react: true
});


gulp.task('build', aTasks.build);
gulp.task('dev', aTasks.dev);
gulp.task('lint', aTasks.lint);