import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Note from "./note";

@Entity({ name: "theme" })
export default class Theme {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  color: string;

  @OneToMany(() => Note, (note) => note.theme)
  notes: Note[];
}
