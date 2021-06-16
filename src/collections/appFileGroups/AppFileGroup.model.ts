import { ObjectID } from "@kaviar/mongo-bundle";
import { IUser } from "@kaviar/security-bundle";
import { AppFile } from "../appFiles/AppFile.model";

export class AppFileGroup {
  _id: ObjectID;
  appFiles: AppFile[];
  name?: string;
}
