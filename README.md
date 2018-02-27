Dalaran is a light weighted tool helping you to simplify your [Webpack](https://webpack.js.org/) config for developing. Compared with some heavy develop environment frameworks, dalaran gives you back the right to build your own progress, with [Gulp](https://gulpjs.com/) to manage tasks.

> the name `Dalaran` comes from Dalaran the city, a magic city in video game World of Warcraft.

Here the docs go:

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
const dalaran = requre('dalaran');

const libTasks = dalaran.libraryTasks({...options});

gulp.task('dev', libTasks.dev);
gulp.task('test', libTasks.test);
gulp.task('prepare', function(){
    // your local tasks
})
```

## Tasks for writing an library

4 tasks are provided when you are writing a library: the `dev` task, the `build` task, the `compile` task, the `test` task.

You need to create these tasks by call `tasks.libraryTasks(options)`.

### options

| name             | description                                                 | type    | default            |
| ---------------- | ----------------------------------------------------------- | ------- | ------------------ |
| port             | dev server port                                             | Number  | 3000               |
| base             | base directory of the project                               | Sting   | process.cwd()      |
| entry            | library entry source code file                              | String  | './src/index.js'   |
| src              | the source code directory                                   | String  | './src'            |
| lib              | the compiled (to es5, for publishing to npm) code directory | String  | './lib'            |
| demo             | the demo pages directory (for development or present)       | String  | './demo'           |
| dist             | the build file directory (for umd files)                    | String  | './dist'           |
| umdName          | the library's umd name                                      | String  | 'foo'              |
| devSuffix        | the bundle file's suffix for development enviroment         | String  | 'bundle'           |
| buildSuffix      | the bundle file's suffix for build target                   | String  | 'min'              |
| react            | whether to transform JSX                                    | Boolean | false              |
| loaders          | extra webpack loaders                                       | Array   | []                 |
| plugins          | extra webpack plugins                                       | Array   | []                 |
| babelPolyfill    | whether to import babelPolyfill                             | Boolean | false              |
| devCors          | whether to enable CORS on dev server                        | Boolean | true               |
| watchTest        | whether to use watch mode for test task                     | Boolean | false              |
| testEntryPattern | file path pattern for test entries                          | String  | 'src/**/*.spec.js' |
| eslint           | whether to enable eslint                                    | Boolean | true               |

### directory structure

The main project's directory structure may looks like:

```
project
│   README.md
│   package.json
│   gulpfile.js
└───demo
│       foo.html
│       foo.js
│       bar.html
│       bar.js
└───dist
│       foo.min.js
└───lib
│   │   index.js
│   └───foo
│           foo.js
└───src
    │   index.js
    └───foo
            foo.js
            foo.spec.js
```

### dev task

```
gulp.task('dev', libTasks.dev);
```

You need to put demo pages in the **demo** directory, which by default is './demo'. Each two files with the same basename compose a demo page, for example, `foo.html` and `foo.js` compose the `foo` demo. The html files looks like: 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <script src="./foo.bundle.js"></script>
</body>
</html>
```

You can modify the html file as you like but the only one you should keep is the script tag `<script src="/foo.bundle.js"></script>`, which is the bundled file of `foo.js`. The `bundle` suffix could be changed by `devSuffix` option.

The js file looks like:

```
import MyLib from '../src/index';
// demo code
```

Run `gulp dev`, it will open your browser with `http://127.0.0.1:3000` (by default) and show the list of demos as following:

![dev-ui](https://xieguanglei.github.io/dalaran/space/assets/dev-ui.png)

Click `link` to enter link pages and do developing.

Notice that eslint is enabled by default, and a default config file will be provided, unless you put a .eslintrc in your project's root directory.

### test task

By configuring the `testEntryPattern` option, you can run tests in Karma and Chrome. A test file (`foo.spec.js` eg.) looks like:

```javascript
import expect from 'expect';
import MyLib from '../src/index';

describe('mylib', function () {

    it('mylib should be ok', function(){
        expect(!!MyLib).toBeTruthy();
    });

});
```

Run `gulp test` and the test result will be ouputed to console.

### build task

```javascript
gulp.task('build', libTasks.build);
```

Run `gulp build` will pack your `entry` (by default is './src/index.js') to a umd style file and put it in `dist` directory. You need to provide a `umdName`, whick the file's name will be `${umdName.toLowercase()}.${buildSuffix}.js`. If you load the umd script directly into html, then `window.${umdName}` is available.

### compile task

```javascript
gulp.task('build', libTasks.build);
```

If your source code contains only `js` file (which means you don't need extra webpack loaders to transform `.less`, `.txt`, `.jpg`), you can `compile` the source file from es6 / jsx to es5 and publish to npm for further use. At the time, you can also avoid pack dependencies to umd file. The compiled files will be put in `lib` directory(you can configure it by the `lib` option).

Run `gulp compile`, and compile task will be done.

## Tasks for writing an appliction

3 tasks will be provided for developing an application: the `dev` task, the `build` task, the `test` task.

You need to create these tasks by call `tasks.applicationTasks(options)`.

### options

| name             | description                                           | type    | default            |
| ---------------- | ----------------------------------------------------- | ------- | ------------------ |
| port             | dev server port                                       | Number  | 3000               |
| base             | base directory of the project                         | Sting   | process.cwd()      |
| src              | the source code directory                             | String  | './src'            |
| demo             | the demo pages directory (for development or present) | String  | './demo'           |
| dist             | the build file directory (for umd files)              | String  | './dist'           |
| devSuffix        | the bundle file's suffix for development enviroment   | String  | 'bundle'           |
| buildSuffix      | the bundle file's suffix for build target             | String  | 'bundle'           |
| react            | whether to transform JSX                              | Boolean | false              |
| loaders          | extra webpack loaders                                 | Array   | []                 |
| plugins          | extra webpack plugins                                 | Array   | []                 |
| babelPolyfill    | whether to import babelPolyfill                       | Boolean | false              |
| devCors          | whether to enable CORS on dev server                  | Boolean | true               |
| watchTest        | whether to use watch mode for test task               | Boolean | false              |
| testEntryPattern | file path pattern for test entries                    | String  | 'src/**/*.spec.js' |
| commonsChunk     | whether to enable commonsChunk plugin                 | Boolean | true               |
| publicPath       | deploy publicPath                                     | String  | './'               |
| eslint           | whether to enable eslint                              | Boolean | true               |

Compared with libaray task options, there are several differences:

1. You don't need to provide entry option.
2. You don't need to provide umdName option.
3. You don't need to provide lib option.
4. Default option of buildSuffix is `bundle` but not `min`.
5. You can use commonsChunk option to enable commonsChunk plugin.

### directory structure

The main project's directory structure may looks like:

```bash
project
│   README.md
│   package.json
│   gulpfile.js
└───demo
│       foo.html
│       foo.js
│       bar.html
│       bar.js
└───dist
│       foo.html
│       foo.bundle.js
│       bar.html
│       bar.bundle.js
└───src
    │   index.js
    └───foo
            foo.js
            foo.spec.js
```

Compared with library tasks, there are 2 main differences. 

1. lib directory is not necessary anymore.
2. dist directory is a map to demo directory (for library tasks there's only 1 file `${umdName}.${buildSuffix}.js`).
3. if you enable commonsChunk plugin, the html file should also include commons file, like: 


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <script src="./commons.bundle.js"></script>
    <script src="./foo.bundle.js"></script>
</body>
</html>
```

### dev task

Dev task is exactly the same with library tasks.

### test task

Test task is exactly the same with library tasks.

### build task

Unlike library tasks, the build task for application will pack up every page (the demo) into dist directory. It will also copy html files from demo directory to dist directory. You can deploy the js files on server, and load the js on your own page. You can also deploy the whole dist directory to some static server (gh-pages, eg), it works too.

> Notice that there's no `compile` task for application.

## If you are still confused

You may check the code in `packages` directory for more reference. Each of the project is an example how to use the tool.