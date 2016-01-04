// Pure functions, for use in `modules/transformers.js`

import css from 'css'
import Lazy from 'lazy.js'

export function swapNames(name) {
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
}

export function insertAfter(doc, locator, str) {
  const i = doc.indexOf(locator) + locator.length
  return doc.substr(0, i) + str + doc.substr(i, doc.length)
}

export function insertBefore(doc, locator, str) {
  const i = doc.indexOf(locator)
  return doc.substr(0, i) + str + doc.substr(i, doc.length)
}

export function cssParse(doc, transformer) {
  const ast = css.parse(doc),
        transformed = transformer(ast);
  return css.stringify(transformed)
}

export function removeDeclaration(doc, predicate) {
  return cssParse(doc, ast => {
    const rules = Lazy(ast.stylesheet.rules)
    rules.each(rule => {
      const declarationIndex = rule.declarations.findIndex(predicate)
      if (declarationIndex >= 0) rule.declarations.splice(declarationIndex, 1)
    })
    return ast
  })
}

const marginValueMap = new Map([
  [1, 0],
  [2, 1],
  [3, 1],
  [4, 3]
])

export function getLeftMargin(val) {
  const arr = val.split(' '),
        index = marginValueMap.get(arr.length)
  return arr[index]
}
