import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { Posts } from "./Posts";
import * as bcrypt from "bcrypt"; // 암호화 관련
import { RandomUUIDOptions } from "crypto";
import { Likes } from "./Likes";

@Entity("users")
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // @PrimaryColumn()
  // uuid: string;
  //typeorm 은 이런 방식으로 하면 uuid를 쉽게 사용할수있는듯 ㄷㄷ 추측임
  // @PrimaryGeneratedColumn('uuid')
  // readonly id: string;
  @Column() // 컬럼 명을 ()안에 넣어도 괜찮은가?
  name: string;
  @Column()
  age: string;
  @Column()
  email: string;
  @Column()
  phone?: string;
  @Column()
  gender: string;
  @CreateDateColumn()
  c_date: Date;
  @UpdateDateColumn()
  m_date: Date | null;
  @DeleteDateColumn()
  d_date: Date | null;
  @Column()
  user_id: string;
  @Column()
  user_pw: string;
  // like
  @OneToMany((type) => Posts, (post) => post.user_key, {
    cascade: true,
  })
  posts: Posts[];

  @OneToMany(() => Likes, (likes) => likes.user)
  likePosts: Likes[];

  static findbyid(user_id: string) {
    return this.createQueryBuilder("user")
      .where("user.user_id = :user_id", { user_id })
      .getOne();
  }

  //   insert 이후 hash 암호화
  // @BeforeInsert()
  // async saveEncryptedPassword() {
  //   console.log("[DEBUG] inside beforeinsert: user_pw:" + this.user_pw);
  //   this.user_pw = await bcrypt.hash(this.user_pw, 5);
  // }

  // input user_pw 와 this.user_pw 의 hash 값 비교
  comparePassword(user_pw: string): boolean {
    return bcrypt.compare(user_pw, this.user_pw);
  }
}
