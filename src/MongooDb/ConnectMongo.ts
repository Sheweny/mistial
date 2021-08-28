import { connect, ConnectOptions, Model, Schema } from "mongoose";
import { Collection } from "collection-data";
import { join } from "path";
import { readDirAndPush } from "../utils/readDirFiles";

/**
 * Optionnals options for init mongoose database
 */
interface MongooseOptions {
  connectOptions?: ConnectOptions;
  directory?: string;
}

/**
 * Manager for MongoDb database
 */
export class ConnectMongo {
  /**
   * Manage database with mongoose module
   * @type {typeof import("mongoose") | undefined}
   */
  public db?: typeof import("mongoose");

  /**
   * Directory of models for mongoose
   * @type {string | undefined}
   */
  public directory?: string;

  /**
   * Collection of models
   * @type {Collection<string, Schema> | undefined}
   */
  public models?: Collection<string, Schema>;

  /**
   * Constructor for init mongodb database
   * @param {ShewenyClient} [client] Client framwork
   * @param {string} uri URI for connect mongodb database
   * @param {MongooseOptions} [options] Optionnals options for init Database
   */
  constructor(uri: string, options?: MongooseOptions) {
    this.directory = options?.directory;

    // FIX DEFAULT OPTIONS
    connect(uri, options?.connectOptions || {})
      .then((mongoose) => (this.db = mongoose))
      .catch(console.error);
  }

  /**
   * Register all models in collection
   * @param {string | undefined} [directory] Directory of folder models
   * @returns {Promise<Collection<string, Schema>>}
   */
  public async registerModels(
    directory: string | undefined = this.directory
  ): Promise<Collection<string, Schema>> {
    if (!directory) throw new Error("Directory must be provided");

    const models = new Collection<string, Schema>();
    const baseDir = join(require.main!.path, directory);
    const modelsPath: string[] = await readDirAndPush(baseDir);

    for (const modelPath of modelsPath) {
      const model: Model<unknown, {}, {}> = await import(modelPath);
      if (!(model instanceof new Model())) continue;
      models.set(model.name, model.schema);
    }

    this.models = models;
    return models;
  }
}
