// node modules
import underscore from 'underscore';
import _ from 'underscore-contrib';
import c from 'chalk';
import fs from 'fs';
import mkd from 'mkdirp';
import unzip from 'unzip';
import Promise from 'bluebird';
import resumer from 'resumer';
import zip from 'epub-zip';
import cson from 'cson-parser';
import Papa from 'babyparse';
import rf from 'rimraf';
import glob from 'glob';

import "babel/register";

// my modules
import transformers from "./modules/transformers";

Object.assign(_, underscore);

const log = console.log,
      logE = _.compose(log, c.bgRed.inverse),
      logS = _.compose(log, c.green),
      nodeArgs = process.argv.slice(2);

Object.assign(transformers, {
  // regexes from regexes.json
});

// TODO 'use' (weak) and 'ignore' (strong) properties in config.json to choose which transformers to use (default all)

function setUpTransformers(keyStr) {
  return _.pipeline(_.values(transformers[keyStr]));
}

const edit = {
  'css': setUpTransformers(css),
  'opf': setUpTransformers(opf),
  'xhtml': setUpTransformers(html),
  'html': setUpTransformers(html)
};

fs.createReadStream(srcFilePath)
.pipe(unzip.Parse())
.on('entry', entry => {

  const filePath = entry.path,
        fileEnding = filePath.substring(filePath.lastIndexOf('.') + 1),
        folderSep = filePath.incldues('/') ? '/' : '\\',
        fileDir = filePath.substr(0, filePath.length - fileEnding.length)
          .substring(0, filePath.lastIndexOf(folderSep) + 1),
        run = entry => new Promise((resolve, reject) => {
          var content = '';
          entry.setEncoding('utf8');
          entry.on('data', data => {content += data;})
          .on('end', () => {
            if (edit[fileEnding]) resolve(edit[fileEnding](content));
            else resolve(content);
          });
        });

  if (fileEnding === "png" || fileEnding === "jpg" || fileEnding === "jpeg") {
    mkd('out/' + fileDir, err => {
      if (!err) {
        entry.pipe(fs.createWriteStream('out/' + filePath))
        .on('close', () => { log(c.yellow('Not processed: ' + filePath)); })
        .on('error', logE);
      } else logE(err);
    });
  } else {
    run(entry).then(res => {
      mkd('out/' + fileDir, err => {
        if (!err) {
          let w = fs.createWriteStream('out/' + filePath);
          w.on('open', () => {
            w.write(res);
            logS('Processed ' + filePath);
          })
          .on('error', logE);
        } else log(err);
      });
    }).catch(log);
  }
});

process.on('exit', () => {
  try {
    let epub = zip("./out");
    try { fs.renameSync(srcFileName, 'old-' + srcFileName); }
    catch(e) { logE(e); }
    fs.writeFileSync(srcFileName, epub);

    // if (nodeArgs[0] !== '-debug') {
    //   rf.sync("./out/META-INF", logE);
    //   rf.sync("./out/OEBPS", logE);
    //   rf.sync("./out", logE);
    // }

    logS('::: Completed in '+process.uptime()+' seconds! :::');
  } catch (e) { logE(e); }
});
