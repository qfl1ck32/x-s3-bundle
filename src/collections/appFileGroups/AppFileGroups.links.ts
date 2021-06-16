import { IBundleLinkCollectionOption } from "@kaviar/mongo-bundle";
import { AppFilesCollection } from "../appFiles/AppFiles.collection";

export const files: IBundleLinkCollectionOption = {
  collection: () => AppFilesCollection,
  field: "filesIds",
};
