/**
 * The current list of dialect supported
 */
export type Dialect = 'mongodb' | 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql';

/**
 * The default configuration of the main class
 */
export interface DefaultConfig {
    database: string;
    host: string;
    username: string;
    password: null;
    port: number;
    modelDirectory?: string;
    dialectModuleOptions: {};
}

/**
 * The configuration of the main class
 */
export interface Config {
    dialect: Dialect;
    uri?: string;
    database?: string;
    host?: string;
    username?: string;
    password?: string | null;
    port?: number;
    modelDirectory?: string;
    dialectModuleOptions?: object;
}

/**
 * Options for the constructor of Mistial main class
 */
export interface Options extends Config {}
