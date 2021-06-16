import { Token } from "@kaviar/core";
import { Collection } from "@kaviar/mongo-bundle";
import { AWSS3Config } from "./defs";
import { AppFileGroupsCollection } from "./collections/appFileGroups/AppFileGroups.collection";
import { AppFilesCollection } from "./collections/appFiles/AppFiles.collection";

export const APP_FILES_COLLECTION_TOKEN = new Token<AppFilesCollection>(
  "APP_FILES_COLLECTION"
);
export const APP_FILE_GROUPS_COLLECTION_TOKEN = new Token<AppFileGroupsCollection>(
  "APP_FILE_GROUPS_COLLECTION"
);

export const AWS_MAIN_CONFIG_TOKEN = new Token<AWSS3Config>(
  "AWS_MAIN_CONFIG_TOKEN"
);
