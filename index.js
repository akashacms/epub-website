
const akasha    = require('akasharender');
const path      = require('path');


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
