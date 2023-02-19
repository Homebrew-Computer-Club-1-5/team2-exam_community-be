import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  JoinTable,
  AfterUpdate,
  PrimaryColumn,
  Like,
} from "typeorm";

import { Comments } from "./Comments";
import { Likes } from "./Likes";
import { Users } from "./Users";

@Entity("posts")
export class Posts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // @PrimaryColumn()
  // uuid: string;
  @Column()
  user_id: string;
  @Column()
  user_name: string;
  @Column()
  title: string;
  @CreateDateColumn()
  c_date: Date;
  @UpdateDateColumn()
  m_date: Date | null;
  @DeleteDateColumn()
  d_date: Date | null;
  @Column()
  num: number; // 소속 게시판
  @Column("text")
  content: string;
  @Column()
  click_num: number;
  @Column()
  comment_num: number;
  @Column()
  is_user_hid: boolean;
  @ManyToOne((type) => Users, (user) => user.posts, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  user_key: Users;
  @OneToMany((type) => Comments, (comment) => comment.post_key, {
    cascade: true,
  })
  comments: Comments[];

  // like
  // @OneToMany(() => Likes, (likes) => likes.post, {
  //   nullable: true,
  // })
  // likes: Likes[];

  static find_num(num: number) {
    return this.createQueryBuilder("post")
      .select()
      .where("post.num = ", { num })
      .getOne();
  }
}
