import { ContainerInstance } from "@kaviar/core";
import { IReducerOption } from "@kaviar/nova";
import { S3UploadService } from "../../services/S3UploadService";

// Export link names as constants with type of: BundleLinkCollectionOption, sample:
// export const company: IReducerOption = { ... }
export const downloadUrl: IReducerOption = {
  dependency: {
    path: 1,
    resourceType: 1,
    resourceId: 1,
  },
  reduce(upload, params) {
    const container: ContainerInstance = params.context.container;
    const service = container.get(S3UploadService);

    return service.getUrl(upload.path);
  },
};
