import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import User from "./user";

@Entity({ name: "label" })
export default class Label {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.labels)
  user: User;
}
