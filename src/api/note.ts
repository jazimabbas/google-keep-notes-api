import { Response, Request } from "express";
import { errorHandler } from "@/utils/errors";
import { validate } from "@/utils/validations";
import { noteSchema, deleteNoteSchema } from "@/utils/validations/note";
import { NoteService } from "@/services/note";
import { User } from "@/db/entities";

const service = new NoteService();

export async function createNote(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as User).id;

    const cleanedFields = await validate(noteSchema, req.body);

    await service.createNote(userId, cleanedFields);

    return res.status(200).json({ message: "note created successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "CreateNote" });
  }
}

export async function deleteNotes(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as User).id;
    const { noteIds } = await validate(deleteNoteSchema, req.body);

    await service.deleteNotes(userId, noteIds);
    return res.status(200).json({ message: "notes deleted successfully" });
  } catch (error) {
    console.log(error);
    return errorHandler(res, error, { logKey: "DeleteNotes" });
  }
}
