'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContentOf = exports.getFileList = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _unzip = require('unzip');

var _unzip2 = _interopRequireDefault(_unzip);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _admZip = require('adm-zip');

var _admZip2 = _interopRequireDefault(_admZip);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// internal functions -->
var unzipStream = function unzipStream(callback, end) {
  return _fs2.default.createReadStream(_index.srcFilePath).pipe(_unzip2.default.Parse()).on('entry', callback).on('close', end);
};

// exported methods -->
var getFileList = function getFileList() {
  return new _admZip2.default(_index.srcFilePath).getEntries();
};

var getContentOf = function getContentOf(fileNameMatch) {
  return new Promise(function (resolve, reject) {
    var res = [];

    unzipStream(function (entry) {
      if (entry.path.includes(fileNameMatch)) {
        var content = '';
        entry.setEncoding('utf8');

        entry.on('data', function (data) {
          content += data;
        }).on('end', function () {
          return res.push(content);
        });
      } else {
        entry.autodrain();
      }
    }, function finished() {
      if (res.length) resolve(res);else reject('No matches');
    });
  });
};

exports.getFileList = getFileList;
exports.getContentOf = getContentOf;