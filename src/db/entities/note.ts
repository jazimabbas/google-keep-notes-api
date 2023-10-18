import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";

import NoteList from "./note-list";
import NoteImage from "./note-image";
import UserNote from "./user-note";
import Theme from "./theme";
import Collaborator from "./collaborator";

@Entity({ name: "note" })
export default class Note {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ default: false })
  hasCheckBoxEnable: boolean;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;

  @OneToMany(() => NoteList, (noteList) => noteList.note)
  noteList: NoteList[];

  @OneToMany(() => NoteImage, (image) => image.note)
  images: NoteImage[];

  @OneToMany(() => UserNote, (userNote) => userNote.note)
  userNote: UserNote[];

  @ManyToOne(() => Theme, (theme) => theme.notes, { onDelete: "SET NULL" })
  theme: Theme;

  @OneToMany(() => Collaborator, (collaborator) => collaborator.note)
  collaborators: Collaborator[];
}
