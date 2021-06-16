import { Bundle } from "@kaviar/core";
import { S3BundleConfigType } from "./defs";
import { S3UploadService } from "./services/S3UploadService";
import { GraphQLBundle, Loader } from "@kaviar/graphql-bundle";
import GraphQLAppFile from "./graphql/entities/AppFile.graphql";
import { AppFileListener } from "./listeners/AppFileListener";
import { AWS_MAIN_CONFIG_TOKEN } from "./constants";
import { ApolloBundle } from "@kaviar/apollo-bundle";

export class XS3Bundle extends Bundle<S3BundleConfigType> {
  dependencies = [ApolloBundle, GraphQLBundle];

  defaultConfig = {
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: "",
    region: "",
    bucket: "",
  };

  async prepare() {
    this.container.set(AWS_MAIN_CONFIG_TOKEN, this.config);
  }

  async init() {
    const loader = this.container.get(Loader);
    loader.load({
      typeDefs: GraphQLAppFile,
    });

    this.warmup([AppFileListener, S3UploadService]);
  }
}
