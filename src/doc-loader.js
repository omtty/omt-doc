import { getOptions } from "loader-utils";
import getHeader from "./util/markdown/get-header";
import createGetJsx from "./util/markdown/get-jsx";
import getApi from './util/markdown/get-api';
import marked from "marked";
import md5 from 'js-md5';

function omtDocFileContnt(category, key, value) {
  return `
import React from "react";
if(!window["OMT_DOCS_JSON"]) window["OMT_DOCS_JSON"] = {};
if(!window["OMT_DOCS_JSON"]["${category}"]) window["OMT_DOCS_JSON"]["${category}"] = {};
Object.assign(window["OMT_DOCS_JSON"]["${category}"], { "${key}": ${value} });
`;
}

function invokePlugins(plugins, content, value) {
  const invokePlugin = (plugins, index, content, value) => {
    if (index < plugins.length - 1) {
      plugins[index](content, value, (error, content, value) => {
        if (error) {
          plugins[plugins.length - 1](error);
        } else {
          invokePlugin(plugins, index + 1, content, value);
        }
      });
    }
  };
  invokePlugin(plugins, 0, content, value);
}

export default function docLoader(content, map, meta) {
  var next = this ? this.async() : () => {};
  const options = (this ? getOptions(this) : {}) || {};
  const callback = (error, content, ...args) => {
    if (error) {
      next(
        new Error(`${error.message}\n文件路径:${this.resourcePath}`),
        content,
        ...args
      );
    } else {
      const source = omtDocFileContnt(
        options.category,
        this.resourcePath,
        content
      );
      next(error, source, ...args);
    }
  };
  const getJsx = createGetJsx(options.outputPath, this.resourcePath.replace(`${options.cwd}/`, ""));
  const plugins = [getHeader, getJsx, getApi];
  if (options.plugins) {
    options.plugins.forEach(plugin => {
      plugins.push(require(plugin));
    });
  }
  plugins.push((content, value, next) => {
    callback(
      null,
      stringify({
        ...value,
        html: marked(content),
        id: md5(this.resourcePath),
        path: this.resourcePath
      })
    );
  });
  plugins.push(error => {
    callback(error);
  });
  invokePlugins(plugins, content, {});
}

function stringify(object) {
  const { jsxs, ...obj } = object;
  const jsonStrings = JSON.stringify({
    jsxs: "__omt_doc_jsxs__",
    ...obj
  });
  const jsxsString = jsxs.join(",");
  return jsonStrings.replace('"__omt_doc_jsxs__"', `[${jsxsString}]`);
}

if (require.main === module) {
  docLoader(`
---
category: category
order: 0
title: title
---

\`\`\`omt-doc-jsx
import React from 'react';
import ReactDOM from 'react-dom';
class Demo extends React.Component {
  render() {
    return <div>Demo</div>
  }
}
ReactDOM.render(<Demo></Demo>, amount)
\`\`\`


\`\`\`omt-doc-jsx
import React from 'react';
import ReactDOM from 'react-dom';
class Demo extends React.Component {
  render() {
    return <div>Demo</div>
  }
}
ReactDOM.render(<Demo></Demo>, amount)
\`\`\`

### API

### HtmlProps
|name | des| type |
|----|----|---|
| body | html body | string |`);
}
