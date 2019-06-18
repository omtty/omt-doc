const HeaderRegExp = /(---\n)([\s\S]*)(---\n)/;

/**
 * 获取marketdown文件头信息
 * @param {string} path markdown文件路径
 * @param {string} markdownContent  markdown文件内容
 */
export default function getHeader(markdownContent, value, next) {
  const components = HeaderRegExp.exec(markdownContent);
  if (components && components.length === 4) {
    const headerString = components[2];
    const headerStringLines = headerString.split("\n") || [];
    const header = {};
    for (let line of headerStringLines) {
      const lineComponents = line.split(":");
      if (lineComponents.length === 2) {
        const key = lineComponents[0].replace(/\s+/g, "");
        const value = lineComponents[1].replace(/^\s+/g, "");
        if(key) {
          Object.assign(header, {
            [key]: value
          });
        }
      }
    }
    return next(null, markdownContent.replace(HeaderRegExp, ""), {
      ...value,
      header
    });
  }

  next(
    new Error(`
  没有指定文件的头信息，头信息格式如下：
  ---
  category?: string
  order: number
  title: string
  ---`)
  );
}
