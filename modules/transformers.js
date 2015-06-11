const transformers = {

  html: {

    smallCaps: doc => doc.replace(/(?:<span class=("|')small-caps(?:[\s]*|[\s]char-style-override-\d)\1>)([^<]+)(?:<\/span>)/g,
      (match, g1, g2, offset, str) => match.replace(g2, g2.toUpperCase())
    )

  },

  css: {

    indents: doc => doc
      .replace(/\D14px/g, '1.3em')
      .replace(/\D28px/g, '2.6em')
      .replace(/\D43px/g,	'3.9em')
      .replace(/\D57px/g,	'5.2em')
      .replace(/\D71px/g,	'6.5em')
      .replace(/\D85px/g,	'7.8em')
      .replace(/\D99px/g,	'9.1em')
      .replace(/\D113px/g, '10.4em')
      .replace(/\D128px/g, '11.7em')
      .replace(/\D142px/g, '13em')
      .replace(/\D156px/g, '14.3em')
      .replace(/\D170px/g, '15.6em')
      .replace(/\D184px/g, '16.9em')
      .replace(/\D198px/g, '18.2em'),

    amznISBN: doc =>
`${doc}
@media amzn-mobi, amzn-kf8 {
  .isbn {display: none;}
}`

  },

  opf: {

    title: doc => {
      var newTitle = "<dc:title>" + metadata.Title +
        (metadata.Subtitle ? (': ' + metadata.Subtitle) : '') +
        "</dc:title>";

      if (!csv) return doc;

      if (doc.includes('<dc:title />')) return doc.replace('<dc:title />', newTitle);
      else if (doc.includes("<dc:title></dc:title>")) return doc.replace("<dc:title></dc:title>", newTitle);
      else if (!doc.includes('<dc:title>')) return insertBefore(doc, '</metadata>', '\t' + newTitle + '\n\t');
      else return doc;
    },

    ISBN: doc => {
      var newISBN = '<dc:identifier xmlns:opf="http://www.idpf.org/2007/opf" opf:scheme="ISBN">' +
        metadata['eBook ISBN'] +
        '</dc:identifier>';

      if (!metadata['eBook ISBN']) return doc;
      if (!doc.includes(newISBN)) return insertBefore(doc, '</metadata>', '\t' + newISBN + '\n\t');
      else return doc;
    },

    author: doc => {
      var newAuthor;
      if (!csv) return doc;

      newAuthor = '<dc:creator xmlns:opf="http://www.idpf.org/2007/opf" opf:file-as="' +
      swapNames(metadata['Author (First, Last)']) +
      '" opf:role="aut">' +
      metadata['Author (First, Last)'] + '</dc:creator>';

      if (doc.includes('<dc:creator />')) return doc.replace('<dc:creator />', newAuthor);
      else if (doc.includes("<dc:creator></dc:creator>")) return doc.replace("<dc:creator></dc:creator>", newAuthor);
      else if (!doc.includes('<dc:creator>')) return insertBefore(doc, '</metadata>', '\t' + newAuthor + '\n\t');
      else return doc;
    },

    otherContribs: doc => {
      const abbrevTypes = ['edt', 'ill', 'trl'],
            rawTypes = ['Editor', 'Illustrator', 'Translator'],
            verboseTypes = rawTypes.map(function(str) {
              return str + ' (First, Last)';
            });

      var res = doc;

      if (!csv) return doc;

      for (let i = 0, l = verboseTypes.length; i < l; i++) {
        if (metadata[verboseTypes[i]]) {
          res = insertBefore(res, '</metadata>',
            '\t<dc:contributor xmlns:opf="http://www.idpf.org/2007/opf" opf:file-as="' +
            swapNames(metadata[verboseTypes[i]]) + '" opf:role="' +
            abbrevTypes[i] + '">' +
            metadata[verboseTypes[i]] +
            '</dc:contributor>' + '\n\t'
          );
        }
      }
      return res;
    }
  }
};

export default transformers;
