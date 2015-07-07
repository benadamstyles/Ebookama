// Pure functions, for use in `modules/transformers.js`

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var swapNames = function swapNames(name) {
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
};

var insertAfter = function insertAfter(doc, locator, str) {
  var i = doc.indexOf(locator) + locator.length;
  return doc.substr(0, i) + str + doc.substr(i, doc.length);
};

var insertBefore = function insertBefore(doc, locator, str) {
  var i = doc.indexOf(locator);
  return doc.substr(0, i) + str + doc.substr(i, doc.length);
};

exports.swapNames = swapNames;
exports.insertAfter = insertAfter;
exports.insertBefore = insertBefore;
