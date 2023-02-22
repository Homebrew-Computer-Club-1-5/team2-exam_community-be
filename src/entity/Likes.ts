import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
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

  @CreateDateColumn()
  c_date: Date;

  static async countLikes(postId: number): Promise<number> {
    const [_, likesCount] = await Likes.findAndCount({
      where: { postId: postId },
    });
    return likesCount;
  }

  static async doesUserLike(
    postId: number,
    userId: number
  ): Promise<{ bool: boolean; id: number }> {
    const like = await Likes.findOne({
      where: { postId: postId, userId: userId },
    });
    const doesUserLike = like.id ? true : false;
    return { bool: doesUserLike, id: like.id };
  }
}
