const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const prodPlugins = [
  new MiniCssExtractPlugin({
    filename: 'style.css'
  })
]
const devPlugins = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['.hot/*', '!**/.gitkeep']
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]

module.exports = {
  target: 'web',
  mode: isDev ? 'development' : 'production',
  entry: [
    // enable hot reloading
    ...(isDev ? ['webpack-hot-middleware/client'] : []),
    // enables async-await
    '@babel/polyfill',
    // our entry point
    './client/index.js'
  ],
  output: {
    path: path.join(__dirname, 'public/dist'),
    publicPath: '/dist/',
    filename: 'bundle.js',
    hotUpdateChunkFilename: '.hot/[id].[hash].hot-update.js',
    hotUpdateMainFilename: '.hot/[hash].hot-update.json'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  watchOptions: {
    ignored: /(node_modules|public)/
  },
  optimization: {
    noEmitOnErrors: true
  },
  plugins: isDev ? devPlugins : prodPlugins,
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          isDev
            ? 'style-loader'
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {hmr: isDev}
              },
          'css-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
