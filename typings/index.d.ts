import { Collection } from "collection-data";
import { ConnectOptions, Schema } from "mongoose";

//#region Classes

export class ConnectMongo {
  public constructor(uri: string, options?: MongooseOptions);

  public db?: typeof import("mongoose");
  public directory?: string;
  public models?: Collection<string, Schema>;

  public registerModels(
    directory: string | undefined
  ): Promise<Collection<string, Schema>>;
}

//#endregion Classes

//#region Interfaces

interface MongooseOptions {
  connectOptions?: ConnectOptions;
  directory?: string;
}

//#endregion Interfaces
