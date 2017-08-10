
'use strict';

const util    = require('util');
const akasha  = require('akasharender');
const async   = require('async');
const cheerio = require('cheerio');
const path    = require('path');

const log    = require('debug')('akashacms-skeleton:configuration');
const error  = require('debug')('akashacms-skeleton:error-configuration');

const config = new akasha.Configuration();

// Fill this with the URL of your site
config.rootURL("https://skeleton.akashacms.com");

config
    .addAssetsDir('assets')
    .addAssetsDir({
        src: 'node_modules/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
   .addAssetsDir({
        src: 'node_modules/jquery/dist',
        dest: 'vendor/jquery'
    })
    .addLayoutsDir('layouts')
    .addDocumentsDir('documents')
    .addDocumentsDir({
        src: 'node_modules/epub-skeleton/documents',
        dest: 'epub-skeleton',
        baseMetadata: {
            bookHomeURL: "/epub-skeleton/toc.html"
        }
    })
    .addPartialsDir('partials');

config
    .use(require('akashacms-theme-bootstrap'))
    .use(require('akashacms-base'))
    .use(require('akashacms-breadcrumbs'))
    .use(require('akashacms-booknav'))
    .use(require('akashacms-embeddables'))
    .use(require('akashacms-tagged-content'))
    .use(require('epub-website'));

config.plugin("akashacms-base").generateSitemap(config, true);

// Add any stylesheets or JavaScript here
// The /vendor/jquery and /vendor/bootstrap files come from the corresponding
// modules under node_modules.  The last comes from the assets directory.
//
// If you wish to use LESS, you instead add css/style.css.less under
// the documents directory.  Remember that files in the assets directory
// are copied as-is, while files in the documents directory may be processed
// depending on the file extension.  The .css.less extension invokes the
// LESS compiler.
config
    .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js"  })
    .addStylesheet({       href: "/vendor/bootstrap/css/bootstrap.min.css" })
    .addStylesheet({       href: "/vendor/bootstrap/css/bootstrap-theme.min.css" })
    .addStylesheet({       href: "/css/style.css" });

config.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true,
    decodeEntities: true
});

config.plugin("akashacms-tagged-content")
    .sortBy('title')
    .headerTemplate("---\ntitle: @title@\nlayout: tagpage.html.ejs\n---\n<p>Pages with tag @tagName@</p>")
    .tagsDirectory('/tags/');

config.prepare();
module.exports = config;
