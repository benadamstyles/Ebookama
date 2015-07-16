// Pure functions, for use in `modules/transformers.js`

const swapNames = function(name) {
  const comma = name.indexOf(',');
  if (comma > -1) {
    let ln = name.substring(0, comma),
        fn = name.substring(comma + 1).trim();
    return `${fn} ${ln}`;
  } else {
    let sep = name.lastIndexOf(' '),
        fn = name.substring(0, sep),
        ln = name.substring(sep + 1).trim();
    return `${ln}, ${fn}`;
  }
};

const insertAfter = function(doc, locator, str) {
  const i = doc.indexOf(locator) + locator.length;
  return doc.substr(0, i) + str + doc.substr(i, doc.length);
};

const insertBefore = function(doc, locator, str) {
  const i = doc.indexOf(locator);
  return doc.substr(0, i) + str + doc.substr(i, doc.length);
};

export {
  swapNames,
  insertAfter,
  insertBefore
};
