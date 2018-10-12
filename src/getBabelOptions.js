const getBabelOptions = function ({ react, flow }) {

    const res = {
        "presets": [
            "env",
            "stage-0"
        ],
        "plugins": [
            "transform-class-properties",
            "transform-object-rest-spread",
            "transform-decorators-legacy",
            "add-module-exports"
        ]
    };
    if (react) {
        res.plugins.push(
            "transform-react-jsx"
        )
    }
    if (flow) {
        res.presets.push(
            "flow"
        )
    }

    return res;
}

module.exports = getBabelOptions;