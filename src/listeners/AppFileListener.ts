import { Inject, Listener, On } from "@kaviar/core";
import { LoggerService } from "@kaviar/logger-bundle";
import { BeforeRemoveEvent } from "@kaviar/mongo-bundle";
import { AppFileGroupsCollection } from "../collections/appFileGroups/AppFileGroups.collection";
import { AppFilesCollection } from "../collections/appFiles/AppFiles.collection";
import { S3UploadService } from "../services/S3UploadService";

export class AppFileListener extends Listener {
  @Inject(() => AppFilesCollection)
  protected appFiles: AppFilesCollection;

  @Inject(() => S3UploadService)
  protected uploadService: S3UploadService;

  @Inject(() => AppFileGroupsCollection)
  protected appFileGroups: AppFileGroupsCollection;

  @Inject(() => LoggerService)
  protected logger: LoggerService;

  @On(BeforeRemoveEvent, {
    filter: (e: BeforeRemoveEvent) =>
      e.collection instanceof AppFilesCollection,
  })
  async onAppFileDelete(e: BeforeRemoveEvent) {
    const filters = e.data.filter;
    const _id = filters._id;
    if (!_id) {
      this.logger.info(
        "Could not reliably delete app file from S3. Please use a deletion by id for this to work."
      );
      return;
    }

    const appFile = await this.appFiles.findOne(
      { _id },
      {
        projection: {
          _id: 1,
          path: 1,
        },
      }
    );

    this.uploadService.remove(appFile.path).catch((err) => {
      this.logger.error(
        `Failed to remove media file: ${JSON.stringify(appFile, null, 4)}`
      );
    });

    // remove it from all groups
    await this.appFileGroups.updateMany(
      {
        filesIds: {
          $in: [appFile._id],
        },
      },
      {
        $pull: {
          fileIds: appFile._id,
        },
      }
    );
  }
}
