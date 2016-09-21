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

// config.addMahabhuta(require('../../../mahafuncs'));
// config.addMahabhuta(require('./mahafuncs'));

config.prepare();

module.exports = config;
