
'use strict';


const akasha    = require('akasharender');
const mahabhuta = require('mahabhuta');
const path      = require('path');

const log   = require('debug')('epub-website:main');
const error = require('debug')('epub-website:main');


module.exports = class EPUBWebsitePlugin extends akasha.Plugin {
	constructor() {
		super("epub-website");
	}

	configure(config) {
		this._config = config;
		config
            .addPartialsDir(path.join(__dirname, 'partials'))
		    .addAssetsDir(path.join(__dirname, 'assets'))
            .addStylesheet({ href: "/akasha/epub-website/style.css" })
		    .addMahabhuta(require('./mahabhuta'));
    }
}
