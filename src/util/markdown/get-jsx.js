import fs from 'fs-extra';
import path from 'path';

const JsxRegExp = /```jsx omt-doc-jsx([\s\S]*?)```/g;
const ReactDOMRenderExp = /ReactDOM\.render\(\s*(<[\s\S]+>)[\s\S]*\)[\s\S]*/;

// node string matchAll
String.prototype.matchAll = function(regexp) {
  var matches = [];
  this.replace(regexp, function() {
    var arr = [].slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
};

function parseSource(source) {
  return source.replace(ReactDOMRenderExp, 'export default class extends React.Component { render() { return $1; } }');
}

function getCreateComponent(filePath) {
  return `function() {
    const loadable = require("@loadable/component").default;
    return React.createElement(loadable(() => import("${filePath}")));
  }`

}


export default function createGetJsx(outputPath, relativePath) {
  return function getJsx(markdownContent, value, next) {
    const matches = [...((markdownContent || "").matchAll(JsxRegExp) || [])];
    const jsxs = [],
      jsxSources = [];
    if (matches) {
      matches.forEach((matchItem, index) => {
        if (matchItem.length == 2) {
          const filePath = path.resolve(outputPath, `${relativePath}.${index}.js`);
          fs.ensureFileSync(filePath);
          fs.writeFileSync(filePath, parseSource(matchItem[1]));
          jsxs.push(getCreateComponent(filePath));
          jsxSources.push(matchItem[1]);
        }
      });
    }
    next(null, markdownContent.replace(JsxRegExp, ""), {
      ...value,
      jsxs,
      jsxSources
    });
  }
}
