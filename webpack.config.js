const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PATH_JS = path.resolve(__dirname, "src/js");
const PATH_HTML = path.resolve(__dirname, "src/html");
const PATH_ASSETS = path.resolve(__dirname, "src/assets");
const PATH_SCSS = path.resolve(__dirname, "src/scss");

module.exports = {
  entry: {
    index: [`${PATH_JS}/index.js`, `${PATH_SCSS}/index.scss`],
    library: [`${PATH_JS}/library.js`, `${PATH_SCSS}/library.scss`]
  },

  output: {
    filename: "./js/[name].bundle.js"
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        include: PATH_JS,
        use: { loader: "babel-loader" }
      },
      {
        test: /\.html$/,
        include: `${PATH_HTML}/includes`,
        use: { loader: "raw-loader" }
      },
      {
        test: /\.(sass|scss)$/,
        include: PATH_SCSS,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                minimize: true,
                url: false
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },

  devServer: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 3000
  },

  plugins: [
    new ExtractTextPlugin({
      filename: "./css/[name].bundle.css",
      allChunks: true
    }),
    new CopyWebpackPlugin([
      {
        from: PATH_ASSETS,
        to: "./assets"
      }
    ]),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: `${PATH_HTML}/views/index.html`,
	    inject: false,
    })
  ]
};
