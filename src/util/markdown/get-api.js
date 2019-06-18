import marked from "marked";
const ApiRegExp = /## API\s+[\s\S]*/g;

export default function getApi(markdownContent, value, next) {
  const matches = [...((markdownContent || "").matchAll(ApiRegExp) || [])];
  const apis = [];
  if (matches) {
    matches.forEach(matchItem => {
      apis.push(matchItem[0]);
    });
  }
  next(null, markdownContent.replace(ApiRegExp, ""), {
    ...value,
    api: marked(apis[0] || "")
  });
}
