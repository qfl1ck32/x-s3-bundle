import { IReducerOption } from "@kaviar/nova";
import { FileStoreService } from "../services/UploadsService";

// Export link names as constants with type of: BundleLinkCollectionOption, sample:
// export const company: IReducerOption = { ... }
export const downloadPath: IReducerOption = {
  dependency: {
    path: 1,
    store: 1,
  },
  reduce(upload, params) {
    const {
      context: { container },
    } = params;
    const { path, store } = upload;
    const service = container.get(FileStoreService);
    return service.findStore(store).getFullPath(path);
  },
};
