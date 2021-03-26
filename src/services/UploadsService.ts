import path from "path";
import { AppFile } from "../collections/AppFile.model";
import { ObjectID } from "@kaviar/mongo-bundle";
import { AppFilesCollection } from "../collections/AppFiles.collection";
import { Inject } from "@kaviar/core";

export interface IStore<C = any> {
  /**
   * Returns the full downloadable path for that specific file
   * @param path the identifiable path from the storage
   */
  getClientDownloadPath(path): string;
  setup(config: C): void;
  upload(file, userId): Promise<ObjectID>;
  delete(path: string): void | Promise<void>;
  fetch(path: string): Promise<Buffer>;
}

export class FileStoreService {
  @Inject(() => AppFilesCollection)
  appFiles: AppFilesCollection;

  fileStores: {
    [storeName: string]: IStore;
  } = {};

  findStore(name: string): IStore {
    return this.fileStores[name];
  }

  registerStore(name: string, store: IStore) {
    if (this.findStore[name]) {
      throw new Error(`You already have registered a file store with the name "${name}"`)
    }

    this.fileStores[name] = store;
  }

  getFullPath(path: string, storeName: string = "local") {
    return this.findStore(storeName).getFullPath(path);
  }

  async save(appFile: AppFile): Promise<ObjectID> {
    const result = await this.appFiles.insertOne(appFile);

    return result.insertedId;
  }

  async get(appFileId: ObjectID): Promise<void> {
    return this.appFiles.findOne({
      _id: appFileId,
    });
  }
}
