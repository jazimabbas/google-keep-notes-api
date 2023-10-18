import { awsEnvVars } from "@/utils/env-vars";
import * as AWS from "aws-sdk";

const s3 = new AWS.S3();

export class ImageUploadService {
  async uploadImage(file: Express.Multer.File): Promise<String> {
    const imageName = file.originalname.split(" ").join("");

    const params = {
      Bucket: awsEnvVars.bucketName,
      Key: imageName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.upload(params).promise();

    return `https://${awsEnvVars.bucketName}.s3.amazonaws.com/${imageName}`;
  }
}
