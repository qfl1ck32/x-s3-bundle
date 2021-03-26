import { ObjectID } from '@kaviar/mongo-bundle';
import { Inject } from '@kaviar/core';
import { IStore } from "./UploadsService";
import { AppFilesCollection } from '../collections/AppFiles.collection';
import { File } from '../defs';
import { storeFS } from './utils';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export abstract class AbstractFileStore<C> implements IStore<C> {
  @Inject(() => AppFilesCollection)
  public readonly appFilesCollection: AppFilesCollection;
  
  abstract setup(config: any);
  abstract getClientDownloadPath(path: any): string;
  abstract upload(file: File, userId: ObjectID): Promise<ObjectID> | ObjectID;
  abstract delete(path: string): Promise<void> | void;
  abstract fetch(path: string): Promise<Buffer>;

  async storeLocally(file: Promise<File>): Promise<{
    filepath: string;
    mimetype: string;
    filename: string;
  }> {
    const { stream, filename, mimetype } = await file;

    if (!filename) {
      throw new Error("Can't find filename");
    }

    const { filepath } = await storeFS({ stream, filename });

    return {
      filepath,
      mimetype,
      filename,
    };
  }

  protected generateKey(filename: string, context: string = '') {
    const now = new Date();
    let datePath = `${now.getFullYear()}/${now.getMonth() + 1 }/${now.getDay()}`
    const randomiser = this.generateId(16)
    datePath += datePath + '/' + randomiser;

    return `${datePath}-${filename}`;
  }

  protected generateId(length) {
    var result           = '';
    var charactersLength = CHARS.length;
    for ( var i = 0; i < length; i++ ) {
       result += CHARS.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
}