## To Do

We are using [Apollo Upload scalar](https://www.apollographql.com/docs/apollo-server/data/file-uploads/) to transfer the files through the GraphQL API

## Install

```ts
new XUploadsBundle();
```

## Upload Files

```ts
class AppFileStore extends LocalFileStore {
  constructor() {
    this.setup({
      // Default Path: os.tmpDir() + '/uploads';
      path: "",
      // From where would we download the file
      // Default works like this: {ROOT_URL}/files/fileName.jpg
      downloadPath(appUpload) {
        return "";
      },
    });
  }

  getStoreId() {
    return "local";
  }
}
```

```ts
const fileStore = container.get(AppFileStore);

const typeDefs = `
  type Mutation {
    uploadAvatar(file: Upload!): Boolean
  }
`;
const resolvers = {
  Mutation: {
    async uploadAvatar(_, args, ctx) {
      // This will create a new document inside AppFilesCollection
      const appFileId = await fileStore.handleUpload(args.file);

      // Update avatarId for current user ctx.userId
    },
  },
};
```

You can also perform deletion and fetching:

```ts
await fileStore.delete(path); // deletes the file from the store
await fileStore.fetch(path); // returns Buffer
```

## S3

```ts
class AppFileStore extends S3FileStore {
  constructor(
    // You can store these parameters in your main AppBundle in prepare()
    @Inject("%AWS_S3_ACCESS_KEY_ID%") accessKeyId: string,
    @Inject("%AWS_S3_SECRET_ACCESS_KEY%") secretAccessKey: string,
    @Inject("%AWS_S3_REGION%") region: string,
    @Inject("%AWS_S3_BUCKET%") region: string,
  ) {
    this.setup({
      accessKeyId,
      secretAccessKey
      region,
      bucket,
    });
  }

  getStoreId() {
    return "s3-default";
  }
}
```

## Downloading Files

When files are situated locally, you have to provide an endpoint that would download this file. We strongly recommend to do this at a "higher than node" level. Node is not very efficient for file streaming.

```ts
class AppBundle extends Bundle {
  prepare() {
    this.setupDownloadRoute();
  }

  setupDownloadRoute() {
    const apolloBundle = this.container.get(ApolloBundle);
    apolloBundle.addRoute("/files/:file", async ({ params }) {
      // Fetch it from the path and serve it.
    })
  }
}
```

## Getting file path

```graphql
type User {
  # ...
  avatar: AppFile
}
```

```ts
query {
  user {
    avatar {
      filePath
    }
  }
}
```

## Multiple stores

