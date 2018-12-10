# 中文文档

Dalaran 是一个简单的前端开发环境，它可以帮助你简化 Webpack / Babel / Typescript / ESLint / TSLint / Karma / Mocha 配置。基本上，它可以接管你的开发调试、测试、Lint、打包过程。

## 安装

```bash
$ npm install dalaran --save-dev
```

## 使用

前端开发，通常包括两种：

* 开发前端模块（库）。
* 开发前端应用。

### 开发模块

调用 `libraryTasks` 来创建一些任务函数。我们提供了四个任务：`dev`，`build`，`test`。

```javascript
const dalaran = require('dalaran');

const tasks = dalaran.libraryTasks(options);

tasks.dev(); // 开启调试

tasks.build(); // 构建打包

tasks.test(); // 进行测试
```

#### 参数

| 参数名称         | 描述                          | 类型    | 默认值             |
| ---------------- | ----------------------------- | ------- | ------------------ |
| port             | 调试服务器端口                | Number  | 3000               |
| base             | 项目根目录                    | Sting   | process.cwd()      |
| entry            | 模块的入口文件                | String  | './src/index.js'   |
| demo             | demo 目录（调试时的入口文件） | String  | './demo'           |
| dist             | 打包文件的目录                | String  | './dist'           |
| umdName          | 模块的 UMD 名称               | String  | 'foo'              |
| devSuffix        | 调试时 bundle 的后缀名        | String  | 'bundle'           |
| buildSuffix      | 打包文件的后缀名              | String  | 'min'              |
| react            | 是否转译 JSX                  | Boolean | false              |
| loaders          | 额外的 webpack loaders        | Array   | []                 |
| plugins          | 额外的 webpack plugins        | Array   | []                 |
| babelPolyfill    | 是否引入 babelPolyfill        | Boolean | false              |
| devCors          | 调试服务器是否开启 CORS       | Boolean | true               |
| watchTest        | 测试时是否开启 watch          | Boolean | false              |
| testEntryPattern | 测试文件的匹配模式            | String  | 'src/**/*.spec.js' |
| lint             | 是否开启 lint                 | Boolean | false              |
| lintrcDir        | lint 配置文件存放目录         | String  | process.cwd()      |
| minify           | 打包时是否压缩 JS             | Boolean | true               |
| liveReload       | 调试时是否开启 livereload     | Boolean | fasle              |
| typescript       | 是否开启 Typescript           | Boolean | false              |

### 开发应用

调用 `applicationTasks` 来创建一些任务函数。我们提供了四个任务：`dev`，`build`，`test`。

```javascript
const dalaran = require('dalaran');

const tasks = dalaran.applicationTasks(options);

tasks.dev(); // 开启调试

tasks.build(); // 构建打包

tasks.test(); // 进行测试
```

#### 参数

| name             | description                   | type    | default            |
| ---------------- | ----------------------------- | ------- | ------------------ |
| port             | 调试服务器端口                | Number  | 3000               |
| base             | 项目根目录                    | Sting   | process.cwd()      |
| demo             | demo 目录（调试时的入口文件） | String  | './demo'           |
| dist             | 打包文件的目录                | String  | './dist'           |
| devSuffix        | 调试时 bundle 的后缀名        | String  | 'bundle'           |
| buildSuffix      | 打包文件的后缀名              | String  | 'bundle'           |
| react            | 是否转译 JSX                  | Boolean | false              |
| loaders          | 额外的 webpack loaders        | Array   | []                 |
| plugins          | 额外的 webpack plugins        | Array   | []                 |
| babelPolyfill    | 是否引入 babelPolyfill        | Boolean | false              |
| devCors          | 调试服务器是否开启 CORS       | Boolean | true               |
| watchTest        | 测试时是否开启 watch          | Boolean | false              |
| testEntryPattern | 测试文件的匹配模式            | String  | 'src/**/*.spec.js' |
| publicPath       | 部署时的 publicPath           | String  | './'               |
| lint             | 是否开启 lint                 | Boolean | false              |
| minify           | 打包时是否压缩 JS             | Boolean | true               |
| liveReload       | 调试时是否开启 livereload     | Boolean | fasle              |
| typescript       | 是否开启 Typescript           | Boolean | false              |
