import { Constructor } from "@kaviar/core";
import { Collection, ObjectID } from "@kaviar/mongo-bundle";
import { ReadStream } from "fs";
import { AppFilesCollection } from "./collections/appFiles/AppFiles.collection";
import { AppFileGroupsCollection } from "./collections/appFileGroups/AppFileGroups.collection";

export type File = {
  filename: string;
  mimetype: string;
  encoding: string;
  stream?: ReadStream;
};

export type S3BundleConfigType = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint: string;
  appFilesCollection?: Constructor<AppFilesCollection>;
  appFileGroupsCollection?: Constructor<AppFileGroupsCollection>;
};

export type AWSS3Config = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint: string;
  bucket: string;
};
