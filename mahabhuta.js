
const akasha    = require('akasharender');
const mahabhuta = akasha.mahabhuta;
const cheerio   = require('cheerio');
const url       = require('url');
const util      = require('util');
const fs        = require('fs-extra');
const path      = require('path');
const relative  = require('relative');

const readTOC = async (config, bookHomeURL) => {

    const documents = (await akasha.filecache).documents;
    const found = documents.find(bookHomeURL);

    // var found = await akasha.findRendersTo(config, bookHomeURL);
    // if (!found) {
    //    throw new Error("Did not find document for bookHomeURL="+ bookHomeURL);
    // }

    let foundDir;

    let contents = await fs.readFile(found.fspath, 'utf8');
    let $toc = cheerio.load(contents);
    return $toc;
}

const eBookLogoImage = ($element, metadata) => {
    let logoImage;
    let logoURLAttr  = $element.attr('logo-url');
    if (typeof logoURLAttr !== 'undefined') {
        logoImage = logoURLAttr;
    }
    if (!logoImage && typeof metadata.ebook !== 'undefined') {
        logoImage = metadata.ebook.logoImage;
    }
    if (!logoImage && typeof metadata.logoImage !== 'undefined') {
        logoImage = metadata.logoImage;
    }
    return logoImage;
}

const eBookNoLogoImage = ($element, metadata) => {
    // TODO how to generate true/false properly?
    let noLogoImage;
    var noLogoAttr  = $element.attr('logo-no');
    if (typeof noLogoAttr !== 'undefined') {
        noLogoImage = noLogoAttr;
    }
    if (!noLogoImage && typeof metadata.ebook !== 'undefined') {
        noLogoImage = metadata.ebook.noLogoImage;
    }
    if (!noLogoImage && typeof metadata.noLogoImage !== 'undefined') {
        noLogoImage = metadata.noLogoImage;
    }
    return noLogoImage;
}

const eBookLogoHeight = ($element, metadata) => {
    let logoHeight;
    var logoHeightAttr  = $element.attr('logo-height');
    if (typeof logoHeightAttr !== 'undefined') {
        logoHeight = logoHeightAttr;
    }
    if (!logoHeight && typeof metadata.ebook !== 'undefined') {
        logoHeight = metadata.ebook.logoHeight;
    }
    if (!logoHeight && typeof metadata.logoHeight !== 'undefined') {
        logoHeight = metadata.logoHeight;
    }
    return logoHeight;
}

const eBookLogoWidth = ($element, metadata) => {
    let logoWidth;
    var logoWidthAttr  = $element.attr('logo-width');
    if (typeof logoWidthAttr !== 'undefined') {
        logoWidth = logoWidthAttr;
    }
    if (!logoWidth && typeof metadata.ebook !== 'undefined') {
        logoWidth = metadata.ebook.logoWidth;
    }
    if (!logoWidth && typeof metadata.logoWidth !== 'undefined') {
        logoWidth = metadata.logoWidth;
    }
    return logoWidth;
}

const eBookTitle = ($element, metadata) => {
    let bookTitle;
    var bookTitleAttr  = $element.attr('book-title');
    if (typeof bookTitleAttr !== 'undefined') {
        bookTitle = bookTitleAttr;
    }
    if (!bookTitle && typeof metadata.ebook !== 'undefined') {
        bookTitle = metadata.ebook.bookTitle;
    }
    if (!bookTitle && typeof metadata.bookTitle !== 'undefined') {
        bookTitle = metadata.bookTitle;
    }
    return bookTitle;
}

const eBookSubTitle = ($element, metadata) => {
    let bookSubTitle;
    var bookSubTitleAttr  = $element.attr('book-sub-title');
    if (typeof bookSubTitleAttr !== 'undefined') {
        bookSubTitle = bookSubTitleAttr;
    }
    if (!bookSubTitle && typeof metadata.ebook !== 'undefined') {
        bookSubTitle = metadata.ebook.bookSubTitle;
    }
    if (!bookSubTitle && typeof metadata.bookSubTitle !== 'undefined') {
        bookSubTitle = metadata.bookSubTitle;
    }
    return bookSubTitle;
}

const eBookAuthor = ($element, metadata) => {
    let bookAuthor;
    var bookAuthorAttr  = $element.attr('book-author');
    if (typeof bookAuthorAttr !== 'undefined') {
        bookAuthor = bookAuthorAttr;
    }
    if (!bookAuthor && typeof metadata.ebook !== 'undefined') {
        bookAuthor = metadata.ebook.bookAuthor;
    }
    if (!bookAuthor && typeof metadata.bookAuthor !== 'undefined') {
        bookAuthor = metadata.bookAuthor;
    }
    return bookAuthor;
}

const eBookHeaderHeight = ($element, metadata) => {
    let headerHeight;
    var headerHeightAttr  = $element.attr('header-height');
    if (typeof headerHeightAttr !== 'undefined') {
        headerHeight = headerHeightAttr;
    }
    if (!headerHeight && typeof metadata.ebook !== 'undefined') {
        headerHeight = metadata.ebook.headerHeight;
    }
    if (!headerHeight && typeof metadata.headerHeight !== 'undefined') {
        headerHeight = metadata.headerHeight;
    }
    return headerHeight;
}

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
    async process($element, metadata, dirty) {
        var bookHomeURL = metadata.bookHomeURL;
        if (!bookHomeURL) {
            throw new Error("No bookHomeURL in metadata");
        }
        var template = $element.attr('template');
        if (!template) template = "ebook-header.html.ejs";
        var divclass = $element.attr('class');
        var divid    = $element.attr('id');

        // TODO - doesn't this need to read metadata from the document at bookHomeURL?

        let logoImage = eBookLogoImage($element, metadata);
        let noLogoImage = eBookNoLogoImage($element, metadata);
        let logoHeight = eBookLogoHeight($element, metadata);
        let logoWidth = eBookLogoWidth($element, metadata);
        let bookTitle = eBookTitle($element, metadata);
        let bookSubTitle = eBookSubTitle($element, metadata);
        let bookAuthor = eBookAuthor($element, metadata);
        let headerHeight = eBookHeaderHeight($element, metadata);

        // console.log(`EBookPageHeader ebook-page header readDocument bookHomeURL ${bookHomeURL}`);
        // let document = await akasha.readDocument(this.array.options.config, bookHomeURL);
        // console.log(`EBookPageHeader ebook-page header found document for bookHomeURL ${bookHomeURL} `, document);
        // console.log(`ebook-page-header ${metadata.document.path} ${logoImage} ${logoWidth} ${logoHeight} ${bookHomeURL} bookTitle ${bookTitle} bookAuthor ${bookAuthor}`);
        return akasha.partial(this.array.options.config, template, {
            divclass,
            divid,
            bookHomeURL,
            siteLogoImage: metadata.siteLogoImage,
            siteLogoWidth: metadata.siteLogoWidth,
            logoImage, noLogoImage,
            logoWidth, logoHeight,
            bookTitle,
            bookSubTitle,
            bookAuthor,
            headerHeight,
            publicationDate: metadata.publicationDate
        });
	}
}

class EBookToCList extends mahabhuta.CustomElement {
    get elementName() { return "ebook-toc-menu"; }
    async process($element, metadata, dirty) {
        var bookHomeURL = metadata.bookHomeURL;
        if (!bookHomeURL) {
            return Promise.reject("No bookHomeURL in metadata");
        }
        let template = $element.attr('template');
        if (!template) template = "ebook-toc-menu.html.ejs";
        let olclasses = $element.data('classes');
        let olid    = $element.data('id');
        let style   = $element.data('style');
        let ollabeledby = $element.data('ollabeledby');
        let olliclasses = $element.data('olliclasses');
        let anchortype = $element.data('anchortype');
        let anchorclasses = $element.data('anchorclasses');

        var $toc = await readTOC(this.array.options.config, metadata.bookHomeURL);

        if (olclasses && Array.isArray(olclasses)) {
            for (let olclass of olclasses) {
                $toc('nav > ol').addClass(olclass);
            }
        }
        if (olid && olid !== "") $toc('nav > ol').attr('id', olid);
        if (olliclasses && Array.isArray(olliclasses)) {
            for (let olliclass of olliclasses) {
                $toc('nav > ol > li').addClass(olliclass);
            }
        }
        if (ollabeledby && ollabeledby !== "") $toc('nav > ol').attr('aria-labelledby', ollabeledby);
        if (style && style !== "") $toc('nav > ol').attr('style', style);

        if (anchortype && anchortype !== "") $toc('nav > ol li a').attr('type', anchortype);
        if (anchorclasses && Array.isArray(anchorclasses)) {
            for (let anchorclass of anchorclasses) {
                $toc('nav > ol li a').addClass(anchorclass);
            }
        }

        // Determine the path prefix of the toc.html
        var bookHomePath = path.dirname(bookHomeURL.substring(1));
        if (bookHomePath === '.') bookHomePath = '';

        $toc('nav ol li a').each((i, elem) => {
            let tochref = $toc(elem).attr('href');
            // compute the relative path
            // Using absolutized paths computes the correct relative path
            let relativeHref = relative(
                '/'+ metadata.document.renderTo, 
                '/'+ path.join(bookHomePath, tochref));
            // console.log(`EBookNavigationHeader relative ${util.inspect(metadata.document)} ${metadata.document.relrender} ${path.join(bookHomePath, tochref)} ==> ${relativeHref}`);
            $toc(elem).attr('href', relativeHref);
            // console.log(`ebook-table-of-contents bookHomeURL ${bookHomeURL} relpath ${metadata.document.relpath} relrender ${metadata.document.relrender} tochref ${tochref} bookHomePath ${bookHomePath} bookHomeTocHref ${path.join(bookHomePath, tochref)} docPathInEbook ${docPathInEbook} relativeHref ${relativeHref}`);
        });

        let tochtml = $toc.html('nav > ol');
        return tochtml;
    }
}

const calculatePageTitle = async (config, docpath, href) => {

    var uHref = url.parse(href, true, true);
    if (!path.isAbsolute(uHref.pathname)) {
        uHref.pathname = path.join(
            path.dirname(docpath), 
            uHref.pathname);
        // console.log(`***** AnchorCleanup FIXED href to ${uHref.pathname}`);
    }

    const documents = (await akasha.filecache).documents;
    const found = documents.find(uHref.pathname);
    if (!found) {
        throw new Error(`Did not find ${href} in ${util.inspect(config.documentDirs)}`);
    }

    // var found = await akasha.findRendersTo(config, uHref.pathname);
    // if (!found) {
    //    throw new Error(`Did not find ${href} in ${util.inspect(config.documentDirs)}`);
    // }
    if (found.isDirectory) {
        found = documents.find(path.join(uHref.pathname, "index.html"));
        // found = await akasha.findRendersTo(config, path.join(uHref.pathname, "index.html"));
        if (!found) {
            throw new Error(`Did not find ${href} in ${util.inspect(documentDirs)}`);
        }
    }
    if (found && found.docMetadata && found.docMetadata.title) {
        return found.docMetadata.title;
    } else {
        // Not possible to find title
        return '';
    }
    // var renderer = config.findRendererPath(found.path);
    // if (renderer && renderer.metadata) {
    //    try {
    //        var docmeta = await renderer.metadata(found.sourcePath, found.foundPathWithinDir);
    //    } catch(err) {
    //        throw new Error(`Could not retrieve document metadata for ${found.foundDir} ${found.foundPathWithinDir} because ${err}`);
    //    }
    //    return docmeta.title;
    // } else {
    //    // Not possible to find title
    //    return '';
    // }
};

class EBookNavigationHeader extends mahabhuta.CustomElement {
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
        var showtoc  = $element.attr('showtoc');
        var tocLabel = $element.attr('toc-label');
        if (!tocLabel) tocLabel = "Table of Contents";
        
        var $toc = await readTOC(this.array.options.config, metadata.bookHomeURL);

        if (typeof showtoc !== 'undefined' && showtoc === 'true') {
            // Add .dropdown-menu so we can use Bootstrap dropdowns
            $toc('nav > ol').addClass('dropdown-menu');
            $toc('nav > ol').attr('aria-labelledby', 'dropdownMenuButton');
            $toc('nav > ol > li').addClass('dropdown-item');

            $toc('nav > ol li a').attr('type', 'button');
            $toc('nav > ol li a').addClass('btn');
            $toc('nav > ol li a').addClass('btn-link');
        }

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
        // var docPathInEbook =
        //     bookHomePath.length > 0
        //     ? metadata.document.relrender.substring(bookHomePath.length + 1)
        //     : metadata.document.relrender;

        $toc('nav ol li a').each((i, elem) => {
            let tochref = $toc(elem).attr('href');
            // compute the relative path
            // Using absolutized paths computes the correct relative path
            let relativeHref = relative(
                '/'+ metadata.document.renderTo, 
                '/'+ path.join(bookHomePath, tochref));
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
        for (let item of readingOrder) {
            if (!item.title || item.title === '') {
                item.title = await calculatePageTitle(
                    this.array.options.config,
                    metadata.document.path,
                    item.href);
            }
        }
        // console.log(`EBookNavigationHeader bookHomeURL ${metadata.bookHomeURL} ${util.inspect(readingOrder)}`);

        var foundInTOC = false;
        var TOCindex;
        for (let i = 0; !foundInTOC && i < readingOrder.length; i++) {
            // console.log(i +': '+ readingOrder[i].href +' === '+ metadata.document.renderTo);
            if (metadata.document.renderTo.endsWith(readingOrder[i].href)) {
                foundInTOC = true;
                TOCindex = i;
            }
        }
        var PREVindex = !foundInTOC ? -1 : TOCindex - 1;
        if (PREVindex < 0) PREVindex = readingOrder.length - 1;
        var NEXTindex = !foundInTOC ? 9999999 : TOCindex + 1;
        if (NEXTindex >= readingOrder.length) NEXTindex = 0;

        /* if (!foundInTOC) console.log("Did not find "+ metadata.document.renderTo +" in TOC");
        console.log("TOC "+ TOCindex +' '+ util.inspect(readingOrder[TOCindex]));

        console.log('PREV '+ PREVindex +' '+ util.inspect(readingOrder[PREVindex]));

        console.log('NEXT '+ NEXTindex +' '+ util.inspect(readingOrder[NEXTindex])); /* */

        // Here, look for current in that list.
        // Determine PREV and NEXT
        // Add those to the object passed below

        // console.log(`EBookNavigationHeader for ${metadata.document.path} tochtml ${$toc.html('nav > ol')}`);

        let logoImage = eBookLogoImage($element, metadata);
        let noLogoImage = eBookNoLogoImage($element, metadata);
        let logoHeight = eBookLogoHeight($element, metadata);
        let logoWidth = eBookLogoWidth($element, metadata);
        let bookTitle = eBookTitle($element, metadata);
        let bookSubTitle = eBookSubTitle($element, metadata);
        let bookAuthor = eBookAuthor($element, metadata);

        return akasha.partial(this.array.options.config, template, {
            divclass,
            divid,
            tochtml: (typeof showtoc !== 'undefined' && showtoc === 'true') ? $toc.html('nav > ol') : "",
            showtoc: (typeof showtoc !== 'undefined' && showtoc === 'true'),
            tocLabel,
            sectionTitle: metadata.sectionTitle,
            title: metadata.title,
            prevhref: readingOrder[PREVindex] ? readingOrder[PREVindex].href : "",
            prevtitle: readingOrder[PREVindex] ? readingOrder[PREVindex].title : "",
            nexthref: readingOrder[NEXTindex] ? readingOrder[NEXTindex].href : "",
            nexttitle: readingOrder[NEXTindex] ? readingOrder[NEXTindex].title : "",
            logoImage, noLogoImage, logoWidth, logoHeight,
            bookHomeURL, bookTitle, bookSubTitle, bookAuthor,
            publicationDate: metadata.publicationDate
        });
    }
}

class EBookNameplateBlock extends mahabhuta.CustomElement {
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

        let bookTitle = eBookTitle($element, metadata);
        let bookSubTitle = eBookSubTitle($element, metadata);
        let bookAuthor = eBookAuthor($element, metadata);
        let authors = typeof metadata.ebook !== 'undefined' 
                ? metadata.ebook.authors : metadata.authors;
        let published = typeof metadata.ebook !== 'undefined' 
                ? metadata.ebook.published : metadata.published;
        let language = typeof metadata.ebook !== 'undefined' 
                ? metadata.ebook.language : metadata.language;
        let source = typeof metadata.ebook !== 'undefined' 
                ? metadata.ebook.source : metadata.source;
        if (!bookTitle || !bookSubTitle 
         || !bookAuthor || !authors 
         || !published || !language || !source) {
            let document = await akasha.readDocument(
                this.array.options.config,
                bookHomeURL
            );
            bookTitle = typeof document.metadata.ebook !== 'undefined'
                ? document.metadata.ebook.bookTitle : document.metadata.bookTitle;
            bookSubTitle = typeof document.metadata.ebook !== 'undefined'
                ? document.metadata.ebook.bookSubTitle : document.metadata.bookSubTitle;
            bookAuthor = typeof document.metadata.ebook !== 'undefined'
                ? document.metadata.ebook.bookAuthor : document.metadata.bookAuthor;
            authors = typeof document.metadata.ebook !== 'undefined'
                ? document.metadata.ebook.authors : document.metadata.authors;
            published = typeof document.metadata.ebook !== 'undefined'
                ? document.metadata.ebook.published : document.metadata.published;
            language = typeof document.metadata.ebook !== 'undefined'
                ? document.metadata.ebook.language : document.metadata.language;
            source = typeof document.metadata.ebook !== 'undefined'
                ? document.metadata.ebook.source : document.metadata.source;
        }
        return akasha.partial(this.array.options.config, template, {
            divclass, divid,
            bookTitle, bookSubTitle,
            bookAuthor, authors,
            published, language, source
        });
    }
}

class EBookIndex extends mahabhuta.CustomElement {
    get elementName() { return "ebook-index"; }
    async process($element, metadata, dirty) {
        var bookHomeURL = metadata.bookHomeURL;
        if (!bookHomeURL) {
           throw new Error("No bookHomeURL in metadata");
        }
        var template = $element.attr('template');
        var divclass = $element.attr('class');
        var divid    = $element.attr('id');
        if (!template) template = "ebook-index.html.ejs";

        // console.log(`ebook-index metadata.bookIndexLayout ${metadata.bookIndexLayout} rootPath ${path.dirname(metadata.document.path)}`);

        const filecache = await akasha.filecache;

        let documents = filecache.documents.search(this.array.options.config, {
            pathmatch: undefined,
            // renderers: [ akasha.HTMLRenderer ],
            layouts: metadata.bookIndexLayout ? [ metadata.bookIndexLayout ] : undefined,
            rootPath: path.dirname(metadata.document.path)
        });
        // console.log(`ebook-index `, documents);
        return akasha.partial(this.array.options.config, template, {
            divclass, divid,
            documents
        });
    }
}

module.exports.mahabhutaArray = function(options) {
    let ret = new akasha.mahabhuta.MahafuncArray("epub-website", options);
    ret.addMahafunc(new EBookPageHeader());
    ret.addMahafunc(new EBookToCList());
    ret.addMahafunc(new EBookNavigationHeader());
    ret.addMahafunc(new EBookNameplateBlock());
    ret.addMahafunc(new EBookIndex());
    return ret;
}

