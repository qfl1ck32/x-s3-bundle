import { ObjectID } from "@kaviar/mongo-bundle";
import { AppFile } from "../appFiles/AppFile.model";

export class AppFileGroup {
  _id: ObjectID;
  name?: string;
  files: AppFile[];
  filesIds: ObjectID[];
}
