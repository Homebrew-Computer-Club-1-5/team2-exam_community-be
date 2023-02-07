import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  JoinTable,
  PrimaryColumn,
} from "typeorm";
import { Posts } from "./Posts";
import { Users } from "./Users";

@Entity("comments")
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // @PrimaryColumn()
  // uuid: string;
  @Column()
  post_id: number;
  @ManyToOne((type) => Posts, (post) => post.comments, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  post_key: Posts;
  @Column()
  user_id: string;
  @Column()
  user_name: string;
  @Column("text")
  content: string;
  @CreateDateColumn()
  c_date: Date;

  static find_post_key(post_key: number) {
    return this.createQueryBuilder("comment")
      .where("comment.post_key = :post_key", { post_key })
      .getMany();
    // .getManyAndCount(); // 갯수 까지 같이 가져오는것
  }
}
