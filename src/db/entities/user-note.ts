import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import User from "./user";
import Note from "./note";

@Entity()
export default class UserNote {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  archived: boolean;

  @Column({ default: false })
  pined: boolean;

  @ManyToOne(() => User, (user) => user.notes)
  user: User;

  @OneToMany(() => Note, (note) => note.userNote)
  notes: Note[];
}
