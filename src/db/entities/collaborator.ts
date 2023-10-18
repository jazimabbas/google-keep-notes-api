import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Note from "./note";
import User from "./user";

@Entity({ name: "collaborator" })
export default class Collaborator {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.collaborators, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Note, (user) => user.collaborators, { onDelete: "CASCADE" })
  note: Note;

  @Column()
  owner: boolean;

  @Column()
  userNoteId: string;
}
