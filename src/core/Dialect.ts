import type Mistial from "../index";

/**
 * The base of a dialect
 */
class Dialect {
    /**
     * The instance of Mistial
     * @protected
     */
    protected mistial: Mistial;

    constructor(mistial: Mistial) {
        this.mistial = mistial;
    }

    /**
     * Try to load dialect module
     * @param {string} moduleName Name of dialect module
     * @protected
     * @return {any}
     */
    protected loadDialectModule(moduleName: string): any {
        try {
            return require(moduleName);
        } catch (err: any) {
            if (err.code === 'MODULE_NOT_FOUND') {
                throw new Error(`Please install ${moduleName} package manually`);
            }
            throw err;
        }
    }
}

export default Dialect;
