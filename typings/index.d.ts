import { Collection } from "collection-data";
import { ConnectOptions, Document, Model, Schema } from "mongoose";

//#region Classes

export class ConnectMongo {
  public constructor(uri: string, options?: MongooseOptions);

  public db?: typeof import("mongoose");
  public directory?: string;
  public models?: Collection<string, Model<unknown, {}, {}>>;

  public registerModels(
    directory: string | undefined
  ): Promise<Collection<string, Model<unknown, {}, {}>>>;
  public addModel(name: string, schema: Schema): Model<unknown, {}, {}>;
  public deleteModel(
    name: string
  ): Collection<string, Model<unknown, {}, {}>> | undefined;
  public getModel(name: string): Model<unknown, {}, {}> | undefined;
  public getData(
    collection: string,
    searchValues: object,
    creationDocument?: CreationDocumentOptions
  ): Promise<Document<any, any, unknown> | null | undefined>;
}

//#endregion Classes

//#region Interfaces

interface CreationDocumentOptions {
  createDocument?: boolean;
  values?: string;
}

interface MongooseOptions {
  connectOptions?: ConnectOptions;
  directory?: string;
}

//#endregion Interfaces
