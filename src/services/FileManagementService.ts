import * as shortid from "shortid";
import { URL } from "url";
import { Upload } from "graphql-upload";
import { S3 } from "aws-sdk";
import * as moment from "moment";
import { AWSS3Config } from "../defs";
import { AppFile } from "../collections/appFiles/AppFile.model";
import { Inject } from "@kaviar/core";
import { AppFileGroupsCollection } from "../collections/appFileGroups/AppFileGroups.collection";
import { AppFilesCollection } from "../collections/appFiles/AppFiles.collection";
import { ObjectID } from "@kaviar/mongo-bundle";
import { S3UploadService } from "./S3UploadService";

export class FileManagementService {
  protected config: AWSS3Config;
  protected s3: S3;

  @Inject(() => S3UploadService)
  protected s3UploadService: S3UploadService;

  @Inject(() => AppFilesCollection)
  protected appFiles: AppFilesCollection;

  @Inject(() => AppFileGroupsCollection)
  protected appFileGroups: AppFileGroupsCollection;

  /**
   * Creates a new file group
   * @param name This field is optional it's helpful if you want to easily identify the filegroup by name
   * @returns The _id of the file group
   */
  async newFileGroup(name?: string): Promise<ObjectID> {
    const result = await this.appFileGroups.insertOne({ name, filesIds: [] });

    return result.insertedId;
  }

  /**
   * Adds a file to the group
   * @param fileGroupId
   * @param fileId
   */
  async addFileToFileGroup(fileGroupId: ObjectID, fileId: ObjectID) {
    await this.appFileGroups.updateOne(fileGroupId, {
      $addToSet: {
        filesIds: fileId,
      },
    });
  }

  /**
   * Retrieve a file by id
   * @param fileId
   * @returns
   */
  async getFile(fileId: ObjectID): Promise<AppFile> {
    return this.appFiles.findOne({ _id: fileId });
  }

  /**
   * Use this method when you easily want to get the downloadable URL of the file.
   * @param fileId
   * @returns
   */
  async getFileURL(fileId: ObjectID) {
    const file = await this.appFiles.findOne(
      { _id: fileId },
      {
        projection: {
          path: 1,
        },
      }
    );

    return this.s3UploadService.getUrl(file.path);
  }

  /**
   * This is the typical way and recommended way to remove a file, it will ensure the groups are clean and delete it from the upload service
   * @param fileId
   */
  async removeFile(fileId: ObjectID) {
    // The listener should handle its deletion
    await this.appFiles.deleteOne({
      _id: fileId,
    });
  }
}
