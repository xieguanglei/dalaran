const getBabelOptions = function ({ react }) {

    const res = {
        presets: [
            require('@babel/preset-env')
        ],
        plugins: [
            require("@babel/plugin-proposal-class-properties"),
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