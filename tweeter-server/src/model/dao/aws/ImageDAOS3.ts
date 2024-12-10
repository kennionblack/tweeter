import { ImageDAO } from "../ImageDAO";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

export class ImageDAOS3 implements ImageDAO {
  private readonly REGION = "us-west-2";

  readonly tableName = "340-tweeter-images-kennion";
  private readonly s3Client = new S3Client({ region: this.REGION });

  getImageUrl(fileName: string): string {
    return `https://${this.tableName}.s3.${this.REGION}.amazonaws.com/image/${fileName}`;
  }

  async putImage(fileName: string, imageStringBase64Encoded: string): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(imageStringBase64Encoded, "base64");
    const s3Params = {
      Bucket: this.tableName,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    try {
      await this.s3Client.send(c);
      return `https://${this.tableName}.s3.${this.REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }

  async delete(alias: string): Promise<void> {
    const params = {
      Bucket: this.tableName,
      Key: alias,
    };
    const command = new DeleteObjectCommand(params);
    await this.s3Client.send(command);
  }

  async updateImage(alias: string, newImageString: string): Promise<void> {
    await this.delete(alias);
    await this.putImage(alias, newImageString);
  }

  // these are included to allow implementation of the DAO interface
  async put(alias: string): Promise<void> {
    return;
  }

  async update(alias: string): Promise<void> {
    return;
  }

  async get(alias: string): Promise<string> {
    return "";
  }
}
