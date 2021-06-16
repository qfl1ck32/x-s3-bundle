import { Token } from "@kaviar/core";
import { Collection } from "@kaviar/mongo-bundle";
import { AWSS3Config } from "./defs";

export const APP_FILES_COLLECTION_TOKEN = new Token<Collection>(
  "APP_FILES_COLLECTION"
);
export const APP_FILE_GROUPS_COLLECTION_TOKEN = new Token<Collection>(
  "APP_FILE_GROUPS_COLLECTION"
);

export const AWS_MAIN_CONFIG_TOKEN = new Token<AWSS3Config>(
  "AWS_MAIN_CONFIG_TOKEN"
);
