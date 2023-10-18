import { Entity, Column, PrimaryColumn, OneToOne } from "typeorm";
import UserNote from "./user-note";

@Entity({ name: "reminder" })
export default class Reminder {
  @PrimaryColumn()
  id: string;

  @Column({ type: "timestamp" })
  dateTime: Date;

  @Column()
  occurrence: number;

  @OneToOne(() => UserNote, (userNote) => userNote.reminder, {
    onDelete: "CASCADE",
  })
  userNote: UserNote;
}
