import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import Note from "./note";

@Entity({ name: "noteImage" })
export default class NoteImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @ManyToOne(() => Note, (note) => note.images)
  note: Note;
}
