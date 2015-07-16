import fs from 'fs';
import unzip from 'unzip';
import glob from 'glob';
import admZip from 'adm-zip';

import {srcFilePath} from "./index";

// internal functions -->
const unzipStream = (callback, end) =>
  fs.createReadStream(srcFilePath)
  .pipe(unzip.Parse())
  .on('entry', callback)
  .on('close', end);

// exported methods -->
const getFileList = () => (new admZip(srcFilePath)).getEntries();

const getContentOf = fileNameMatch => new Promise((resolve, reject) => {
  const res = [];

  unzipStream(entry => {
    if (entry.path.includes(fileNameMatch)) {
      let content = '';
      entry.setEncoding('utf8');

      entry
      .on('data', data => {content += data;})
      .on('end', () => res.push(content));
    } else {
      entry.autodrain();
    }
  }, function finished() {
    if (res.length) resolve(res);
    else reject('No matches');
  });
});

export {getFileList, getContentOf};
