'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _api = require('../api');

var _lazy = require('lazy.js');

var _lazy2 = _interopRequireDefault(_lazy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  html: {
    preventHangingDashes: function preventHangingDashes(doc) {
      return doc.replace(/\s+–\s*</g, '&nbsp;–<');
    }
  },

  css: {
    removeBlack: function removeBlack(doc) {
      return util.removeDeclarations(doc, function (_ref) {
        var value = _ref.value;
        return value === '#000000' || value === '#000';
      });
    },

    removeRuby: function removeRuby(doc) {
      return util.removeDeclarations(doc, function (_ref2) {
        var property = _ref2.property;
        return property === '-epub-ruby-position';
      });
    },

    removeMinion: function removeMinion(doc) {
      return util.removeDeclarations(doc, function (_ref3) {
        var value = _ref3.value;
        return value.includes('Minion Pro');
      });
    },

    removePalatinoLinotype: function removePalatinoLinotype(doc) {
      return util.removeDeclarations(doc, function (_ref4) {
        var value = _ref4.value;
        return value.includes('Palatino Linotype');
      });
    },

    removePageRule: function removePageRule(doc) {
      return util.cssParse(doc, function (ast) {
        var rules = ast.stylesheet.rules,
            index = rules.findIndex(function (rule) {
          return rule.type === 'page';
        });
        if (index >= 0) rules.splice(index, 1);
        return ast;
      });
    },

    removeAutoHyphens: function removeAutoHyphens(doc) {
      return util.removeDeclarations(doc, function (_ref5) {
        var property = _ref5.property;
        return property.includes('-hyphens');
      });
    },

    mobiHanging: function mobiHanging(doc) {
      return util.cssParse(doc, function (ast) {
        function textIndentMatcher(_ref6) {
          var property = _ref6.property,
              value = _ref6.value;

          return property === 'text-indent' && Number.parseFloat(value) < 0;
        }

        function getFlushMatcher(indent) {
          return function (_ref7) {
            var property = _ref7.property,
                value = _ref7.value;

            return property === 'margin' && util.getLeftMargin(value) === indent.replace(/-/g, '') || property === 'margin-left' && value === indent.replace(/-/g, '');
          };
        }

        var rulesWithNegIndent = (0, _lazy2.default)(ast.stylesheet.rules).filter(function (rule) {
          return rule.declarations.some(textIndentMatcher);
        });

        var mediaQuery = {
          type: 'media',
          media: 'amzn-mobi',
          rules: []
        };

        rulesWithNegIndent.each(function (rule) {
          var flushMatcher = getFlushMatcher(rule.declarations.find(textIndentMatcher).value);

          if (rule.declarations.some(flushMatcher)) {
            mediaQuery.rules.push({
              type: 'rule',
              selectors: rule.selectors,
              declarations: [{
                type: 'declaration',
                property: 'margin-left',
                value: '0'
              }]
            });
          } else {
            mediaQuery.rules.push({
              type: 'rule',
              selectors: rule.selectors,
              declarations: [{
                type: 'declaration',
                property: 'text-indent',
                value: '0'
              }]
            });
          }
        });

        if (!rulesWithNegIndent.isEmpty()) ast.stylesheet.rules.push(mediaQuery);
        return ast;
      });
    },

    pxToEm: function pxToEm(doc) {
      return util.cssParse(doc, function (ast) {
        var map = new Map([['14px', '1.3em'], ['-14px', '-1.3em'], ['28px', '2.6em'], ['-28px', '-2.6em'], ['43px', '3.9em'], ['57px', '5.2em'], ['71px', '6.5em'], ['85px', '7.8em'], ['99px', '9.1em'], ['113px', '10.4em'], ['128px', '11.7em'], ['142px', '13em'], ['156px', '14.3em'], ['170px', '15.6em'], ['184px', '16.9em'], ['198px', '18.2em']]);
        var declarations = (0, _lazy2.default)(ast.stylesheet.rules).pluck('declarations').flatten();

        declarations.each(function (dec) {
          if (dec && dec.value) {
            var isShorthand = dec.value.includes(' ');
            if (isShorthand) {
              var arr = dec.value.split(' '),
                  transformed = arr.map(function (v) {
                return map.get(v) || v;
              }).join(' ');
              dec.value = transformed;
            } else {
              var emVal = map.get(dec.value);
              if (emVal) dec.value = emVal;
            }
          }
        });
        return ast;
      });
    },

    amznHideISBN: function amznHideISBN(doc) {
      return util.cssParse(doc, function (ast) {
        ast.stylesheet.rules.push({
          type: 'media',
          media: 'amzn-mobi, amzn-kf8',
          rules: [{
            type: 'rule',
            selectors: ['.isbn'],
            declarations: [{
              type: 'declaration',
              property: 'display',
              value: 'none'
            }]
          }]
        });
        return ast;
      });
    }
  },

  opf: {
    title: function title(doc) {
      if (!_index.metadata) return doc;

      var newTitle = `<dc:title>${_index.metadata.title}${_index.metadata.subtitle ? ': ' + _index.metadata.subtitle : ''}</dc:title>`;

      if (doc.includes('<dc:title />')) return doc.replace('<dc:title />', newTitle);else if (doc.includes('<dc:title></dc:title>')) return doc.replace('<dc:title></dc:title>', newTitle);else if (!doc.includes('<dc:title>')) return util.insertBefore(doc, '</metadata>', '\t' + newTitle + '\n\t');else return doc;
    },

    ISBN: function ISBN(doc) {
      if (!_index.metadata.ebookISBN) return doc;

      var newISBN = `<dc:identifier xmlns:opf="http://www.idpf.org/2007/opf" opf:scheme="ISBN">${_index.metadata.ebookISBN}</dc:identifier>`;

      if (!doc.includes(newISBN)) return util.insertBefore(doc, '</metadata>', '\t' + newISBN + '\n\t');else return doc;
    },

    author: function author(doc) {
      if (!_index.metadata.author) return doc;

      var newAuthor = `<dc:creator xmlns:opf="http://www.idpf.org/2007/opf" opf:file-as="${util.swapNames(_index.metadata.author)}" opf:role="aut">${_index.metadata.author}</dc:creator>`;

      if (doc.includes('<dc:creator />')) return doc.replace('<dc:creator />', newAuthor);else if (doc.includes('<dc:creator></dc:creator>')) return doc.replace('<dc:creator></dc:creator>', newAuthor);else if (!doc.includes('<dc:creator>')) return util.insertBefore(doc, '</metadata>', '\t' + newAuthor + '\n\t');else return doc;
    },

    otherContribs: function otherContribs(doc) {
      var abbrevTypes = ['edt', 'ill', 'trl'],
          rawTypes = ['editor', 'illustrator', 'translator'];

      var res = doc;

      if (!_index.metadata) return doc;

      for (var i = 0, l = rawTypes.length; i < l; i++) {
        if (_index.metadata[rawTypes[i]]) {
          res = util.insertBefore(res, '</metadata>', `\t<dc:contributor xmlns:opf="http://www.idpf.org/2007/opf" opf:file-as="${util.swapNames(_index.metadata[rawTypes[i]])}" opf:role="${abbrevTypes[i]}">${_index.metadata[rawTypes[i]]}</dc:contributor>\n\t`);
        }
      }
      return res;
    }
  }
};