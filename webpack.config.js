var webpack = require('webpack')

module.exports = {
    entry: ['./entry.js', './entry1.js'],
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
    }
}