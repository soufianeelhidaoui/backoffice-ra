const path = require("path");
const fs = require('fs');
const webpack = require('webpack');

function resolveSrc(_path) {
  return path.join(__dirname, _path);
}

const cguFiles = fs.readdirSync('public/cgu');
const latestCGUFileName = cguFiles.length > 0 ? cguFiles[0] : null;
// vue.config.js
module.exports = {
  lintOnSave: true,
  runtimeCompiler: true,
  devServer: {
    disableHostCheck: true,
  },
  configureWebpack: {
    // Set up all the aliases we use in our app.
    resolve: {
      alias: {
        assets: resolveSrc("src/assets"),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'latestCGUFileName': JSON.stringify(latestCGUFileName),
      })
    ],
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: [path.resolve(__dirname, "public/index.html")],
          use: "html-loader",
        },
      ],
    },
  },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== "production",
  },
};
