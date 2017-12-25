Gulp Webpack Tasks out-of-box

Get tired of doing webpack config, babel, karma and so on ? Just want to write es6/7 code without too much configuration ? This tool is what you are looking for. 

Basiclly the tool can do these for you:

* config webpack within some default loaders, plugins; config babel within confortable presets.
* automatically find entries and specify dist through given rules (you are still able to customize).
* run mocha tests in karma and chrome without much configuration.
* provide a development enviroment using webpack-dev-middleware and express.
* compile or pack files up when you want to publish or deploy.

# Usage

Basiclly, you can use the tool when you are:

* Writing a front-end application.
* Writing a front-end library.

You need to dev, build, or test your code, and each of these tasks is provided within a function, so you can use the tool with gulp (or other tools).

Your gulpfile may looks like:

```
const gulp = requir('gulp');
const tasks = requre('gulp-webpack-tasks-ootb');

const libTasks = tasks.libraryTasks({...options});

gulp.task('dev', libTasks.dev);
gulp.task('test', libTasks.test);
gulp.task('prepare', function(){
    // your local tasks
})
```

## Tasks for writing an library



## Tasks for writing an appliction