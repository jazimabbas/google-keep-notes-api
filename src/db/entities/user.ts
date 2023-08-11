import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import UserNote from "./user-note";

@Entity({ name: "users" })
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserNote, (userNote) => userNote.user)
  notes: UserNote[];
}
