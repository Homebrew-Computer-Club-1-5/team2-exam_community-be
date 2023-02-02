import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";


@Entity('likes')
export class Likes extends BaseEntity{
    @PrimaryGeneratedColumn()
    readonly id:number
    @Column()
    userId:number
    @Column()
    postId:number
    @ManyToOne(()=>User,(user)=>user.likePost)
    @JoinColumn()
    user:Promise<User>;
    @ManyToOne(()=>Post,(post)=>post.likeUser)
    @JoinColumn()
    post:Promise<Post>;
}

