import { Bundle } from "@kaviar/core";
import { ApolloBundle } from "@kaviar/apollo-bundle";
import { S3BundleConfigType } from "./defs";
import { S3UploadService } from "./services/S3UploadService";
import { Loader } from "@kaviar/graphql-bundle";
import GraphQLAppFile from "./graphql/entities/AppFile.graphql";
import { AppFileListener } from "./listeners/AppFileListener";

export class XS3Bundle extends Bundle<S3BundleConfigType> {
  defaultConfig = {
    accessKeyId: process.env.AWS_S3_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET,
    endpoint: process.env.AWS_S3_ENDPOINT,
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET,
  };

  async init() {
    const loader = this.container.get(Loader);
    loader.load({
      typeDefs: GraphQLAppFile,
    });

    const service = this.container.get(S3UploadService);
    service.setConfig({
      ...this.config,
    });

    this.warmup([AppFileListener]);
  }
}
