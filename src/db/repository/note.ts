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
    const note = await this.repository.findOne({
      where: {
        id,
      },
      relations: ["noteList", "noteList.noteItemList", "images", "theme"],
    });

    if (!note) {
      throw new BadRequest({ message: "note not found" });
    }
    return note;
  }
}

export default NoteRepository;
