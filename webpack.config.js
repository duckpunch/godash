module.exports = {
    entry: [
        './src/index'
    ],
    output: {
        library: 'godash',
        libraryTarget: 'umd',
        filename: './dist/godash.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    }
};
