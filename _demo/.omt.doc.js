const path = require("path");
const compression = require("compression");
const CleanWebpackPlugin = require("clean-webpack-plugin");


module.exports = {
  docEntry: {
    components: "./components"
  },
  entry: "./src/index.js",
  appSrc: "src",
  appPublic: "public",
  outputPath: "build",
  resolveAlias: {
    "boolean-trigger": path.resolve(__dirname, "components/boolean-trigger")
  },
  extraBabelPlugins: [
    "transform-runtime",
    [
      "import",
      [
        {
          libraryName: "antd",
          style: true
        }
      ]
    ],
    "transform-decorators-legacy"
  ],
  devServer: {
    port: 8000,
    index: "/public/index.html",
    before: app => {
    }
  },
  server: {
    port: 8000,
    index: "/public/index.html",
    before: app => {
      app.use(compression());
    }
  },
  disableCssModules: true,
  extraPlugins: [new CleanWebpackPlugin()]
};
