import { Token } from "@kaviar/core";
import { Collection } from "@kaviar/mongo-bundle";

export const APP_FILES_COLLECTION_TOKEN = new Token<Collection>(
  "APP_FILES_COLLECTION"
);
export const APP_FILE_GROUPS_COLLECTION_TOKEN = new Token<Collection>(
  "APP_FILE_GROUPS_COLLECTION"
);
