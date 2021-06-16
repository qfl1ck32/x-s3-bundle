import { ApolloBundle } from "@kaviar/apollo-bundle";
import { Bundle, Kernel } from "@kaviar/core";
import { GraphQLBundle, Loader } from "@kaviar/graphql-bundle";
import { LoggerBundle } from "@kaviar/logger-bundle";
import { XS3Bundle } from "../XS3Bundle";
import { XBundle } from "@kaviar/x-bundle";
import { MongoBundle } from "@kaviar/mongo-bundle";
import { XPasswordBundle } from "@kaviar/x-password-bundle";
import { PasswordBundle } from "@kaviar/password-bundle";
import { SecurityBundle } from "@kaviar/security-bundle";
import { EmailBundle } from "@kaviar/email-bundle";

class MyBundle extends Bundle {
  async prepare() {
    this.container.get(Loader).load({
      typeDefs: `
        type User { name: String! }
      `,
    });
  }
}
export function createKernel() {
  return new Kernel({
    bundles: [
      new ApolloBundle({
        port: 5000,
      }),
      new GraphQLBundle(),
      new LoggerBundle(),
      new SecurityBundle(),
      new MongoBundle({
        uri: "mongodb://localhost:27017/test",
      }),
      new XBundle(),
      new XS3Bundle({
        accessKeyId: "A",
        secretAccessKey: "B",
        bucket: "test.com",
        endpoint: "https://s3.amazonaws.com/test.com",
        region: "eu-west-2",
      }),
      new MyBundle(),
    ],
  });
}

export const kernel = createKernel();
export const container = kernel.container;
