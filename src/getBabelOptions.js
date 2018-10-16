const getBabelOptions = function ({ react }) {

    const res = {
        presets: [
            require('@babel/preset-env')
        ],
        plugins: [
            // "transform-class-properties",
            // "transform-object-rest-spread",
            // "transform-decorators-legacy",
            // "add-module-exports"
        ]
    };

    if (react) {
        res.plugins.push(
            "transform-react-jsx"
        )
    }

    return res;
}

module.exports = getBabelOptions;