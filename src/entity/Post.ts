import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm"
import { User } from "./User"
import { Comment } from "./Comment"

@Entity('post')
export class Post{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    user_name:string
    @Column()
    title:string
    @Column()
    c_date:Date
    @Column()
    m_date:Date
    @Column()
    num:number // 소속 게시판
    @Column("text")
    content:string
    @Column()
    like:number
    @Column()
    comment_num:number
    @ManyToOne(type=>User,user=>user.posts,{
        onDelete:'CASCADE',
    })
    user_key:User
    @OneToMany(type=>Comment,comment=>comment.post_key,{
        cascade:true,
    })
    comments:Comment[]
}