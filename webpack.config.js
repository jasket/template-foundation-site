const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const PATH_JS = path.resolve(__dirname, "src/js");
const PATH_HTML = path.resolve(__dirname, "src/html");
const PATH_ASSETS = path.resolve(__dirname, "src/assets");
const PATH_SCSS = path.resolve(__dirname, "src/scss");

const devMode = process.env.NODE_ENV !== "production";

let config = {
  entry: {
    index: [`${PATH_JS}/index.js`, `${PATH_SCSS}/index.scss`],
    library: [`${PATH_JS}/library.js`, `${PATH_SCSS}/library.scss`]
  },

  output: {
    filename: "./js/[name].bundle.js"
  },

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
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../"
            }
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(jpe?g|png|gif|mp3)$/i,
        include: PATH_ASSETS,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "img/"
          }
        }
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: PATH_ASSETS,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "fonts/"
          }
        }
      },
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: "$"
          }
        ]
      },
      {
        test: require.resolve("foundation-sites"),
        use: [
          {
            loader: "expose-loader",
            options: "Foundation"
          }
        ]
      }
    ]
  },

  devServer: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 3000
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].bundle.css",
      chunkFilename: "css/[id].bundle.css"
    }),
    new CopyWebpackPlugin([
      {
        from: `${PATH_ASSETS}/favicons`,
        to: "./favicons"
      }
    ]),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: `${PATH_HTML}/views/index.html`,
      inject: false
    })
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
  }

  if (argv.mode === "production") {
    config.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    };

    config.plugins.push(new CleanWebpackPlugin("dist", {}));
  }

  return config;
};
