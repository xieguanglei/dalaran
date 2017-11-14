const gulp = require('gulp');
const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const opack = require('../../src/index');


const opt = {};
glob.sync('src/**/foo.*.js').forEach(item => {
    const name = item.split('.')[1];
    opt[name] = path.join(__dirname, item);
});


const lTasks = opack.libraryTasks({
    umdName: 'Caculator',
    loaders: [{
        test: /\.txt$/,
        use: 'raw-loader'
    }],
    plugins: [
        new webpack.ProvidePlugin(opt)
    ]
});


gulp.task('build', lTasks.build);

gulp.task('dev', lTasks.dev);

gulp.task('compile', lTasks.compile);

gulp.task('a', function () {

})