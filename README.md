# Ebookama

A small, extensible program to take the pain away from repetitive ebook wrangling

## Installation

This program requires node.js and npm to be installed on your machine. Until we have time to put instructions here, head to [Google](http://lmgtfy.com/?q=install+node).

Once you've got node and npm installed, you need to get this repository on your computer. Ways to do that, in order of goodness:

- Fork this repo, then clone your fork to your machine (requires installation and understanding of Git)
- Clone this repo to your machine (requires installation and understanding of Git)
- Download the repo and unzip it. You won't be able to easily update the program when we inevitably fix all the bugs we never thought of.

Now that you have the program on your computer, you need to set it up. Don't worry, it's easy. Open the terminal or command line, navigate to this repo on your hard drive, and run the following command (the `$` just means "type this in the terminal and press enter"):

```sh
$ npm install
```

Before you can do anything useful with the program, you'll need to set up your config file. This involves simply copying `sample.config.cson` to a new file called `config.cson`.

If you want to run the `amzn.js` script (see below for reasons why you might (coming soon!)), you'll need to download **Kindlegen** from [here](http://www.amazon.com/gp/feature.html/?docId=1000765211) and put it in the root folder of this project. I'm not allowed to host and share it on GitHub.

That's it. You're done.

## Usage & Customization

To run Ebookama, type this in your terminal (without the `$`) and press enter:

```sh
$ node dist/index.js "path/to/ebook.epub"
```

### Customization

The fractured state of ebook production practices means that we all have our own way of doing things. This program is written with this fact firmly in mind. You can use Ebookama to do many things, if your JavaScript is up to it. The only places you need to write code are the following, everything else is taken care of for you:

1. `config.cson`
2. `src/modules/transformers.js`
3. `src/modules/util.js`

**Note:** After changing either **2** or **3**, you'll need to run the following in your terminal to compile it to `dist/`:

```sh
$ grunt
```

If you forget, your changes simply won't be reflected and your new method won’t work.

Let's go through the files one-by-one.

#### config.cson

TODO

#### src/modules/transformers.js

This is where you shine. Write any javascript you can think of here, within the following limitations:

- Not a limitation, almost the opposite: Ebookama is proudly ES6. All your code will be run through [Babel](http://babeljs.io/), so please feel free to use arrow functions, destructuring, `for of` loops, even generators... go wild.
- Methods are categorized by filetypes: currently, `css`, `html` (or `xhtml`), and `opf`. If your new method is under one of these properties in the `transformers` object, it will be run against all files of that type; and if it's not under one of these properties, it won't get called at all.
- Every method receives one argument – the file it’s getting run against, as a string. Every method must return one value – the file it’s getting run against, _now modified (or not!),_ as a string.

Here is an example of a transformer that changes every instance of the words “quite” and “good” in every `.html` and `.xhtml` file in your ebook:

```javascript
html: {
  // ... other transformers

  hyperbolic: doc => doc.replace('quite', 'amazingly').replace('good', 'incredible'),

  // ... other transformers
}
```

In old-fashioned JavaScript, that would be:

```javascript
html: {
  // ... other transformers

  hyperbolic: function(doc) {
    return doc.replace('quite', 'amazingly').replace('good', 'incredible');
  },

  // ... other transformers
}
```

There are some examples in `src/modules/transformers.js` already. If you don't want to use them, get rid.

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

#### src/modules/util.js

Utility functions, for your `transformers` to use. I highly recommend that these be [pure functions](http://adamjonrichardson.com/2014/01/11/pure-functions/) all.

An example of a utility function that you might use throughout your `transformers.js`:

```javascript
const insertBefore = function(doc, locator, str) {
  const i = doc.indexOf(locator);
  return doc.substr(0, i) + str + doc.substr(i, doc.length);
};
```

**Note:** remember to add the names of your new util functions to the export list at the bottom of `src/modules/util.js`.

## Where does the name come from?

- Ebook
- **Ebook** **a**uto**ma**tion
- Kama Sutra
