---
layout: ebook-page.html.ejs
title: Setting up AkashaRender to generate both a EPUB and Website
bookHomeURL: '/toc.html'
---

# Directory structure

This is the recommended directory structure:

| Website | EPUB |
| --------|--------- |
| assets-web | assets-epub |
| documents-web | documents |
| layouts-web | layouts-epub |
| partials-web | partials-epub |
| config-web.js | config-epub.js |
| maha-web.js | maha-epub.js |
| package.json | package.json |
| book.yml | book.yml |

The idea is to have parallel directories, `-web` and `-epub`, for the directories which must be different for Website and EPUB destinations.

This shows different configuration and mahabhuta files for a similar purpose.. there will be code and configuration differences between the two rendering destinations.  Some of the files will be identical between the two rendering destinations.

# config.js for EPUB

```
'use strict';

const util    = require('util');
const akasha  = require('akasharender');

const log    = require('debug')('epub-website:configuration');
const error  = require('debug')('epub-website:error-configuration');

const config = new akasha.Configuration();

config
    .addAssetsDir('assets-epub')
    .addLayoutsDir('layout-epub')
    .addDocumentsDir('documents')
    .addPartialsDir('partials-epub')
    .setRenderDestination('rendered')
    .addStylesheet({ href: "css/style.css" });

config
    .use(require('akashacms-footnotes'))
    .use(require('akasharender-epub'));

config.prepare();
module.exports = config;
```

This is a fairly minimal `config.js` for generating an EPUB.  Notice that the stylesheet reference does not have a leading `/` because EPUB's do not allow rooted pathnames.

# config.js for websites

```
'use strict';

const util    = require('util');
const akasha  = require('akasharender');

const log    = require('debug')('epub-website:configuration');
const error  = require('debug')('epub-website:error-configuration');

const config = new akasha.Configuration();

config
    .addAssetsDir('assets-web')
    .addAssetsDir('assets')
    .addAssetsDir({
        src: 'bower_components/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
   .addAssetsDir({
        src: 'bower_components/jquery/dist',
        dest: 'vendor/jquery'
    })
    // .addLayoutsDir('layouts-web-fixed')   // Use this for fixed layout
    .addLayoutsDir('layouts-web-flex')       // Use this for flexbox layout
    .addDocumentsDir('documents')
    .addPartialsDir('partials-web')
    .setRenderDestination('out');

config
    .use(require('akashacms-theme-bootstrap'))
    .use(require('akashacms-base'))
    .use(require('akashacms-footnotes'))
    .use(require('akasharender-epub'))
    .use(require('epub-website'));

config
    .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js"  })
    .addStylesheet({       href: "//fonts.googleapis.com/css?family=Luckiest+Guy|Raleway" })
    .addStylesheet({       href: "/vendor/bootstrap/css/bootstrap.min.css" })
    .addStylesheet({       href: "/vendor/bootstrap/css/bootstrap-theme.min.css" })
    .addStylesheet({ href: "/css/style.css" });

config.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true
});

config.prepare();
module.exports = config;
```

Notice this is a little more comprehensive, and includes Bootstrap support to assist with layout.  The plugins are all oriented to website creation.

An important thing to note in this case is two different layout directories.  We'll get to this elsewhere, but there are various ways to format an online EPUB viewer for an optimum reading experience.

This config includes the `epub-website` plugin, which is the plugin containing this particular guidebook. 
