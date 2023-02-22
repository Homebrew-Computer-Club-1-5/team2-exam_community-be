import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
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
  createdDTTM: Date;

  @UpdateDateColumn()
  updatedDTTM: Date;

  @DeleteDateColumn()
  deletedDTTM: Date | null;

  async saveLike(like, postId, userId) {
    const date = new Date();
    const newLike = new Likes();
    console.log("[DEBUG] like:" + like);
    if (like) {
      console.log("[DEBUG] im in saveLike not null");
      newLike.updatedDTTM = date;
      newLike.deletedDTTM = null;
      //TODO: deletedDTTM은 안쓰면 자동으로 null이 되나?
    } else {
      console.log("[DEBUG] im in saveLike null");
      newLike.userId = userId;
      newLike.postId = postId;
      newLike.createdDTTM = date;
      newLike.updatedDTTM = date;
    }
    newLike
      .save()
      .then(() => {
        console.log("[DEBUG] newlike save success");
      })
      .catch((err) => {
        console.log("[DEBUG] newlike save error:" + err);
      });
  }

  async deleteLike(like: Likes) {
    await Likes.softRemove(like);
  }

  static async countLikes(postId: number): Promise<number> {
    const [_, likesCount] = await Likes.findAndCount({
      where: { postId: postId, deletedDTTM: null },
    });
    return likesCount;
  }

  static async checkIfUserLikes(postId: number, userId: number) {
    const like = await Likes.findOne({
      where: { postId: postId, userId: userId },
    });
    let doesUserLike: boolean = like && like.deletedDTTM == null ? true : false;
    return { doesUserLike, like };
  }

  //like를 넣거나 삭제한 다음 user가 like한 상태인지 전달
  static async postLike(postId: number, userId: number): Promise<boolean> {
    let { doesUserLike, like } = await this.checkIfUserLikes(postId, userId);

    let likes = new Likes();
    if (doesUserLike) {
      console.log("[DEBUG] im in postlike bool true");
      await likes.deleteLike(like);
    } else {
      console.log("[DEBUG] im in postlike bool false");
      await likes.saveLike(like, postId, userId);
    }
    return !doesUserLike;
  }
}
