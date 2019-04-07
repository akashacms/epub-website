
const akasha    = require('akasharender');
const cheerio   = require('cheerio');
const util      = require('util');
const fs        = require('fs-extra');
const path      = require('path');
const relative  = require('relative');

module.exports = new akasha.mahabhuta.MahafuncArray("epub-website", {});

/**
 * Generate a page header suitable as a Masthead for a book.  Each document page
 * that's part of the eBook must have a bookHomeURL entry in its metadata.  That
 * value gives the relative path for the table of contents of the eBook, that is
 * the file containing the <nav> that is the main navigation for the book.
 *
 * THAT file is to then contain metadata describing the book.
 */
class EBookPageHeader extends akasha.mahabhuta.CustomElement {
    get elementName() { return "ebook-page-header"; }
    async process($element, metadata, dirty) {
        var bookHomeURL = metadata.bookHomeURL;
        if (!bookHomeURL) {
            throw new Error("No bookHomeURL in metadata");
        }
        var template = $element.attr('template');
        if (!template) template = "ebook-header.html.ejs";
        var divclass = $element.attr('class');
        var divid    = $element.attr('id');
        var headerHeight = $element.attr('header-height');
        var logoWidth  = $element.attr('logo-width');
        var logoHeight = $element.attr('logo-height');
        // console.log(`EBookPageHeader ebook-page header readDocument bookHomeURL ${bookHomeURL}`);
        let document = await akasha.readDocument(metadata.config, bookHomeURL);
        // console.log(`EBookPageHeader ebook-page header found document for bookHomeURL ${bookHomeURL} `, document);
        if (typeof logoWidth === 'undefined' || logoWidth === '')   logoWidth  = document.metadata.logoWidth;
        if (typeof logoHeight === 'undefined' || logoHeight === '') logoHeight = document.metadata.logoHeight;
        if (typeof headerHeight === 'undefined' || headerHeight === '') headerHeight = document.metadata.headerHeight;
        // console.log(`ebook-page-header ${logoWidth} ${logoHeight} ${bookHomeURL} ${util.inspect(document.metadata)}`);
        return akasha.partial(metadata.config, template, {
            divclass,
            divid,
            siteLogoImage: metadata.siteLogoImage,
            siteLogoWidth: metadata.siteLogoWidth,
            logoImage: document.metadata.logoImage,
            bookHomeURL,
            logoWidth, logoHeight,
            bookTitle: document.metadata.bookTitle,
            bookSubTitle: document.metadata.bookSubTitle,
            bookAuthor: document.metadata.bookAuthor,
            headerHeight
        });
	}
}
module.exports.addMahafunc(new EBookPageHeader());

class EBookNavigationHeader extends akasha.mahabhuta.CustomElement {
    get elementName() { return "ebook-navigation-header"; }
    async process($element, metadata, dirty) {

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
        var foundDir;
        var found = await akasha.findRendersTo(metadata.config, metadata.bookHomeURL);
        // console.log(`ebook-navigation-header ${metadata.bookHomeURL} findRendersTo ==> ${util.inspect(found)}`);

        if (!found) {
            throw new Error("Did not find document for bookHomeURL="+ metadata.bookHomeURL);
        }

        if (typeof found.foundDir === 'string') {
            foundDir = found.foundDir;
        } else if (found.foundDir && found.foundDir.src) {
            foundDir = found.foundDir.src;
        } else {
            throw new Error("Strange foundDir for bookHomeURL="+ bookHomeURL +' '+ util.inspect(found));
        }

        // console.log(`ebook-navigation-header reading file ${path.join(foundDir, found.foundPathWithinDir)} ... ${foundDir} ... ${found.foundPathWithinDir}`);

        let contents = await fs.readFile(path.join(foundDir, found.foundPathWithinDir), 'utf8');
        let document = await akasha.readDocument(metadata.config, bookHomeURL);
        // console.log(`ebook-navigation-header found document for ${bookHomeURL} - ${util.inspect(document)}`);
        // console.log(`ebook-navigation-header ${booktoc} ${contents}`);

        var $toc = cheerio.load(contents);

        // Add .dropdown-menu so we can use Bootstrap dropdowns
        $toc('nav > ol').addClass('dropdown-menu');
        $toc('nav > ol').attr('aria-labelledby', 'dropdownMenuButton');
        $toc('nav > ol > li').addClass('dropdown-item');

        $toc('nav > ol li a').attr('type', 'button');
        $toc('nav > ol li a').addClass('btn');
        $toc('nav > ol li a').addClass('btn-link');

        // In this segment we fix the TableOfContents navigation elements
        // to have relative href's correctly referencing the file.  That is,
        // in the TOC as it appears in toc.html, the href's must be relative
        // from toc.html.  That's fine if the content files are all in the
        // same directory as toc.html.  But it's necessary to support content
        // in subdirectories.  Those files must have a relative path to the
        // other files in their TOC elements.
        //
        // For a book stored in /ev-charging
        //
        // In toc.html you'll have relative paths like this:
        //       range-confidence/chap2-range-confidence.html
        //
        // That path is to be interpreted within the eBook.  Hence the TOC
        // which appears in range-confidence/chap1/1-introduction.html must
        // have relative paths to the other files, for example:
        //       ../../range-confidence/chap2-range-confidence.html
        //
        // That's what the following computes.

        // Determine the path prefix of the toc.html
        var bookHomePath = path.dirname(bookHomeURL.substring(1));
        if (bookHomePath === '.') bookHomePath = '';
        // Then trim that off from the file being considered, giving us
        // the path of that file within the eBook directory.  That makes
        // the path comparable to the paths in toc.html.
        var docPathInEbook =
            bookHomePath.length > 0
            ? metadata.document.relrender.substring(bookHomePath.length + 1)
            : metadata.document.relrender;

        $toc('nav ol li a').each((i, elem) => {
            let tochref = $toc(elem).attr('href');
            // compute the relative path
            // Using absolutized paths computes the correct relative path
            let relativeHref = relative('/'+ metadata.document.renderTo, '/'+ path.join(bookHomePath, tochref)); // relative(docPathInEbook, tochref);
            // console.log(`EBookNavigationHeader relative ${util.inspect(metadata.document)} ${metadata.document.relrender} ${path.join(bookHomePath, tochref)} ==> ${relativeHref}`);
            $toc(elem).attr('href', relativeHref);
            // console.log(`ebook-table-of-contents bookHomeURL ${bookHomeURL} relpath ${metadata.document.relpath} relrender ${metadata.document.relrender} tochref ${tochref} bookHomePath ${bookHomePath} bookHomeTocHref ${path.join(bookHomePath, tochref)} docPathInEbook ${docPathInEbook} relativeHref ${relativeHref}`);
        });

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

        // console.log(`EBookNavigationHeader for ${metadata.document.path} tochtml ${$toc.html('nav > ol')}`);

        return akasha.partial(metadata.config, template, {
            divclass,
            divid,
            tochtml: $toc.html('nav > ol'),
            tocLabel,
            sectionTitle: metadata.sectionTitle,
            title: metadata.title,
            prevhref: readingOrder[PREVindex] ? readingOrder[PREVindex].href : "",
            prevtitle: readingOrder[PREVindex] ? readingOrder[PREVindex].title : "",
            nexthref: readingOrder[NEXTindex] ? readingOrder[NEXTindex].href : "",
            nexttitle: readingOrder[NEXTindex] ? readingOrder[NEXTindex].title : "",
            logoImage: typeof document.metadata !== 'undefined' ? document.metadata.logoImage : undefined,
            noLogoImage: typeof document.metadata === 'undefined' || typeof document.metadata.logoImage === 'undefined' || !document.metadata.logoImage
                            ? "true" : "false",
            bookHomeURL,
            logoWidth: document.metadata.logoWidth,
            bookTitle: document.metadata.bookTitle,
            bookSubTitle: document.metadata.bookSubTitle,
            bookAuthor: document.metadata.bookAuthor
        });
    }
}
module.exports.addMahafunc(new EBookNavigationHeader());

class EBookNameplateBlock extends akasha.mahabhuta.CustomElement {
    get elementName() { return "ebook-nameplate-block"; }
    async process($element, metadata, dirty) {
        var bookHomeURL = metadata.bookHomeURL;
        if (!bookHomeURL) {
           throw new Error("No bookHomeURL in metadata");
        }
        var template = $element.attr('template');
        var divclass = $element.attr('class');
        var divid    = $element.attr('id');
        if (!template) template = "ebook-nameplate-block.html.ejs";
        let document = await akasha.readDocument(metadata.config, bookHomeURL);
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
    }
}
module.exports.addMahafunc(new EBookNameplateBlock());
