# Ebookama

A small, extensible program to take the pain away from repetitive ebook wrangling

## Installation

This program requires node.js and npm to be installed on your machine. Until we have time to put instructions here, head to [Google](http://lmgtfy.com/?q=install+node).

Once you've got node and npm installed, you need to get this repository on your computer. Ways to do that, in order of goodness:

- Fork this repo, then clone your fork to your machine (requires installation and understanding of Git)
- Clone this repo to your machine (requires installation and understanding of Git)
- Download the repo and unzip it. You won't be able to easily update the program when we inevitably fix all the bugs we never thought of.

Now that you have the program on your computer, you need to set it up. Don't worry, it's easy. Open the terminal or command line, navigate to this repo on your hard drive, and run the following command (the `$` just means "type this in the terminal and press enter"):

```
$ npm install
```

Before you can do anything useful with the program, you'll ned to set up your config file. This involves simply copying `sample.config.cson` to a new file called `config.cson`.

If you want to run the `amzn.js` script (see below for reasons why you might), you'll need to download **Kindlegen** from [here](http://www.amazon.com/gp/feature.html/?docId=1000765211) and put it in the root folder of this project. I'm not allowed to host and share it on GitHub.

That's it. You're done.

## Usage & Customization

The basic command is as follows:

```
$ node dist/index.js "path/to/ebook.epub"
```

### Customization

The fractured state of ebook production practices means that we all have our own way of doing things. This program is written with this fact firmly in mind. You can use Ebookama to do many things, if your JavaScript is up to it. The only places you need to write code are the following, everything else is take care of for you:

- `config.cson`
- `modules/transformers.js`
- `modules/util.js`

Let's go through them one-by-one.

#### config.cson

TODO

#### modules/transformers.js

This is where you shine. Write any javascript you can think of here, within the following limitations:

- Methods are categorized by filetypes: currently, `css`, `html` or `xhtml`, and `opf`. If your new method is under one of these properties in the `transformers` object, it will be run against all files of that type; and if it's not under one of these properties, it won't get called at all.
- Every method receives one argument – the file it's getting run against, as a string. Every method must return one argument - the file it's getting run against, _now modified (or not!),_ as a string.

There are some examples in there already. If you don't want to use them, get rid.

##### File API

Ebookama exposes a custom file API for your convenience. So far, it has 2 methods, as follows:

###### getFileList()

- To use it in your `transformers.js`, just call it like `getFileList()`.
- returns: an array of file entries, which follow the structure as outlined [here](https://github.com/cthackers/adm-zip/wiki/ZipEntry). So, for example, to get an array of full file paths, call `getFileList().map(fileEntry => fileEntry.entryName)`

###### getContentOf(fileNameSearch: String)

- To use it in your `transformers.js`, call it with a string representing some part of the filename you wish to read. So, for example, to get the content of all CSS files, call `getContentOf('.css')`. To get the content of `Chapter-1.html`, call `getContentOf('Chapter-1.html')`. Or `getContentOf('ter-1.h')` if you’re feeling lucky.
- returns: a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), that resolves with an array of strings that are the content of each file matched. So, for example, the following would log the entire text content of `main.css`:

```javascript
getContentOf('main.css').then(contentArray => console.log(contentArray[0]));

// or if you're being really ES6-y
getContentOf('main.css').then(([content]) => console.log(content));
```

#### modules/util.js

Utility functions, for your `transformers` to use. I highly recommend that these be [pure functions](http://adamjonrichardson.com/2014/01/11/pure-functions/) all.

## Where does the name come from?

- Ebook
- **Ebook** **a**uto**ma**tion
- Kama Sutra
