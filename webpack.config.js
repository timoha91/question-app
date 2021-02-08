const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = (extra) => {
    const loaders = [       
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: ''
              },
            },
            'css-loader'
    ]

    if (extra) {
        loaders.push(extra)
    }
    return loaders
}

const plugins = () => {
    base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname,'src/assets/favicon.png'),
                    to: path.resolve(__dirname,'public')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
            
        }),
    ]

    if (!isDev) {
        base.push(new BundleAnalyzerPlugin())
    }
    return base
}

module.exports = {
    target: 'web',
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './app.js',        
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname,'public')
    },
    resolve: {
        extensions: ['.js','.json','png'],
        alias: {
            '@models': path.resolve(__dirname,'src/models'),
            '@': path.resolve(__dirname,'src')
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimize: !isDev,
        minimizer: [
          `...`,
          new CssMinimizerPlugin(),
        ],
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        port: 4200,  
    },
    watchOptions: {
        poll: 1000 // Check for changes every second
      },
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: cssLoaders(),
            },
            {
                test: /\.less$/i,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            },
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env','@babel/preset-typescript']
                  }
                }
            }
        ]
    }
}