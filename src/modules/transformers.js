import {metadata, config} from "../index"
import * as util from "./util"
import {getFileList, getContentOf} from '../api'
import Lazy from 'lazy.js'

export default {

  html: {

    smallCaps: doc => doc.replace(/(?:<span class=("|')small-caps(?:[\s]*|[\s]char-style-override-\d)\1>)([^<]+)(?:<\/span>)/g,
      (match, g1, g2, offset, str) => match.replace(g2, g2.toUpperCase())
    )

  },

  css: {
    removeBlack: doc => util.removeDeclarations(doc, ({value}) =>
      value === '#000000' || value === '#000'
    ),

    removeRuby: doc => util.removeDeclarations(doc, ({property}) =>
      property === '-epub-ruby-position'
    ),

    removeMinion: doc => util.removeDeclarations(doc, ({value}) =>
      value.includes('Minion Pro')
    ),

    removePageRule: doc => util.cssParse(doc, ast => {
      const rules = ast.stylesheet.rules,
            index = rules.findIndex(rule => rule.type === 'page')
      if (index >= 0) rules.splice(index, 1)
      return ast
    }),

    removeAutoHyphens: doc => util.removeDeclarations(doc, ({property}) =>
      property.includes('-hyphens')
    ),

    mobiHanging: doc => util.cssParse(doc, ast => {
      function textIndentMatcher({property, value}) {
        return property === 'text-indent' && Number.parseFloat(value) < 0
      }

      function getFlushMatcher(indent) {
        return function({property, value}) {
          return (property === 'margin' && util.getLeftMargin(value) === indent.replace(/-/g, '')) ||
            (property === 'margin-left' && value === indent.replace(/-/g, ''))
        }
      }

      const rulesWithNegIndent = Lazy(ast.stylesheet.rules)
        .filter(rule => rule.declarations.some(textIndentMatcher))

      const mediaQuery = {
        type: 'media',
        media: 'amzn-mobi',
        rules: []
      }

      rulesWithNegIndent.each(rule => {
        const flushMatcher = getFlushMatcher(rule.declarations.find(textIndentMatcher).value)

        if (rule.declarations.some(flushMatcher)) {
          mediaQuery.rules.push({
            type: 'rule',
            selectors: rule.selectors,
            declarations: [{
              type: 'declaration',
              property: 'margin-left',
              value: '0'
            }]
          })
        } else {
          mediaQuery.rules.push({
            type: 'rule',
            selectors: rule.selectors,
            declarations: [{
              type: 'declaration',
              property: 'text-indent',
              value: '0'
            }]
          })
        }
      })

      if (!rulesWithNegIndent.isEmpty()) ast.stylesheet.rules.push(mediaQuery)
      return ast
    }),

    pxToEm: doc => util.cssParse(doc, ast => {
      const map = new Map([
        ['14px',  '1.3em'],
        ['-14px', '-1.3em'],
        ['28px',  '2.6em'],
        ['-28px', '-2.6em'],
        ['43px',  '3.9em'],
        ['57px',  '5.2em'],
        ['71px',  '6.5em'],
        ['85px',  '7.8em'],
        ['99px',  '9.1em'],
        ['113px', '10.4em'],
        ['128px', '11.7em'],
        ['142px', '13em'],
        ['156px', '14.3em'],
        ['170px', '15.6em'],
        ['184px', '16.9em'],
        ['198px', '18.2em']
      ])
      const declarations = Lazy(ast.stylesheet.rules)
        .pluck('declarations')
        .flatten()

      declarations.each(dec => {
        if (dec && dec.value) {
          const isShorthand = dec.value.includes(' ')
          if (isShorthand) {
            const arr = dec.value.split(' '),
                  transformed = arr.map(v => map.get(v) || v).join(' ')
            dec.value = transformed
          } else {
            const emVal = map.get(dec.value)
            if (emVal) dec.value = emVal
          }
        }
      })
      return ast
    })
  },

  opf: {

    title: doc => {
      if (!metadata) return doc

      const newTitle = `<dc:title>${metadata.title}${(
        metadata.subtitle ?
          (': ' + metadata.subtitle) :
          ''
        )}</dc:title>`;

      if (doc.includes('<dc:title />')) return doc.replace('<dc:title />', newTitle);
      else if (doc.includes("<dc:title></dc:title>")) return doc.replace("<dc:title></dc:title>", newTitle);
      else if (!doc.includes('<dc:title>')) return util.insertBefore(doc, '</metadata>', '\t' + newTitle + '\n\t');
      else return doc;
    },

    ISBN: doc => {
      if (!metadata.ebookISBN) return doc;

      const newISBN = `<dc:identifier xmlns:opf="http://www.idpf.org/2007/opf" opf:scheme="ISBN">${
        metadata.ebookISBN
      }</dc:identifier>`;

      if (!doc.includes(newISBN)) return util.insertBefore(doc, '</metadata>', '\t' + newISBN + '\n\t');
      else return doc;
    },

    author: doc => {
      if (!metadata.author) return doc;

      const newAuthor = `<dc:creator xmlns:opf="http://www.idpf.org/2007/opf" opf:file-as="${
        util.swapNames(metadata.author)
      }" opf:role="aut">${
        metadata.author
      }</dc:creator>`;

      if (doc.includes('<dc:creator />')) return doc.replace('<dc:creator />', newAuthor);
      else if (doc.includes("<dc:creator></dc:creator>")) return doc.replace("<dc:creator></dc:creator>", newAuthor);
      else if (!doc.includes('<dc:creator>')) return util.insertBefore(doc, '</metadata>', '\t' + newAuthor + '\n\t');
      else return doc;
    },

    otherContribs: doc => {
      const abbrevTypes = ['edt', 'ill', 'trl'],
            rawTypes = ['editor', 'illustrator', 'translator'];

      var res = doc;

      if (!metadata) return doc;

      for (let i = 0, l = rawTypes.length; i < l; i++) {
        if (metadata[rawTypes[i]]) {
          res = util.insertBefore(res, '</metadata>',
            `\t<dc:contributor xmlns:opf="http://www.idpf.org/2007/opf" opf:file-as="${
              util.swapNames(metadata[rawTypes[i]])
            }" opf:role="${
              abbrevTypes[i]
            }">${
              metadata[rawTypes[i]]
            }</dc:contributor>\n\t`
          );
        }
      }
      return res;
    }
  }
}
