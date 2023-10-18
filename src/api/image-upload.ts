import { ImageUploadService } from "@/services/image-upload";
import { Request, Response } from "express";
import { errorHandler } from "@/utils/errors";

const service = new ImageUploadService();

export async function imageUpload(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const file: Express.Multer.File = req.file;

    const url = await service.uploadImage(file);

    return res.status(201).json({
      message: "Image Uploaded successfully",
      data: {
        url,
      },
    });
  } catch (error) {
    return errorHandler(res, error, { logKey: "imageUpload" });
  }
}
