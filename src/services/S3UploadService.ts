import * as shortid from "shortid";
import { URL } from "url";
import { Upload } from "graphql-upload";
import { S3 } from "aws-sdk";
import * as moment from "moment";
import { AWSS3Config } from "../defs";
import { AppFile } from "../collections/AppFile.model";
import { Inject } from "@kaviar/core";
import { AppFilesCollection } from "../collections/AppFiles.collection";
import { ObjectId } from "@kaviar/ejson";

export class S3UploadService {
  protected config: AWSS3Config;
  protected s3: S3;

  @Inject(() => AppFilesCollection)
  protected appFiles: AppFilesCollection;

  setConfig(awsConfig: AWSS3Config) {
    this.config = awsConfig;
    const { endpoint, ...config } = awsConfig;
    this.s3 = new S3(config);
  }

  /**
   * Returns the upload file for downloading
   * @param id
   * @returns
   */
  findOneById(id: ObjectId) {
    return this.appFiles.findOne(id);
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

  putObject(fileKey, mimeType, stream): Promise<S3.PutObjectOutput> {
    const params = {
      Bucket: this.config.bucket,
      Key: fileKey,
      Body: stream,
      ContentType: mimeType,
      ACL: "public-read",
    };
    return this.s3.putObject(params).promise();
  }

  async remove(key) {
    return this.s3
      .deleteObject({
        Bucket: this.config.bucket,
        Key: key,
      })
      .promise();
  }

  getUrl(key): string {
    return new URL(key, this.config.endpoint).href;
  }

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
