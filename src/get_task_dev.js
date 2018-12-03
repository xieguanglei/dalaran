const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');
const open = require('open');
const express = require('express');
const cors = require('cors');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');

const getWebpackConfig = require('./get_config_webpack');
const getDemoEntries = require('./get_demo_entries');

const taskDev = function ({

    base,
    demo,
    devSuffix,

    port,
    devCors,
    liveReload,

    babelPolyfill,
    react,
    typescript,

    lint,
    lintrcDir,

    loaders,
    plugins,

}) {

    const demoEntryList = getDemoEntries({
        demo,
        typescript
    });

    const webpackConfig = getWebpackConfig({
        entrys: demoEntryList,
        base,
        demo,
        dist: 'dist',
        suffix: devSuffix,
        loaders,
        plugins,
        babelPolyfill,
        react,
        lint,
        lintrcDir,
        liveReload,
        typescript,
    });


    const dev = function () {

        const config = webpackConfig;
        const app = express();
        const compiler = webpack(config);
        if (devCors) {
            app.use(cors());
        }

        app.get('/', function (req, res) {
            const templateStr = fs.readFileSync(
                path.join(__dirname, '../space/demo-list.handlebars'),
                'utf-8'
            );
            const template = Handlebars.compile(templateStr);

            const data = {
                demos: demoEntryList.map(item => {
                    return { name: item }
                })
            }
            res.send(template(data));
        });

        app.use(express.static(demo));

        app.use(webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath
        }));

        app.listen(port, function () {
            console.log('[webpack-dev-server]', `started at port ${port}`);
        });

        open(`http://127.0.0.1:${port}/`);
    }
    return dev;
}

module.exports = taskDev;