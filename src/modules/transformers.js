import {metadata, config} from "../index";
import * as util from "./util";
import {getFileList, getContentOf} from '../api';

const transformers = {

  html: {

    smallCaps: doc => doc.replace(/(?:<span class=("|')small-caps(?:[\s]*|[\s]char-style-override-\d)\1>)([^<]+)(?:<\/span>)/g,
      (match, g1, g2, offset, str) => match.replace(g2, g2.toUpperCase())
    )

  },

  css: {
    //
  },

  opf: {

    title: doc => {
      if (!metadata) return doc;

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
};

export default transformers;
