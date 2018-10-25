const path = require('path');
const glob = require('glob');
const fs = require("fs");
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

const fsExistsSync = (path) => {
    try {
        fs.accessSync(path,fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * init webpack config item
 */
let config = {
    customEntry: {}, // custom entry files
    systemEntry: {}, // system entry files
    customPlugins: [], // custom plugin config
    systemPlugins: [] // system plugin config
};

config.customEntry = {
    vendor: ['react', 'react-dom']
};
config.customPlugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js')
];

/**
 * set system entry and system plugin
 */
// 根据html文件的目录结构进行打包
let files = glob.sync(path.resolve(__dirname, 'src/**/*.html'));
files.map((item) => {
    try {
        let entryFiles = null,
            name = item.replace('.html', '');
        if (fsExistsSync(name + '.js')) {
            entryFiles = name + '.js';
        } else if (fsExistsSync(name + '.jsx')) {
            entryFiles = name + '.jsx'
        } else {
            return;
        }
        name = name.substring(name.indexOf('src/'));
        name = name.replace('src/', '');
        config.systemEntry[name] = entryFiles;

        let plug =  new htmlWebpackPlugin({
            filename: path.resolve(__dirname, 'build/'+ name +'.html'),
            chunks: [name, 'vendor'],
            template: path.resolve(__dirname, 'src/' + name + '.html'),
            inject: true
        });
        config.systemPlugins.push(plug);

    } catch (e) {
        console.log('Exception:', e);
    }
});

module.exports = {
    entry: Object.assign({}, config.customEntry, config.systemEntry),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        preLoaders: [{
            test: /\.(jsx|js)?$/,
            exclude: /(node_modules|build)/,
            loader: 'eslint-loader'
        }],
        loaders: [{
            test: /\.(jsx|js)?$/,
            exclude: /(node_modules|build)/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            loader: 'url-loader?name=[path][name].[ext]'
        }]
    },
    resolve: {extensions: ['', '.js', '.jsx']},
    plugins: config.systemPlugins.concat(config.customPlugins)
};