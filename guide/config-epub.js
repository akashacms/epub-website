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

// config.addMahabhuta(require('../../../mahafuncs'));
// config.addMahabhuta(require('./mahafuncs'));

config.prepare();

module.exports = config;
