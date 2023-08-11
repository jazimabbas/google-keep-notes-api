import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import NoteList from "./note-list";

@Entity()
export default class NoteListItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  content: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column()
  order: number;

  @ManyToOne(() => NoteList, (noteList) => noteList.noteListItem)
  noteList: NoteList;
}
