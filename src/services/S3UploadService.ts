import * as shortid from "shortid";
import { URL } from "url";
import { FileUpload } from "graphql-upload";
import { S3 } from "aws-sdk";
import * as moment from "moment";
import { AWSS3Config } from "../defs";
import { AppFile } from "../collections/appFiles/AppFile.model";
import { Inject } from "@kaviar/core";
import { ObjectId } from "@kaviar/ejson";
import { AppFilesCollection } from "../collections/appFiles/AppFiles.collection";
import {
  AWS_MAIN_CONFIG_TOKEN,
  APP_FILES_COLLECTION_TOKEN,
} from "../constants";
import { ObjectID } from "@kaviar/mongo-bundle";

export class S3UploadService {
  protected s3: S3;

  @Inject(APP_FILES_COLLECTION_TOKEN)
  protected readonly appFiles: AppFilesCollection;

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
    upload: Promise<FileUpload>,
    extension?: Partial<AppFile>
  ): Promise<AppFile> {
    const { createReadStream, filename, mimetype } = await upload;
    const stream = createReadStream();

    const buffer = await this.streamToBuffer(stream);

    return this.uploadBuffer(filename, mimetype, buffer, extension);
  }

  /**
   * Easy to use method for uploading from a buffer directly
   * @param filename
   * @param mimetype
   * @param buffer
   * @param extension
   * @returns
   */
  public async uploadBuffer(
    filename: string,
    mimetype: string,
    buffer: Buffer,
    extension?: Partial<AppFile>
  ): Promise<AppFile> {
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
   * Use this method when you easily want to get the downloadable URL of the file.
   * @param fileId
   * @returns
   */
  async getFileURL(fileId: ObjectID) {
    const file = await this.appFiles.findOne(
      { _id: fileId },
      {
        projection: {
          path: 1,
        },
      }
    );

    if (!file) {
      throw new Error(`File with id: ${fileId} was not found`);
    }

    return this.getUrl(file.path);
  }

  /**
   * Returns the downloadable URL for the specified key
   *
   * @param key
   * @returns
   */
  getUrl(key: string): string {
    let urlPath = this.config.endpoint;
    if (urlPath[urlPath.length - 1] !== "/") {
      urlPath = urlPath + "/";
    }
    if (key[0] === "/") {
      key = key.slice(1);
    }
    // urlPath ends with '/', key surely doesn't
    return urlPath + key;
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
