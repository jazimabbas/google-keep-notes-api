import { Response, Request } from "express";
import { errorHandler } from "@/utils/errors";
import { validate } from "@/utils/validations";
import * as schema from "@/utils/validations/note";
import { NoteService } from "@/services/note";
import { User } from "@/db/entities";

const service = new NoteService();

export async function createNote(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as User).id;

    const cleanedFields = await validate(schema.noteSchema, req.body);

    await service.createNote(userId, cleanedFields);

    return res.status(200).json({ message: "note created successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "CreateNote" });
  }
}

export async function getNotes(req: Request, res: Response): Promise<Response> {
  try {
    const userId = (req.user as User).id;
    const label = req.query?.label ? req.query.label.toString() : undefined;

    const notes = await service.getUserNoteList(userId, label);

    return res.status(200).json({ message: "success", notes });
  } catch (error) {
    return errorHandler(res, error, { logKey: "GetNotes" });
  }
}

export async function noteDetail(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as User).id;
    const userNoteId = req.params.id;

    const note = await service.getNote(userId, userNoteId);

    return res.status(200).json({ message: "success", note });
  } catch (error) {
    return errorHandler(res, error, { logKey: "NoteDetail" });
  }
}

export async function deleteNotes(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { noteIds } = await validate(schema.deleteNoteSchema, req.body);

    await service.deleteNotes(noteIds);
    return res.status(200).json({ message: "notes deleted successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "DeleteNotes" });
  }
}

export async function archiveNotes(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as User).id;
    const { noteIds } = await validate(schema.archiveNotesSchema, req.body);

    await service.archiveNotes(userId, noteIds);

    return res.status(200).json({ message: "notes archived successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "ArchiveNote" });
  }
}

export async function unArchiveNotes(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as User).id;
    const { noteIds } = await validate(schema.unArchiveNotesSchema, req.body);

    await service.unArchiveNotes(userId, noteIds);

    return res
      .status(200)
      .json({ message: "notes are unArchived successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "UnArchiveNote" });
  }
}

export async function pinNotes(req: Request, res: Response): Promise<Response> {
  try {
    const userId = (req.user as User).id;
    const { noteIds } = await validate(schema.pinNotesSchema, req.body);

    await service.pinNotes(userId, noteIds);

    return res.status(200).json({ message: "notes are pinned successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "PinNotes" });
  }
}

export async function unPinNotes(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as User).id;
    const { noteIds } = await validate(schema.unPinNotesSchema, req.body);

    await service.unPinNotes(userId, noteIds);

    return res.status(200).json({ message: "notes are unpinned successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "PinNotes" });
  }
}

export async function changeNotesLabel(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = (req.user as User).id;
    const cleanedFields = await validate(
      schema.changeNoteLabelSchema,
      req.body
    );

    await service.changeNotesLabel(userId, cleanedFields);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "ChangeNotesLabel" });
  }
}

export async function addCollaborator(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const noteId = req.params.id;
    const userId = (req.user as User).id;
    const { emails } = await validate(schema.addCollaboratorSchema, req.body);

    await service.addCollaborator(userId, emails, noteId);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "AddCollaborator" });
  }
}

export async function removeCollaborator(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const noteId = req.params.id;
    const { collaboratorIds } = await validate(
      schema.collaboratorIdsSchema,
      req.body
    );
    // console.log(collaboratorIds);
    await service.removeCollaborator(noteId, collaboratorIds);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "RemoveCollaborator" });
  }
}

export async function addReminder(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userNoteId = req.params.id;
    const userId = (req.user as User).id;

    const cleanedFields = await validate(schema.addReminderSchema, req.body);

    await service.addReminder(userId, userNoteId, cleanedFields);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "AddReminder" });
  }
}

export async function removeReminder(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userNoteId = req.params.id;
    const userId = (req.user as User).id;

    const done = req.body.done || false;

    await service.removeReminder(userId, userNoteId, done);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "RemoveReminder" });
  }
}

export async function updateReminder(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userNoteId = req.params.id;
    const userId = (req.user as User).id;

    const cleanedFields = await validate(schema.updateReminderSchema, req.body);

    await service.updateReminder(userId, userNoteId, cleanedFields);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "UpdateReminder" });
  }
}
