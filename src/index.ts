import type {Config, DefaultConfig, Options} from "../typings";
import * as url from "url";
import * as _ from "lodash";
import Dialect from "./core/Dialect";
import Mongodb from "./dialects/mongodb";

/**
 * This is the main class, the entry point to mistial
 */
class Mistial {
    /**
     * Options for the constructor of Mistial main class
     */
    public options: Options;

    /**
     * the instance of the current dialect
     * @private
     */
    private currentDialect: Mongodb | undefined
    /**
     * Instantiate mistial
     *
     * @example
     * // with uri
     * new Mistial({ dialect: 'mongodb', uri: 'mongodb://localhost:27017/test' })
     *
     * // without uri
     * new Mistial({
     *   dialect: 'mysql',
     *   host: 'localhost',
     *   database: 'mistial',
     *   username: 'root',
     *   password: '',
     *   port: 3306
     * })
     * @param config
     */
    constructor(config: Config) {
        if (config.dialect) {
            if (config.uri) {
                const urlParts: url.UrlWithParsedQuery = url.parse(config.uri, true);

                const uriDialect: string = urlParts.protocol!.replace(/:$/, '');
                if (uriDialect !== config.dialect) {
                    throw new Error('The dialect of the uri is not valid');
                }

                config.host = urlParts.hostname!.trim();

                if (urlParts.pathname) {
                    config.database = urlParts.pathname.replace(/^\//, '');
                }

                if (urlParts.port) {
                    config.port = parseInt(urlParts.port)
                }

                if (urlParts.auth) {
                    const authParts: string[] = urlParts.auth.split(':');

                    config.username = authParts[0];
                    if (authParts.length > 1)
                        config.password = authParts.slice(1).join(':');
                }
                console.log(config)
            } else {
                if (config.dialect !== 'mongodb') {
                    _.defaults<Config, DefaultConfig>(config, {
                        host: 'localhost',
                        database: 'mistial',
                        username: 'root',
                        password: null,
                        port: 3306,
                        modelDirectory: './models',
                        dialectModuleOptions: {}
                    });
                } else {
                    _.defaults<Config, { host: string, database: string, port: number }>(config, {
                        host: 'localhost',
                        database: 'mistial',
                        port: 3306
                    });
                }
            }
        } else {
            throw new Error('Dialect needs to be explicitly')
        }
        this.options = {...config};

        this.init()
    }

    private init(): void {
        switch (this.options.dialect) {
            case "mongodb":
                this.currentDialect = new Mongodb(this)
                break
        }
    }
}

export default Mistial;

