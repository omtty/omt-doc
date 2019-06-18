
## 简介

任何的项目都需要构建文档，一般我们前端的文档都是用markdown构建的，同时我们一般还要创建可以直接交互的demo，这样子会更加直观，我们在写文档的时候需要写demo事例代码，同样构建可直接交互的demo 时也要写demo事例代码，这就带来了重复的工作，为了减少工作量，我们创建了omt-doc，它可以解析markdown文档的代码块并生成可交互的demo，同时把markdown文档转化为静态网站。

## 整体流程

md 文档 ----> markdown 解析生成 js 对象 ----> 读取 js 对象生成网页

## 运行demo
进入_demo目录执行如下命令
```shell
yarn install
npm run dev
```

## 用法

```shell
yarn add @omt/doc
```

添加 script 命令

```json
{
  "dev": "omt-doc dev", // 开发模式
  "build": "omt-doc build", // 编译线上代码
  "server": "omt-doc server" // 启动server，用于线上环境
}
```

在项目根目录下面创建.omt.doc.js 配置文件

```js
module.exports = {
  docEntry: {
    components: "src/components" // markdown文件目录
  },
  entry: "./site/index.js", // 网站入口文件
  outputPath: "./dist" // 输出目录
};
```

## markdown文档编写说明

### API文档整体格式如下：
文档头

文档说明

文档 API

### 文档头格式如下：

\-\-\-

category: 文档分类，必填

title: 文档名称

sort: 排序顺序

cols: 文档样例显示列数，默认为2

\-\-\-

上面这些为默认提供的头属性，用户可以自定义属性值

### 文档说明:

文档说明可以为任意的 markdown

### 文档 API：

API 文档必须是如下格式：

\#\# API

你的文档在这里


### Demo 文档整体格式如下：

Demo 头

Demo 说明

Demo 代码块

### Demo 头格式如下：

\-\-\-

title: Demo名称

sort: 排序顺序

\-\-\-

上面这些为默认提供的头属性，用户可以自定义属性值

### Demo 说明:

Demo 说明可以为任意的 markdown

### Demo 代码块

Demo 代码块必须是如下格式：

\`\`\`jsx omt-doc-jsx

import React from "react";

class Demo extends React.Component {
    // todo
}

ReactDOM.render(<Demo />);

\`\`\`

Demo解析的代码块必须以\`\`\`jsx omt-doc-jsx开头，然后以\`\`\`结束

## 文档

.omt.doc.js 是 omt-doc 的配置文件，需要放在项目的根目录下面

| 名称       | 描述         | 类型            | 默认值 |
| ---------- | ------------ | --------------- | ------ |
| entry      | 项目入口     | string \| array | 必填   |
| outputPath | 项目输出目录 | string          | dist |
| appSrc | 项目存放代码的目录 | string | src |
| appPublic | 项目的公共资源目录| string | public |
| disableCssModules | 是否禁用css modules功能 | boolean | false, 默认开启css modules |
| publicPath | 获取chunk资源的根目录，必须以/结尾，这里可以为URL地址，如果指定了一个错误的值，则在加载这些资源时会收到 404 错误 | string | / |
| externals | 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖，[点击这里查看更多](https://www.webpackjs.com/configuration/externals/) | string array object function regex | 选填 |
| resolveAlias | 创建 import 或 require 的别名，来确保模块引入变得更简单具体查看[这里](https://www.webpackjs.com/configuration/resolve/#resolve-alias) | object | 选填 |
| extraResolveExtensions | 自动解析确定的扩展 | array | 选填 |
| extraBabelPresets | babel-loader的options.presets具体查看[这里](https://www.webpackjs.com/loaders/babel-loader/) | array | 选填 |
| extraBabelPlugins | babel-loader的options.plugins具体查看[这里](https://www.webpackjs.com/loaders/babel-loader/) | array | 选填 |
| extraModuleRules | 创建模块时，匹配请求的规则数组。这些规则能够修改模块的创建方式，具体查看[这里](https://www.webpackjs.com/configuration/module/#module-rules) | array | 选填 |
| extraJsLoaders | 额外的js和jsx loader | string object | 选填 |
| extraTsLoaders | 额外的ts和tsx loader | string object | 选填 |
| lessModifyVars | less modify vars | object | 选填 |
| docEntry | md文档入口文件 | object | 必填 |
| server | 参考devServer | object | 选填 |

其他配置和omt-webpack的配置一致

### .omt.doc.js 配置样例

```js
const path = require("path");
const compression = require("compression");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  docEntry: {
    components: "./components"
  },
  entry: "index.js",
  appSrc: "src",
  appPublic: "public",
  outputPath: "./dist",
  resolveAlias: {
  },
  extraTsLoaders: [
    {
      loader: require.resolve("react-docgen-typescript-loader"),
      options: {
        docgenCollectionName: "DJ_REACT_CLASSES"
      }
    }
  ],
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
    index: "public/index.html",
    before: app => {
      //添加你的中间件
    }
  },
  server: {
    port: 8000,
    index: "public/index.html",
    before: app => {
      app.use(compression());
    }
  },
  disableCssModules: true,
  lessModifyVars: {
    "font-size-base": "12px"
  },
  extraPlugins: [new CleanWebpackPlugin()]
};
```