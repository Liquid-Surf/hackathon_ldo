const path = require('path');

module.exports = [
    {
        entry: {
            'form-default': './src/form-default.ts',
            'form-material': './src/form-material.ts',
            'form-bootstrap': './src/form-bootstrap.ts',
            'plugins/mapbox': './src/plugins/mapbox.ts',
            'plugins/leaflet': './src/plugins/leaflet.ts',
            'plugins/fixed-list': './src/plugins/fixed-list.ts',
            'plugins/image-upload': './src/plugins/image-upload.ts',
        },
        experiments: { outputModule: true },
        output: {
            filename: '[name].js',
            library: { type: 'module' },
        },
        module: {
            rules: [
                { test: /\.tsx?$/, use: 'ts-loader' },
                { test: /\.css$/i, use: ['raw-loader'] },
            ],
        },
        resolve: { extensions: ['.tsx', '.ts', '.js'] },
        devServer: {
            static: [ { directory: path.join(__dirname, 'demo'), serveIndex: true } ],
            compress: true,
            hot: true,
            port: 8080,
        },
        // devtool: "source-map",
    },
];
