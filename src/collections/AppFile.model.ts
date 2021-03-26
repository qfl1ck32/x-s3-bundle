import { ObjectID } from "@kaviar/mongo-bundle";
import { IUser } from "@kaviar/security-bundle";

export class AppFile {
  _id: ObjectID;
  storeId: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  /**
   * Applies to images only: Width, Height
   */
  dimension?: [number, number];

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
  downloadPath: string;
}
