const gulp = require('gulp');
const opack = require( '../../src/index');


const lTasks = opack.libraryTasks({
    umdName: 'Caculator',
    loaders: [{
        test: /\.txt$/,
        use: 'raw-loader'
    }]
});


gulp.task('build', lTasks.build);

gulp.task('dev', lTasks.dev);

gulp.task('compile', lTasks.compile);