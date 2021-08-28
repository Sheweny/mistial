import { connect, ConnectOptions, Document, model, Model, Schema } from "mongoose";
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
 * If the document doesn't exists, a new document is created
 */
interface CreationDocumentOptions {
  createDocument?: boolean;
  values?: string;
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
   * @type {Collection<string, Model<unknown, {}, {}>> | undefined}
   */
  public models?: Collection<string, Model<unknown, {}, {}>>;

  /**
   * Constructor for init mongodb database
   * @param {ShewenyClient} [client] Client framwork
   * @param {string} uri URI for connect mongodb database
   * @param {MongooseOptions} [options] Optionnals options for init Database
   */
  constructor(uri: string, options?: MongooseOptions) {
    if (!uri) throw new Error("Connection URI must be provided");

    this.directory = options?.directory;

    // FIX DEFAULT OPTIONS
    connect(uri, options?.connectOptions || {})
      .then((mongoose) => (this.db = mongoose))
      .catch(console.error);
  }

  /**
   * Register all models in collection
   * @param {string | undefined} [directory] Directory of folder models
   * @returns {Promise<Collection<string, Model<unknown, {}, {}>>>}
   */
  public async registerModels(
    directory: string | undefined = this.directory
  ): Promise<Collection<string, Model<unknown, {}, {}>>> {
    if (!directory) throw new Error("Directory must be provided");

    const models = new Collection<string, Model<unknown, {}, {}>>();
    const baseDir = join(require.main!.path, directory);
    const modelsPath: string[] = await readDirAndPush(baseDir);

    for (const modelPath of modelsPath) {
      const model: Model<unknown, {}, {}> = await import(modelPath);
      if (!(model instanceof new Model())) continue;
      models.set(model.name, model);
    }

    this.models = models;
    return models;
  }

  /**
   * Create a new Model and he's add in collection
   * @param name Name of the new model
   * @param schema Schema of the new model
   * @returns {Model<unknown, {}, {}>}
   */
  public addModel(name: string, schema: Schema): Model<unknown, {}, {}> {
    if (!name) throw new Error("Name must be provided");
    if (!schema) throw new Error("Schema must be provided");

    const newModel = model(name, schema);

    this.models = this.models
      ? this.models.set(name, newModel)
      : new Collection<string, Model<unknown, {}, {}>>().set(name, newModel);
    return newModel;
  }

  /**
   * Delete a model which exists in collection
   * @param name Name of the model which is going to be deleted
   * @returns {Collection<string, Model<unknown, {}, {}>> | undefined}
   */
  public deleteModel(
    name: string
  ): Collection<string, Model<unknown, {}, {}>> | undefined {
    const model = this.models?.get(name);
    if (!model) return undefined;

    this.models?.delete(name);
    return this.models;
  }

  /**
   * Get a model from the collection
   * @param name Name of the model
   * @returns {Model<unknown, {}, {}> | undefined}
   */
  public getModel(name: string): Model<unknown, {}, {}> | undefined {
    return this.models?.get(name);
  }

  /**
   * Get Docuement (data) from collection
   * @param {string} collection Name of collection where we search the document
   * @param {string} searchValues Research values
   * @param {CreationDocumentOptions} [creationDocument] If data is not found, a new data is created
   * @returns {Promise<Document<any, any, unknown> | null | undefined>}
   */
  public async getData(
    collection: string,
    searchValues: object,
    creationDocument?: CreationDocumentOptions
  ): Promise<Document<any, any, unknown> | null | undefined> {
    const model = this.models?.get(collection);
    if (!model) return undefined;

    let data = await model.findOne(searchValues);
    if (!data && creationDocument?.createDocument)
      data = await model.create(creationDocument.values);
    else data = null;

    return data;
  }
}
