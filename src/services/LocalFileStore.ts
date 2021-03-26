import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { ObjectID } from '@kaviar/mongo-bundle';
import { AppFile } from "../collections/AppFile.model";
import { AbstractFileStore } from './AbstractFileStore';

type LocalFileStoreConfig = {
  path?: string;
}

const LOCAL_CONFIG_DEFAULTS = {
  path: path.join(os.tmpdir(), "uploads")
}

export abstract class LocalFileStore extends AbstractFileStore<LocalFileStoreConfig> {
  config: LocalFileStoreConfig;
  
  getFullPath(path: any): string {
    throw new Error("Method not implemented.");
  }

  setup(config: LocalFileStoreConfig): void {
    config = Object.assign({}, config, LOCAL_CONFIG_DEFAULTS);
    this.config = config;
  }

  isSetup(): boolean {
    return !!this.config;
  }

  /**
   * @param file 
   * @param uploadedById 
   */
  async upload(file, uploadedById: ObjectID) {
    const { filepath, filename, mimetype } = await this.storeLocally(file);

    const appFile = new AppFile();
    appFile.name = filename;
    appFile.path = filepath;
    appFile.mimeType = mimetype;
    appFile.size = fs.statSync(filepath).size;
    appFile.uploadedById = uploadedById;

    fs.unlinkSync(filepath);
  }
}
