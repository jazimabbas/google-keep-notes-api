import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Note from "./note";
import NoteListItem from "./note-list-item";

@Entity()
export default class NoteList {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  content: string;

  @Column()
  order: number;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => Note, (note) => note.noteList)
  note: Note;

  @OneToMany(() => NoteListItem, (noteListItem) => noteListItem.noteList)
  noteListItem: NoteListItem[];
}
