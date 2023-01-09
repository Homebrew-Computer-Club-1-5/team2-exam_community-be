import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Post } from "./Post"
import { User } from "./User"

@Entity('comment')
export class Comment{
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(type=>Post,post=>post.comments,{
        onDelete:"CASCADE",
    })
    post_key:Post
    @Column()
    user_id:string
    @Column("text")
    content: string
    @Column()
    c_date:Date
}