
import akasha, {
    Configuration,
    CustomElement,
    Munger,
    PageProcessor
} from 'akasharender';
const mahabhuta = akasha.mahabhuta;
import path from 'node:path';
import { mahabhutaArray } from './mahabhuta.mjs';

const __dirname = import.meta.dirname;

const pluginName = "epub-website";

export default class EPUBWebsitePlugin extends akasha.Plugin {

    #config;
    
    constructor() {
        super(pluginName);
    }

    configure(config, options) {
        this.#config = config;
        // this.config = config;
        this.akasha = config.akasha;
        this.options = options ? options : {};
        this.options.config = config;
        config
            .addPartialsDir(path.join(__dirname, 'partials'))
            .addAssetsDir(path.join(__dirname, 'assets'))
            .addStylesheet({ href: "/akasha/epub-website/style.css" })
            .addMahabhuta(mahabhutaArray(options, config, this.akasha, this));
    }

    get config() { return this.#config; }

}
