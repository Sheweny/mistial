import Dialect from "../../core/Dialect";
import Mistial from "../../index";

/**
 * Dialect for mongodb
 */
class Mongodb extends Dialect {
    /**
     * mongoose the mongodb object modeler
     * @private
     */
    private lib: any;

    /**
     * Instantiate the mongodb dialect
     * @param mistial
     */
    constructor(mistial: Mistial) {
        super(mistial);

        this.lib = this.loadDialectModule('mongoose')
    }

    /**
     * Connect with mongodb database on config
     * @private
     */
    private _connect(): void {
        this.lib.connect(this.mistial.options.uri!, this.mistial.options.dialectModuleOptions)
    }
}

export default Mongodb;
