const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');

const getDemoEntries = require('./get_demo_entries');
const getTaskBuild = require('./get_task_build');

function getTaskBuildLibrary({

    demo,

    base,
    dist,

    suffix: buildSuffix,

    minify,

    loaders,
    plugins,

    babelPolyfill,
    typescript,
    react,

    publicPath

}) {

    return function (done) {

        const demoEntryList = getDemoEntries({ demo, typescript });

        const build = getTaskBuild({

            entrys: demoEntryList,
            demo,

            base,
            dist,

            suffix: buildSuffix,

            minify,

            loaders,
            plugins,

            babelPolyfill,
            typescript,
            react,

            publicPath,
        });

        build(function () {
            copyHTMLs();
            done && done();
        });

        function copyHTMLs() {
            const htmlFiles = glob.sync(demo + '/*.html');

            htmlFiles.forEach(file => {

                const content = fs.readFileSync(file, 'utf-8');
                const baseName = path.basename(file);

                const modifiedContent = content.replace(/__TIMESTAMP__/g, 'timestamp=' + Date.now())
                    .replace(/<script src=\".+livereload.js\"><\/script>/g, '');

                fs.outputFile(dist + `/${baseName}`, modifiedContent);
            });
        }
    }
}


module.exports = getTaskBuildLibrary;
