const transformers = {
  html: {
    // smallCaps: function(doc) {
    //   return doc.replace(/(?:<span class=("|')small-caps(?:[\s]*|[\s]char-style-override-\d)\1>)([^<]+)(?:<\/span>)/g,
    //   function(match, g1, g2, offset, str) {
    //     return match.replace(g2, g2.toUpperCase());
    //   });
    // },
    // regexes: function(doc) {
    //   var res = doc;
    //   if (metadata.regexes && metadata.regexes.xhtml &&
    //     metadata.regexes.xhtml.length) {
    //     for (var i = 0; i < metadata.regexes.xhtml.length; i++) {
    //       var reg = metadata.regexes.xhtml[i],
    //         regFind = new RegExp(reg.find, 'g');
    //         log(regFind);
    //
    //         res = res.replace(regFind, reg.replace);
    //     }
    //   }
    //   return res;
    // }
  },
  css: {
    // indents: function(doc) {
    //   return doc
    //     .replace(/14px/g, '1.3em')
    //     .replace(/28px/g, '2.6em')
    //     .replace(/43px/g,	'3.9em')
    //     .replace(/57px/g,	'5.2em')
    //     .replace(/71px/g,	'6.5em')
    //     .replace(/85px/g,	'7.8em')
    //     .replace(/99px/g,	'9.1em')
    //     .replace(/113px/g, '10.4em')
    //     .replace(/128px/g, '11.7em')
    //     .replace(/142px/g, '13em')
    //     .replace(/156px/g, '14.3em')
    //     .replace(/170px/g, '15.6em')
    //     .replace(/184px/g, '16.9em')
    //     .replace(/198px/g, '18.2em');
    //
    // },
    // amznISBN: function(doc) {
    //   return doc +
    //     '@media amzn-mobi, amzn-kf8 {\n' +
    //     '\t.isbn {display: none;}\n' +
    //     '}';
    // },
    // regexes: function(doc) {
    //   var res = doc;
    //   if (metadata.regexes && metadata.regexes.css &&
    //     metadata.regexes.css.length) {
    //     for (var i = 0; i < metadata.regexes.css.length; i++) {
    //       var reg = metadata.regexes.css[i],
    //         regFind = new RegExp(reg.find, 'g');
    //         log(regFind);
    //
    //         res = res.replace(regFind, reg.replace);
    //     }
    //   }
    //   return res;
    // }
  },
  opf: {
    // title: function(doc) {
    //   var newTitle = "<dc:title>" + metadata.Title +
    //     (metadata.Subtitle ? (': ' + metadata.Subtitle) : '') +
    //     "</dc:title>";
    //
    //   if (!csv) return doc;
    //
    //   if (doc.includes('<dc:title />')) {
    //     return doc.replace('<dc:title />', newTitle);
    //   } else if (doc.includes("<dc:title></dc:title>")) {
    //     return doc.replace("<dc:title></dc:title>", newTitle);
    //   } else if (!doc.includes('<dc:title>')) {
    //     return insertBefore(doc, '</metadata>', '\t' + newTitle + '\n\t');
    //   } else {
    //     return doc;
    //   }
    // },
    // ISBN: function(doc) {
    //   var newISBN = '<dc:identifier xmlns:opf="http://www.idpf.org/2007/opf" opf:scheme="ISBN">' +
    //     metadata['eBook ISBN'] +
    //     '</dc:identifier>';
    //
    //   if (!metadata['eBook ISBN']) return doc;
    //   if (!doc.includes(newISBN)) return insertBefore(doc, '</metadata>', '\t' + newISBN + '\n\t');
    //   else return doc;
    // },
    // author: function(doc) {
    //   var newAuthor;
    //   if (!csv) return doc;
    //
    //   newAuthor = '<dc:creator xmlns:opf="http://www.idpf.org/2007/opf" opf:file-as="' +
    //   swapNames(metadata['Author (First, Last)']) +
    //   '" opf:role="aut">' +
    //   metadata['Author (First, Last)'] + '</dc:creator>';
    //
    //   if (doc.includes('<dc:creator />')) {
    //     return doc.replace('<dc:creator />', newAuthor);
    //   } else if (doc.includes("<dc:creator></dc:creator>")) {
    //     return doc.replace("<dc:creator></dc:creator>", newAuthor);
    //   } else if (!doc.includes('<dc:creator>')) {
    //     return insertBefore(doc, '</metadata>', '\t' + newAuthor + '\n\t');
    //   } else {
    //     return doc;
    //   }
    // },
    // otherContribs: function(doc) {
    //   var abbrevTypes = ['edt', 'ill', 'trl'],
    //     rawTypes = ['Editor', 'Illustrator', 'Translator'],
    //     verboseTypes = rawTypes.map(function(str) {
    //       return str + ' (First, Last)';
    //     }),
    //     res = doc;
    //
    //   if (!csv) return doc;
    //
    //   for (var i = 0; i < verboseTypes.length; i++) {
    //     if (metadata[verboseTypes[i]]) {
    //       res = insertBefore(res, '</metadata>',
    //         '\t<dc:contributor xmlns:opf="http://www.idpf.org/2007/opf" opf:file-as="' +
    //         swapNames(metadata[verboseTypes[i]]) + '" opf:role="' +
    //         abbrevTypes[i] + '">' +
    //         metadata[verboseTypes[i]] +
    //         '</dc:contributor>' + '\n\t'
    //       );
    //     }
    //   }
    //   return res;
    // },
    // regexes: function(doc) {
    //   if (metadata.regexes && metadata.regexes.opf &&
    //     metadata.regexes.opf.length) {
    //     // TODO
    //     return doc;
    //   } else {
    //     return doc;
    //   }
    // }
  }
};

export default transformers;
