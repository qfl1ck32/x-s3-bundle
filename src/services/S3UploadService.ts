import * as shortid from "shortid";
import { URL } from "url";
import { Upload } from "graphql-upload";
import { S3 } from "aws-sdk";
import * as moment from "moment";
import { AWSS3Config } from "../defs";
import { AppFile } from "../collections/appFiles/AppFile.model";
import { Inject } from "@kaviar/core";
import { ObjectId } from "@kaviar/ejson";
import { AppFilesCollection } from "../collections/appFiles/AppFiles.collection";
import { AWS_MAIN_CONFIG_TOKEN } from "../constants";

export class S3UploadService {
  protected s3: S3;

  @Inject(() => AppFilesCollection)
  protected appFiles: AppFilesCollection;

  constructor(
    @Inject(AWS_MAIN_CONFIG_TOKEN)
    protected readonly config: AWSS3Config
  ) {
    const { endpoint, ...s3Config } = config;
    this.s3 = new S3(s3Config);
  }

  /**
   * This gets a file from GraphQL upload and returns the AppFile object.
   * @param upload
   * @returns
   */
  async upload(
    upload: Promise<Upload>,
    extension?: Partial<AppFile>
  ): Promise<AppFile> {
    const { createReadStream, filename, mimetype } = await upload;
    const stream = createReadStream();

    const buffer = await this.streamToBuffer(stream);
    const id = shortid.generate();
    const fileName = `${id}-${filename}`;
    const fileKey = this.generateKey(fileName);

    await this.putObject(fileKey, mimetype, buffer);

    const appFile = new AppFile();
    if (extension) {
      Object.assign(appFile, extension);
    }

    appFile.path = fileKey;
    appFile.name = filename;
    appFile.mimeType = mimetype;
    appFile.size = Buffer.byteLength(buffer);

    const result = await this.appFiles.insertOne(appFile);
    appFile._id = result.insertedId;

    return appFile;
  }

  /**
   * Uploads your buffer/stream to the desired path in S3
   * @param fileKey
   * @param mimeType
   * @param stream
   * @returns
   */
  async putObject(fileKey, mimeType, stream): Promise<S3.PutObjectOutput> {
    const params: S3.PutObjectRequest = {
      Bucket: this.config.bucket,
      Key: fileKey,
      Body: stream,
      ContentType: mimeType,
      ACL: "public-read",
    };

    return this.s3.putObject(params).promise();
  }

  /**
   * Removes it from S3 deleting it forever
   * @param key
   * @returns
   */
  async remove(key) {
    return this.s3
      .deleteObject({
        Bucket: this.config.bucket,
        Key: key,
      })
      .promise();
  }

  /**
   * Returns the downloadable URL for the specified key
   *
   * @param key
   * @returns
   */
  getUrl(key): string {
    return new URL(key, this.config.endpoint).href;
  }

  /**
   * Based on file name it can generate a secure upload key
   * @param filename
   * @param context
   * @returns
   */
  generateKey(filename: string, context = ""): string {
    const dateFolder = `${moment()
      .locale("en")
      .format("YYYY")}/${moment().locale("en").format("MM")}/${moment()
      .locale("en")
      .format("DD")}`;

    let key = `${dateFolder}/${shortid.generate()}`;

    if (context !== "") {
      key += `-${context}`;
    }

    return `${key}-${filename}`;
  }

  /**
   * Gets a stream and puts it in the Buffer
   * @param stream
   * @returns
   */
  async streamToBuffer(stream): Promise<Buffer> {
    const buffs = [];
    return new Promise((resolve, reject) =>
      stream
        .on("data", (chunk) => buffs.push(chunk))
        .on("error", (error) => reject(error))
        .on("end", () => resolve(Buffer.concat(buffs)))
        .on("finish", () => resolve(Buffer.concat(buffs)))
    );
  }
}
