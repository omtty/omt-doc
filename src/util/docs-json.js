window.getOmtDocs = function(category) {
  const omtDosObject = (window["OMT_DOCS_JSON"] || {})[category] || {};
  const demoKeys = Object.keys(omtDosObject).filter(key => {
    return /\/demo\//.test(key);
  });
  const docKeys = Object.keys(omtDosObject).filter(key => {
    return !/\/demo\//.test(key);
  });
  const omtDocs = [];
  docKeys.forEach(docKey => {
    const prefix = docKey.replace(/\/[\w_-]+.md$/, "");
    const omtDoc = {
      ...omtDosObject[docKey],
      children: []
    };
    demoKeys.forEach(demoKey => {
      if (demoKey.startsWith(prefix)) {
        omtDoc.children.push(omtDosObject[demoKey]);
      }
    });
    omtDocs.push(omtDoc);
  });
  return omtDocs;
};
