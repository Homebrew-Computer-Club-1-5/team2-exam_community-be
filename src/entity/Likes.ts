import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity("likes")
export class Likes extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @Column()
  userId: number;
  @Column()
  postId: number;
  @ManyToOne(() => User, (user) => user.likePost) //TODO: nullable 안해줘도 되나?
  @JoinTable({ name: "userId" })
  user: Promise<User>;
  @ManyToOne(() => Post, (post) => post.likeUser)
  @JoinTable({ name: "postId" })
  post: Promise<Post>;
}
