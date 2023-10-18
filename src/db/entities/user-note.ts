import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from "typeorm";
import User from "./user";
import Note from "./note";
import Label from "./label";
import Reminder from "./reminder";

@Entity({ name: "userNote" })
export default class UserNote {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  archived: boolean;

  @Column({ default: false })
  pined: boolean;

  @Column({ default: false })
  owner: boolean;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Note, (note) => note.userNote, { onDelete: "CASCADE" })
  note: Note;

  @ManyToMany(() => Label, { onDelete: "CASCADE" })
  @JoinTable({
    name: "userNote_labels_label",
    joinColumn: {
      name: "userNoteId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "labelId",
      referencedColumnName: "id",
    },
  })
  labels: Label[];

  @OneToOne(() => Reminder, (reminder) => reminder.userNote, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  reminder: Reminder;
}
