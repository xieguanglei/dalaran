const getBabelOptions = function ({ react, flow }) {

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

    if (flow) {
        res.presets = [
            require('@babel/preset-typescript')
        ]
    }

    if (react) {
        res.plugins.push(
            "transform-react-jsx"
        )
    }

    return res;
}

module.exports = getBabelOptions;