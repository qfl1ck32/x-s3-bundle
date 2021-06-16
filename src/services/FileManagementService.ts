import * as shortid from "shortid";
import { URL } from "url";
import { Upload } from "graphql-upload";
import { S3 } from "aws-sdk";
import * as moment from "moment";
import { AWSS3Config } from "../defs";
import { AppFile } from "../collections/appFiles/AppFile.model";
import { Inject } from "@kaviar/core";
import { ObjectId } from "@kaviar/ejson";
import { AppFileGroupsCollection } from "../collections/appFileGroups/AppFileGroups.collection";
import { AppFilesCollection } from "../collections/appFiles/AppFiles.collection";

export class FileManagementService {
  protected config: AWSS3Config;
  protected s3: S3;

  @Inject(() => AppFilesCollection)
  protected appFiles: AppFilesCollection;

  @Inject(() => AppFileGroupsCollection)
  protected appFileGroups: AppFileGroupsCollection;

  async newFileGroup(name: string): Promise<ObjectId> {
    const result = await this.appFileGroups.insertOne({});

    return result.insertedId;
  }
}
