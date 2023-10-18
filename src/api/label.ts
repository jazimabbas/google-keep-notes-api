import { Request, Response } from "express";
import { errorHandler } from "@/utils/errors";
import { validate } from "@/utils/validations";
import { User } from "@/db/entities";
import * as schema from "@/utils/validations/label";
import { LabelService } from "@/services/label";

const service = new LabelService();

export async function createLabel(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as User).id;
    const { name } = await validate(schema.labelSchema, req.body);

    await service.createLabel(userId, name);

    return res.status(200).json({ message: "label created successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "CreateNote" });
  }
}

export async function deleteLabel(req: Request, res: Response) {
  try {
    const labelId = req.params.id;

    await service.deleteLabel(labelId);

    return res.status(200).json({ message: "label deleted successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "DeleteNote" });
  }
}

export async function updateLabel(req: Request, res: Response) {
  try {
    const labelId = req.params.id;
    const { name } = await validate(schema.labelSchema, req.body);

    await service.editLabel(labelId, name);

    return res.status(200).json({ message: "label updated successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "UpdateNote" });
  }
}

export async function getUserLabels(req: Request, res: Response) {
  try {
    const userId = (req.user as User).id;
    const labels = await service.getUserLabels(userId);

    return res.status(200).json({ message: "success", labels });
  } catch (error) {
    return errorHandler(res, error, { logKey: "UpdateNote" });
  }
}
