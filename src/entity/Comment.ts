import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, CreateDateColumn, JoinTable } from "typeorm"
import { Post } from "./Post"
import { User } from "./User"

@Entity('comment')
export class Comment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(type=>Post,post=>post.comments,{
        onDelete:"CASCADE",
    })
    @JoinTable()    
    post_key:Post
    @Column()
    user_id:string
    @Column("text")
    content: string
    @CreateDateColumn()
    c_date:Date

	static find_post_key(post_key:number) {
        return this.createQueryBuilder("comment")
        .where("comment.post_key = :post_key", {post_key})
        .getMany();
        // .getManyAndCount();
    }
}