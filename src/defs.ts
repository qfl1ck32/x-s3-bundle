export type File = {
  filename: string;
  mimetype: string;
  encoding: string;
  stream?: ReadStream;
}