import { ObjectID } from "@kaviar/mongo-bundle";
import { IUser } from "@kaviar/security-bundle";
import { AppFileGroup } from "../appFileGroups/AppFileGroup.model";

export class AppFile {
  _id: ObjectID;
  name: string;
  path: string;
  size: number;
  mimeType: string;

  metadata: object;

  /**
   * To have a generic way of linking data
   */
  resourceId?: ObjectID;
  resourceType?: string;

  uploadedBy?: IUser;
  uploadedById?: ObjectID;

  /**
   * @reducer
   */
  downloadUrl: string;

  groups?: AppFileGroup[];
  createdAt: Date;
  updatedAt: Date;
}
