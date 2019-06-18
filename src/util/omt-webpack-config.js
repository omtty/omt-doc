import applyOmtWebpack from "@omtty/webpack/lib/index";
import glob from "glob";
import path from "path";
import fs from "fs";

function getBabelOptions(omtDocConfig) {
  const { extraBabelPlugins = [], extraBabelPresets = [] } = omtDocConfig;
  const response = {
    babelrc: false,
    presets: [
      require.resolve("babel-preset-es2015"),
      require.resolve("babel-preset-react"),
      require.resolve("babel-preset-stage-0"),
      ...extraBabelPresets
    ],
    plugins: [
      require.resolve("babel-plugin-add-module-exports"),
      require.resolve("babel-plugin-react-require"),
      require.resolve("babel-plugin-syntax-dynamic-import"),
      require.resolve("react-hot-loader/babel"),
      ...extraBabelPlugins
    ],
    cacheDirectory: true
  };
  return response;
}

function getMarkdownLoader(category, entry, omtDocConfig, outputPath, cwd) {
  return {
    test: function(content) {
      return content.indexOf(`/${entry}/`) !== -1 && content.endsWith('.md');
    },
    use: [
      {
        loader: "babel-loader",
        options: getBabelOptions(omtDocConfig)
      },
      {
        loader: require.resolve("../doc-loader.js"),
        options: {
          category,
          outputPath,
          cwd
        }
      }
    ]
  };
}

function trim(str) {
  return (str || "").replace(/^[\.\/]*/, "").replace(/[\.\/]*$/, "");
}

export default function applyOmtWebpackConfig(omtDocConfig, argv) {
  let { entry, docEntry, ...otherOmtDocConfig } = omtDocConfig;
  const { cwd } = argv;
  const extraModuleRules = [];
  const files = [];
  const commonFileDirectory = path.resolve(cwd, ".omt.doc");
  Object.keys(docEntry).forEach(key => {
    extraModuleRules.push(
      getMarkdownLoader(
        key,
        trim(docEntry[key]),
        omtDocConfig,
        commonFileDirectory,
        cwd
      )
    );
    files.push(...glob.sync(path.resolve(cwd, docEntry[key], "**/*.md")));
  });
  const commonFileContent = files.reduce((total, next) => {
    return total + `require("${next}");\n`;
  }, "");
  const commonFilePath = path.resolve(commonFileDirectory, "index.js");
  if (fs.existsSync(commonFilePath)) {
    fs.unlinkSync(commonFilePath);
  }
  if (!fs.existsSync(commonFileDirectory)) {
    fs.mkdirSync(commonFileDirectory);
  }

  const docsJsonContent = fs.readFileSync(
    path.resolve(__dirname, "docs-json.js"),
    "utf-8"
  );

  fs.writeFileSync(commonFilePath, commonFileContent + docsJsonContent);
  if (typeof entry === "string") {
    entry = [entry];
  }
  const omtWebpackConfig = {
    entry: [".omt.doc/index.js", ...(entry || [])],
    ...otherOmtDocConfig,
    extraModuleRules
  };
  return applyOmtWebpack(omtWebpackConfig, argv);
}
