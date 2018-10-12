const path = require('path');
const fs = require('fs-extra');
const Handlebars = require('handlebars');
const log = require('fancy-log');

const prompt = require('prompt');
prompt.colors = false;

const taskAdd = function ({
    demo,
    htmlTemplate,
    jsTemplate,
    liveReload,
    suffix,
    commonsChunk
}) {

    return function (done = () => {}) {

        prompt.start();

        prompt.get({
            properties: {
                name: {
                    description: 'Enter the NAME of demo/page you want to create',
                    pattern: /^[0-9a-zA-Z\-]+$/,
                    message: 'Name must be only letters, numbers and dashes.',
                    required: true
                }
            }
        }, function (err, result) {

            if (!err) {

                const { name } = result;

                const targetPathHtml = path.resolve(demo, `${name}.html`);
                const targetPathJS = path.resolve(demo, `${name}.js`);

                if (fs.existsSync(targetPathHtml) || fs.existsSync(targetPathJS)) {
                    done(new Error(`The file ${name}.html or ${name}.js exists. You could change a name or remove the file before creating a new one.`));
                } else {

                    const templateHTML = Handlebars.compile(fs.readFileSync(htmlTemplate, 'utf-8'));
                    const templateJS = Handlebars.compile(fs.readFileSync(jsTemplate, 'utf-8'));

                    fs.outputFileSync(targetPathHtml, templateHTML({
                        name,
                        liveReload,
                        suffix,
                        commons: commonsChunk
                    }));

                    fs.outputFileSync(targetPathJS, templateJS({
                        name,
                        liveReload,
                        suffix,
                        commons: commonsChunk
                    }));

                    log(`Add demo/page success, you need to restart dev task to see the new created demo/page.`)

                    done();
                }

            } else {
                done(err);
            }

        })

    }

}

module.exports = taskAdd;