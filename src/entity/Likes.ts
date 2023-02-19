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

  // @ManyToOne(() => Users, (user) => user.likes)
  @Column()
  userId: number;

  // @ManyToOne(() => Posts, (post) => post.likes)
  @Column()
  postId: number;

  @Column()
  doesLike: boolean;
}
