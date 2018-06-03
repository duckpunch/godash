const path = require('path');

module.exports = {
    entry: [
        './src/index'
    ],
    output: {
        library: 'godash',
        libraryTarget: 'umd',
        filename: path.join(__dirname, './dist/godash.js')
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['env']
                }
            }
        ]
    }
};
