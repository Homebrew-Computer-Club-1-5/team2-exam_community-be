import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Posts } from "./Posts";

@Entity("likes")
export class Likes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.likes, { cascade: true })
  user: string;

  @ManyToOne(() => Posts, (post) => post.likes, { cascade: true })
  post: string;
}
