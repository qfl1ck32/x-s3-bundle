import { Collection, Behaviors } from "@kaviar/mongo-bundle";
import * as reducers from "./AppFiles.reducers";
import { AppFile } from "./AppFile.model";

export class AppFilesCollection extends Collection<AppFile> {
  static collectionName = "appFiles";
  static model = AppFile;

  static reducers = reducers;

  static behaviors = [Behaviors.Timestampable(), Behaviors.Blameable()];
}
