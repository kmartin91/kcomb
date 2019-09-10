var webpack = require("webpack");
var path = require("path");
var library = "Kcomb";

module.exports = [
  {
    mode: "development",
    devtool: "source-map",
    entry: "./main.js",
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "kcomb.js",
      library: library,
      libraryTarget: "umd"
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("development")
      })
    ]
  },
  {
    mode: "production",
    devtool: "source-map",
    entry: "./main.js",
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "kcomb.min.js",
      library: library,
      libraryTarget: "umd"
    },
    optimization: {
      minimize: false
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      })
    ]
  }
];
