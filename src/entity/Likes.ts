// import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { User } from "./User";
// import { Post } from "./Post";


// @Entity('likes')
// export class Likes extends BaseEntity{
//     @PrimaryGeneratedColumn()
//     readonly id:number
//     @Column()
//     userId:number
//     @Column()
//     postId:number
//     @ManyToOne(()=>User,(user)=>user.likePost)
//     @JoinTable()
//     user:Promise<User>;
//     @ManyToOne(()=>Post,(post)=>post.likeUser)
//     @JoinTable()
//     post:Promise<Post>;
// }

