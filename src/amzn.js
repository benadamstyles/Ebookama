import "babel/polyfill";

import _ from 'underscore';
import c from 'chalk';
import fs from 'fs';
import mkd from 'mkdirp';
import unzip from 'unzip';
// import resumer from 'resumer';
import zip from 'epub-zip';
import cson from 'cson-parser';
// import Papa from 'babyparse';
import glob from 'glob';
import exec from 'execsyncs';

const log = console.log,
  logE = _.compose(log, c.bgRed.inverse),
  logS = _.compose(log, c.green),
  logI = _.compose(log, c.yellow),

  nodeArgs = process.argv.slice(2),

  metadata = cson.parse(fs.readFileSync('config.cson', 'utf8')),

  srcFilePath = nodeArgs.length ?
    nodeArgs[0] : glob.sync('*.epub').find(name => name.substr(0, 4) !== 'old-'),
  srcFileName = nodeArgs.length ?
    srcFilePath.substr(srcFilePath.lastIndexOf('/') + 1) : srcFilePath,

  insertAfter = (doc, locator, str) => {
    const i = doc.indexOf(locator) + locator.length;
    return doc.substr(0, i) + str + doc.substr(i, doc.length);
  },
  insertBefore = (doc, locator, str) => {
    const i = doc.indexOf(locator);
    return doc.substr(0, i) + str + doc.substr(i, doc.length);
  },

  edit = doc => {
    const fileNameNoExt = srcFileName.replace('.epub', ''),
      data = metadata.amzn[fileNameNoExt],
      guide = `
\t<guide>
\t\t<reference href="Text/${data.toc_file}#${data.toc_id}" title="Table of Contents" type="toc" />
\t\t<reference href="Images/cover.jpg" type="cover" />
\t\t<reference href="Text/${data.start_reading_file}#${data.start_reading_id || 'full-title'} title="Start Reading" type="text" />
\t</guide>`;

    if (doc.includes('<guide />')) return doc.replace('<guide />', guide);
    else return insertAfter(doc, '</spine>', guide);
  };

fs.createReadStream(srcFilePath)
  .pipe(unzip.Parse())
  .on('entry', entry => {
    const filePath = entry.path,
      fileEnding = filePath.substring(filePath.lastIndexOf('.') + 1),
      folderSep = filePath.includes('/') ? '/' : '\\',
      fileDir = filePath
        .substr(0, filePath.length - fileEnding.length)
        .substring(0, filePath.lastIndexOf(folderSep) + 1),

      run = entry =>
        new Promise((resolve, reject) => {
          let content = '';
          entry.setEncoding('utf8');

          entry
          .on('data', data => {content += data;})
          .on('end', () => {
            resolve(fileEnding === 'opf' ?
              edit(content) :
              content
            );
          });
        });

    if (fileEnding === "png" || fileEnding === "jpg" || fileEnding === "jpeg") {
      mkd('amzn/' + fileDir, err => {
        if (!err) {
          entry
          .pipe(fs.createWriteStream(`amzn/${filePath}`))
          .on('close', () => logS(`Processed ${filePath}`))
          .on('error', logE);
        } else logE(err);
      });
    } else {
      run(entry).then(res => {
        mkd('amzn/' + fileDir, err => {
          if (!err) {
            const w = fs.createWriteStream('amzn/' + filePath);
            w.on('open', () => {
              w.write(res);
              logS(`Processed ${filePath}`);
            })
            .on('error', logE);
          } else logE(err);
        });
      }).catch(logE);
    }
  });

process.on('exit', () => {
  try {
    const epub = zip("./amzn"),
          newFileName = insertBefore(srcFileName, '.epub', '-amzn');

    fs.writeFileSync(newFileName, epub);

    log(exec(`./kindlegen ${newFileName}`));
    logS(`::: Completed in ${process.uptime()} seconds! :::`);
  } catch (e) {logE(e);}
});
