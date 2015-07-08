'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('babel/polyfill');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _unzip = require('unzip');

var _unzip2 = _interopRequireDefault(_unzip);

// import resumer from 'resumer';

var _epubZip = require('epub-zip');

var _epubZip2 = _interopRequireDefault(_epubZip);

var _csonParser = require('cson-parser');

var _csonParser2 = _interopRequireDefault(_csonParser);

// import Papa from 'babyparse';

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _execsyncs = require('execsyncs');

var _execsyncs2 = _interopRequireDefault(_execsyncs);

var log = console.log,
    logE = _underscore2['default'].compose(log, _chalk2['default'].bgRed.inverse),
    logS = _underscore2['default'].compose(log, _chalk2['default'].green),
    logI = _underscore2['default'].compose(log, _chalk2['default'].yellow),
    nodeArgs = process.argv.slice(2),
    metadata = _csonParser2['default'].parse(_fs2['default'].readFileSync('config.cson', 'utf8')),
    srcFilePath = nodeArgs.length ? nodeArgs[0] : _glob2['default'].sync('*.epub').find(function (name) {
  return name.substr(0, 4) !== 'old-';
}),
    srcFileName = nodeArgs.length ? srcFilePath.substr(srcFilePath.lastIndexOf('/') + 1) : srcFilePath,
    insertAfter = function insertAfter(doc, locator, str) {
  var i = doc.indexOf(locator) + locator.length;
  return doc.substr(0, i) + str + doc.substr(i, doc.length);
},
    insertBefore = function insertBefore(doc, locator, str) {
  var i = doc.indexOf(locator);
  return doc.substr(0, i) + str + doc.substr(i, doc.length);
},
    edit = function edit(doc) {
  var fileNameNoExt = srcFileName.replace('.epub', ''),
      data = metadata.amzn[fileNameNoExt],
      guide = '\n\t<guide>\n\t\t<reference href="Text/' + data.toc_file + '#' + data.toc_id + '" title="Table of Contents" type="toc" />\n\t\t<reference href="Images/cover.jpg" type="cover" />\n\t\t<reference href="Text/' + data.start_reading_file + '#' + (data.start_reading_id || 'full-title') + '" title="Start Reading" type="text" />\n\t</guide>';

  if (doc.includes('<guide />')) return doc.replace('<guide />', guide);else return insertAfter(doc, '</spine>', guide);
};

_fs2['default'].createReadStream(srcFilePath).pipe(_unzip2['default'].Parse()).on('entry', function (entry) {
  var filePath = entry.path,
      fileEnding = filePath.substring(filePath.lastIndexOf('.') + 1),
      folderSep = filePath.includes('/') ? '/' : '\\',
      fileDir = filePath.substr(0, filePath.length - fileEnding.length).substring(0, filePath.lastIndexOf(folderSep) + 1),
      run = function run(entry) {
    return new Promise(function (resolve, reject) {
      var content = '';
      entry.setEncoding('utf8');

      entry.on('data', function (data) {
        content += data;
      }).on('end', function () {
        resolve(fileEnding === 'opf' ? edit(content) : content);
      });
    });
  };

  if (fileEnding === 'png' || fileEnding === 'jpg' || fileEnding === 'jpeg') {
    (0, _mkdirp2['default'])('amzn/' + fileDir, function (err) {
      if (!err) {
        entry.pipe(_fs2['default'].createWriteStream('amzn/' + filePath)).on('close', function () {
          return logS('Processed ' + filePath);
        }).on('error', logE);
      } else logE(err);
    });
  } else {
    run(entry).then(function (res) {
      (0, _mkdirp2['default'])('amzn/' + fileDir, function (err) {
        if (!err) {
          (function () {
            var w = _fs2['default'].createWriteStream('amzn/' + filePath);
            w.on('open', function () {
              w.write(res);
              logS('Processed ' + filePath);
            }).on('error', logE);
          })();
        } else logE(err);
      });
    })['catch'](logE);
  }
});

process.on('exit', function () {
  try {
    var epub = (0, _epubZip2['default'])('./amzn'),
        newFileName = insertBefore(srcFileName, '.epub', '-amzn');

    _fs2['default'].writeFileSync(newFileName, epub);

    log((0, _execsyncs2['default'])('./kindlegen ' + newFileName));
    logS('::: Completed in ' + process.uptime() + ' seconds! :::');
  } catch (e) {
    logE(e);
  }
});
