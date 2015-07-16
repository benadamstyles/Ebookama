import fs from 'fs';
import unzip from 'unzip';
import glob from 'glob';

// internal functions -->
const unzipStream = callback =>
  fs.createReadStream(srcFilePath)
  .pipe(unzip.Parse())
  .on('entry', callback);

// exported methods -->
const getFileList = () => {};

const getContentOf = globbing => unzipStream(entry => {
  // const filePath = entry.path,
  //       fileEnding = filePath.substring(filePath.lastIndexOf('.') + 1),
  //       folderSep = filePath.includes('/') ? '/' : '\\',
  //       fileDir = filePath.substr(0, filePath.length - fileEnding.length)
  //         .substring(0, filePath.lastIndexOf(folderSep) + 1),
  //       run = entry => new Promise((resolve, reject) => {
  //         var content = '';
  //         entry.setEncoding('utf8');
  //         entry.on('data', data => {content += data;})
  //         .on('end', () => {
  //           if (edit[fileEnding]) resolve(edit[fileEnding](content));
  //           else resolve(content);
  //         });
  //       });
  //
  // if (fileEnding === "png" || fileEnding === "jpg" || fileEnding === "jpeg") {
  //   mkd('out/' + fileDir, err => {
  //     if (!err) {
  //       entry.pipe(fs.createWriteStream('out/' + filePath))
  //       .on('close', () => { logI('Not processed: ' + filePath); })
  //       .on('error', logE);
  //     } else logE(err);
  //   });
  // } else {
  //   run(entry).then(res => {
  //     mkd('out/' + fileDir, err => {
  //       if (!err) {
  //         let w = fs.createWriteStream('out/' + filePath);
  //         w.on('open', () => {
  //           w.write(res);
  //           logS('Processed ' + filePath);
  //         })
  //         .on('error', logE);
  //       } else log(err);
  //     });
  //   }).catch(log);
  // }
});
