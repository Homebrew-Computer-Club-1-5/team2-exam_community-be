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
  readonly id: number;
  @Column()
  userId: number;
  @Column()
  postId: number;
  @ManyToOne(() => Users, (user) => user.likePosts) //TODO: nullable 안해줘도 되나?
  @JoinTable({ name: "userId" })
  user: Promise<Users>;
  @ManyToOne(() => Posts, (post) => post.likeUsers)
  @JoinTable({ name: "postId" })
  post: Promise<Posts>;
}
