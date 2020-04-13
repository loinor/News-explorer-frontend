const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// подключаем плагин
const isDev = process.env.NODE_ENV === 'development';
// создаем переменную для development-сборки
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');


module.exports = {
    entry: {
        index: './src/js/index.js',
        saved: './src/js/saved.js',
        about: './src/js/result.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'src/js/[name].[chunkhash].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: { loader: "babel-loader" },
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../../',
                        hmr: process.env.NODE_ENV === 'development',
                    },
                },
                'css-loader',
            ],
        },
        {
            test: /\.(png|jpg|gif|ico|svg)$/,
            use: [
                'file-loader?name=./src/images/[name].[ext]',
                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: [0.65, 0.90],
                            speed: 4
                        },
                        bypassOnDebug: true,
                        disable: true,
                    }
                },
            ]
        },
        {
            test: /\.(eot|ttf|woff|woff2)$/,
            loader: 'file-loader?name=./src/vendor/fonts/[name].[ext]'
        }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'src/css/[name].[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/gi,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default'],
            },
            canPrint: true
        }),
        new HtmlWebpackPlugin({
            inject: false, 
            hash: true, 
            template: './src/pages/index/index.html', 
            filename: 'index.html' 
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/pages/saved/index.html',
            filename: 'saved/index.html'
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/pages/result/index.html',
            filename: 'about/index.html'
        }),
        new WebpackMd5Hash(),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};