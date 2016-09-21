
'use strict';

const akasha    = require('akasharender');
const mahabhuta = require('mahabhuta');
const cheerio   = require('cheerio');
const util      = require('util');

const log   = require('debug')('epub-website:mahabhuta');
const error = require('debug')('epub-website:mahabhuta');

module.exports = new mahabhuta.MahafuncArray("epub-website", {});

/**
 * Generate a page header suitable as a Masthead for a book.  Each document page
 * that's part of the eBook must have a bookHomeURL entry in its metadata.  That
 * value gives the relative path for the table of contents of the eBook, that is
 * the file containing the <nav> that is the main navigation for the book.
 *
 * THAT file is to then contain metadata describing the book.
 */
class EBookPageHeader extends mahabhuta.CustomElement {
	get elementName() { return "ebook-page-header"; }
	process($element, metadata, dirty) {
        var bookHomeURL = metadata.bookHomeURL;
        if (!bookHomeURL) {
            return Promise.reject("No bookHomeURL in metadata");
        }
        var template = $element.attr('template');
        if (!template) template = "ebook-header.html.ejs";
        var divclass = $element.attr('class');
        var divid    = $element.attr('id');
        var headerHeight = $element.attr('header-height');
        var logoWidth  = $element.attr('logo-width');
        var logoHeight = $element.attr('logo-height');
        return akasha.readDocument(metadata.config, bookHomeURL)
        .then(document => {
            if (typeof logoWidth === 'undefined' || logoWidth === '')   logoWidth  = document.metadata.logoWidth;
            if (typeof logoHeight === 'undefined' || logoHeight === '') logoHeight = document.metadata.logoHeight;
            // console.log(`ebook-page-header ${logoWidth} ${logoHeight} ${bookHomeURL} ${util.inspect(document.metadata)}`);
            return akasha.partial(metadata.config, template, {
                divclass,
                divid,
                logoImage: document.metadata.logoImage,
                bookHomeURL,
                logoWidth, logoHeight,
                bookTitle: document.metadata.bookTitle,
                bookSubTitle: document.metadata.bookSubTitle,
                bookAuthor: document.metadata.bookAuthor,
                headerHeight
            });
        });
	}
}
module.exports.addMahafunc(new EBookPageHeader());

class EBookNavigationHeader extends mahabhuta.CustomElement {
   get elementName() { return "ebook-navigation-header"; }
   process($element, metadata, dirty) {

        var bookHomeURL = metadata.bookHomeURL;
        if (!bookHomeURL) {
            return Promise.reject("No bookHomeURL in metadata");
        }
        var template = $element.attr('template');
        if (!template) template = "ebook-navigation-header.html.ejs";
        var divclass = $element.attr('class');
        var divid    = $element.attr('id');
        var tocLabel = $element.attr('toc-label');
        if (!tocLabel) tocLabel = "Table of Contents";
        var found;
        var foundDir;
        var contents;
        return akasha.findRendersTo(metadata.config.documentDirs, metadata.bookHomeURL)
        .then(_found => {

            // console.log(`ebook-table-of-contents ${booktoc} findRendersTo ==> ${util.inspect(_found)}`);

            if (!_found) {
                throw new Error("Did not find document for bookHomeURL="+ metadata.bookHomeURL);
            }
            found = _found;

            if (typeof found.foundDir === 'string') {
                foundDir = found.foundDir;
            } else if (found.foundDir && found.foundDir.src) {
                foundDir = found.foundDir.src;
            } else {
                throw new Error("Strange foundDir for bookHomeURL="+ bookHomeURL +' '+ util.inspect(found));
            }

            return akasha.readFile(foundDir, found.foundPathWithinDir);
        })
        .then(_contents => {
            contents = _contents;
            return akasha.readDocument(metadata.config, bookHomeURL);
        })
        .then(document => {
            // console.log(`ebook-table-of-contents ${booktoc} ${contents}`);

            var $toc = cheerio.load(contents);
            $toc('nav ol').addClass('dropdown-menu');

            var readingOrder = [];

            $toc('nav ol li a').each((i, elem) => {
                // This gives a list of entries and appears to traverse a nested
                // structure in the reading order of that TOC
                readingOrder.push({
                    href: $toc(elem).attr('href'),
                    title: $toc(elem).text()
                });
                // console.log('TOC LINK '+ $(elem).attr('href'));
            });
            // console.log(util.inspect(readingOrder));

            var foundInTOC = false;
            var TOCindex;
            for (let i = 0; !foundInTOC && i < readingOrder.length; i++) {
                // console.log(i +': '+ readingOrder[i].href +' === '+ metadata.document.renderTo);
                if (metadata.document.renderTo.endsWith(readingOrder[i].href)) {
                    foundInTOC = true;
                    TOCindex = i;
                }
            }
            var PREVindex = TOCindex - 1;
            if (PREVindex < 0) PREVindex = readingOrder.length - 1;
            var NEXTindex = TOCindex + 1;
            if (NEXTindex >= readingOrder.length) NEXTindex = 0;

            /* if (!foundInTOC) console.log("Did not find "+ metadata.document.renderTo +" in TOC");
            console.log("TOC "+ TOCindex +' '+ util.inspect(readingOrder[TOCindex]));

            console.log('PREV '+ PREVindex +' '+ util.inspect(readingOrder[PREVindex]));

            console.log('NEXT '+ NEXTindex +' '+ util.inspect(readingOrder[NEXTindex])); */

            // Here, look for current in that list.
            // Determine PREV and NEXT
            // Add those to the object passed below

            return akasha.partial(metadata.config, template, {
                divclass,
                divid,
                tochtml: $toc.html('nav ol'),
                tocLabel,
                sectionTitle: metadata.sectionTitle,
                title: metadata.title,
                prevhref: readingOrder[PREVindex].href,
                prevtitle: readingOrder[PREVindex].title,
                nexthref: readingOrder[NEXTindex].href,
                nexttitle: readingOrder[NEXTindex].title,
                logoImage: document.metadata.logoImage,
                bookHomeURL,
                logoWidth: document.metadata.logoWidth,
                bookTitle: document.metadata.bookTitle,
                bookSubTitle: document.metadata.bookSubTitle,
                bookAuthor: document.metadata.bookAuthor
            });
        });

    }
}
module.exports.addMahafunc(new EBookNavigationHeader());

class EBookNameplateBlock extends mahabhuta.CustomElement {
   get elementName() { return "ebook-nameplate-block"; }
   process($element, metadata, dirty) {
       var bookHomeURL = metadata.bookHomeURL;
       if (!bookHomeURL) {
           return Promise.reject("No bookHomeURL in metadata");
       }
       var template = $element.attr('template');
       var divclass = $element.attr('class');
       var divid    = $element.attr('id');
       if (!template) template = "ebook-nameplate-block.html.ejs";
       return akasha.readDocument(metadata.config, bookHomeURL)
       .then(document => {
           return akasha.partial(metadata.config, template, {
               divclass,
               divid,
               bookTitle: document.metadata.bookTitle,
               bookSubTitle: document.metadata.bookSubTitle,
               bookAuthor: document.metadata.bookAuthor,
               authors: document.metadata.authors ? document.metadata.authors : document.metadata.bookAuthor,
               published: document.metadata.published,
               language: document.metadata.language,
               source: document.metadata.source
           });
       });
   }
}
module.exports.addMahafunc(new EBookNameplateBlock());
