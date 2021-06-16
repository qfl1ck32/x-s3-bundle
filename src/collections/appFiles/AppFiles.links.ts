import { IBundleLinkCollectionOption } from "@kaviar/mongo-bundle";
import { AppFileGroupsCollection } from "../appFileGroups/AppFileGroups.collection";

export const group: IBundleLinkCollectionOption = {
  collection: () => AppFileGroupsCollection,
  field: "fileGroupId",
};
