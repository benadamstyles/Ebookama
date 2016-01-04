// Pure functions, for use in `modules/transformers.js`

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.swapNames = swapNames;
exports.insertAfter = insertAfter;
exports.insertBefore = insertBefore;
exports.cssParse = cssParse;
exports.removeDeclarations = removeDeclarations;
exports.getLeftMargin = getLeftMargin;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _css = require('css');

var _css2 = _interopRequireDefault(_css);

var _lazyJs = require('lazy.js');

var _lazyJs2 = _interopRequireDefault(_lazyJs);

function swapNames(name) {
  var comma = name.indexOf(',');
  if (comma > -1) {
    var ln = name.substring(0, comma),
        fn = name.substring(comma + 1).trim();
    return '' + fn + ' ' + ln;
  } else {
    var sep = name.lastIndexOf(' '),
        fn = name.substring(0, sep),
        ln = name.substring(sep + 1).trim();
    return '' + ln + ', ' + fn;
  }
}

function insertAfter(doc, locator, str) {
  var i = doc.indexOf(locator) + locator.length;
  return doc.substr(0, i) + str + doc.substr(i, doc.length);
}

function insertBefore(doc, locator, str) {
  var i = doc.indexOf(locator);
  return doc.substr(0, i) + str + doc.substr(i, doc.length);
}

function cssParse(doc, transformer) {
  var ast = _css2['default'].parse(doc),
      transformed = transformer(ast);
  return _css2['default'].stringify(transformed);
}

function removeDeclarations(doc, predicate) {
  return cssParse(doc, function (ast) {
    var rules = (0, _lazyJs2['default'])(ast.stylesheet.rules);
    rules.each(function (rule) {
      var declarations = rule.declarations.filter(predicate);
      declarations.forEach(function (declaration) {
        var declarationIndex = rule.declarations.indexOf(declaration);
        if (declarationIndex >= 0) rule.declarations.splice(declarationIndex, 1);
      });
    });
    return ast;
  });
}

var marginValueMap = new Map([[1, 0], [2, 1], [3, 1], [4, 3]]);

function getLeftMargin(val) {
  var arr = val.split(' '),
      index = marginValueMap.get(arr.length);
  return arr[index];
}
