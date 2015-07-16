"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _index = require("../index");

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _api = require("../api");

var transformers = {

  html: {

    smallCaps: function smallCaps(doc) {
      return doc.replace(/(?:<span class=("|')small-caps(?:[\s]*|[\s]char-style-override-\d)\1>)([^<]+)(?:<\/span>)/g, function (match, g1, g2, offset, str) {
        return match.replace(g2, g2.toUpperCase());
      });
    }

  },

  css: {},

  opf: {

    title: function title(doc) {
      if (!_index.metadata) return doc;

      var newTitle = "<dc:title>" + _index.metadata.title + "" + (_index.metadata.subtitle ? ": " + _index.metadata.subtitle : "") + "</dc:title>";

      if (doc.includes("<dc:title />")) return doc.replace("<dc:title />", newTitle);else if (doc.includes("<dc:title></dc:title>")) return doc.replace("<dc:title></dc:title>", newTitle);else if (!doc.includes("<dc:title>")) return util.insertBefore(doc, "</metadata>", "\t" + newTitle + "\n\t");else return doc;
    },

    ISBN: function ISBN(doc) {
      if (!_index.metadata.ebookISBN) return doc;

      var newISBN = "<dc:identifier xmlns:opf=\"http://www.idpf.org/2007/opf\" opf:scheme=\"ISBN\">" + _index.metadata.ebookISBN + "</dc:identifier>";

      if (!doc.includes(newISBN)) return util.insertBefore(doc, "</metadata>", "\t" + newISBN + "\n\t");else return doc;
    },

    author: function author(doc) {
      if (!_index.metadata.author) return doc;

      var newAuthor = "<dc:creator xmlns:opf=\"http://www.idpf.org/2007/opf\" opf:file-as=\"" + util.swapNames(_index.metadata.author) + "\" opf:role=\"aut\">" + _index.metadata.author + "</dc:creator>";

      if (doc.includes("<dc:creator />")) return doc.replace("<dc:creator />", newAuthor);else if (doc.includes("<dc:creator></dc:creator>")) return doc.replace("<dc:creator></dc:creator>", newAuthor);else if (!doc.includes("<dc:creator>")) return util.insertBefore(doc, "</metadata>", "\t" + newAuthor + "\n\t");else return doc;
    },

    otherContribs: function otherContribs(doc) {
      var abbrevTypes = ["edt", "ill", "trl"],
          rawTypes = ["editor", "illustrator", "translator"];

      var res = doc;

      if (!_index.metadata) return doc;

      for (var i = 0, l = rawTypes.length; i < l; i++) {
        if (_index.metadata[rawTypes[i]]) {
          res = util.insertBefore(res, "</metadata>", "\t<dc:contributor xmlns:opf=\"http://www.idpf.org/2007/opf\" opf:file-as=\"" + util.swapNames(_index.metadata[rawTypes[i]]) + "\" opf:role=\"" + abbrevTypes[i] + "\">" + _index.metadata[rawTypes[i]] + "</dc:contributor>\n\t");
        }
      }
      return res;
    }
  }
};

exports["default"] = transformers;
module.exports = exports["default"];

//
