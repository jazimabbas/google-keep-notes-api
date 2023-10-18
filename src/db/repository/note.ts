import { Repository } from "typeorm";
import { Note } from "../entities";
import dataSource from "../index";
import { CreateNoteOption } from "./types";
import { BadRequest } from "@/utils/errors/custom-errors";

class NoteRepository {
  private repository: Repository<Note>;

  constructor() {
    this.repository = dataSource.getRepository(Note);
  }

  async createNote(args: CreateNoteOption): Promise<Note | undefined> {
    const note = await this.repository.create({ ...args });

    const noteObj = await this.repository.save(note);

    return noteObj;
  }

  async getNoteById(id: string): Promise<Note> {
    const note = await this.repository
      .createQueryBuilder("note")
      .leftJoinAndSelect("note.noteList", "noteList")
      .leftJoinAndSelect("noteList.noteItemList", "noteItemList")
      .leftJoinAndSelect("note.theme", "theme")
      .leftJoinAndSelect("note.images", "images")
      .leftJoinAndSelect("note.collaborators", "collaborator")
      .leftJoin("collaborator.user", "user")
      .addSelect(["user.id", "user.email", "user.name"])
      .where("note.id = :id", { id })
      .getOne();

    if (!note) {
      throw new BadRequest({ message: "note not found" });
    }
    return note;
  }

  async deleteNote(ids: string[]): Promise<void> {
    const { affected } = await this.repository.delete(ids);
    if (affected === 0) {
      throw new BadRequest({ message: "note not found" });
    }
  }
}

export default NoteRepository;
