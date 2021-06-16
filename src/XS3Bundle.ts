import { Bundle } from "@kaviar/core";
import { S3BundleConfigType } from "./defs";
import { S3UploadService } from "./services/S3UploadService";
import { Loader } from "@kaviar/graphql-bundle";
import GraphQLAppFile from "./graphql/entities/AppFile.graphql";
import { AppFileListener } from "./listeners/AppFileListener";
import { AWS_MAIN_CONFIG_TOKEN } from "./constants";

export class XS3Bundle extends Bundle<S3BundleConfigType> {
  defaultConfig = {
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: "",
    region: "",
    bucket: "",
  };

  async init() {
    const loader = this.container.get(Loader);
    loader.load({
      typeDefs: GraphQLAppFile,
    });

    this.container.set(AWS_MAIN_CONFIG_TOKEN, this.config);
    const service = this.container.get(S3UploadService);

    this.warmup([AppFileListener]);
  }
}
