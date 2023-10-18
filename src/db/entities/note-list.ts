import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Note from "./note";
import NoteListItem from "./note-list-item";

@Entity({ name: "noteList" })
export default class NoteList {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  content: string;

  @Column()
  order: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  hasItems: boolean;

  @ManyToOne(() => Note, (note) => note.noteList, { onDelete: "CASCADE" })
  note: Note;

  @OneToMany(() => NoteListItem, (noteListItem) => noteListItem.noteList)
  noteItemList: NoteListItem[];
}
