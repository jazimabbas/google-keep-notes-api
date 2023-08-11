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

@Entity()
export default class Note {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  hasItems: boolean;

  @Column()
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

  @ManyToOne(() => UserNote, (userNote) => userNote.notes)
  userNote: UserNote;
}
