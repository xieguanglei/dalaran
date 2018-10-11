const gulp = require('gulp');

const tasks = require('../../src/index');

const lTasks = tasks.libraryTasks({
    umdName: 'Caculator',
    loaders: [],
    plugins: [],
    testEntryPattern : 'test/**/*.spec.js',
    liveReload: true,
    flow: true,
    eslint: false
});

gulp.task('dev', lTasks.dev);

gulp.task('test', lTasks.test);

gulp.task('build', lTasks.build);

gulp.task('compile', lTasks.compile);

gulp.task('demo', lTasks.demo);
