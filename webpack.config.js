const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config = {
  target: "web",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "echarts-extension-leaflet.js",
    library: {
      name: "echartsExtensionLeaflet",
      type: "umd"
    }
  },
  optimization: {
    minimize: true // false
  },
  watchOptions: {
    aggregateTimeout: 600,
    ignored: /node_modules/,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "./dist")],
    }),
  ],
  module: {
    rules: [ ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: {
    "echarts/core": {
      commonjs: "echarts/core",
      commonjs2: "echarts/core",
      amd: "echarts/core",
      root: "echarts"
    },
    "leaflet": {
      commonjs: "leaflet",
      commonjs2: "leaflet",
      amd: "leaflet",
      root: "L"
    }
  }
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    // * add some development rules here
  } else if (argv.mode === "production") {
    // * add some prod rules here
  } else {
    throw new Error("Specify env");
  }

  return config;
};
