
const akasha    = require('akasharender');
const mahabhuta = akasha.mahabhuta;
const path      = require('path');
const mahafuncs = require('./mahabhuta');


const pluginName = "epub-website";

const _plugin_config = Symbol('config');
const _plugin_options = Symbol('options');

module.exports = class EPUBWebsitePlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    configure(config, options) {
        this[_plugin_config] = config;
        this[_plugin_options] = options;
        options.config = config;
        config
            .addPartialsDir(path.join(__dirname, 'partials'))
            .addAssetsDir(path.join(__dirname, 'assets'))
            .addStylesheet({ href: "/akasha/epub-website/style.css" })
            .addMahabhuta(mahafuncs.mahabhutaArray(options));
    }

    get config() { return this[_plugin_config]; }
    get options() { return this[_plugin_options]; }

}
