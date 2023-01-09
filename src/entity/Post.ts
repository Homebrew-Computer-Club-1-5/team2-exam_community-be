import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"
import { User } from "./User"
import { Comment } from "./Comment"

@Entity('post')
export class Post extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    user_name:string
    @Column()
    title:string
    @CreateDateColumn()
    c_date:Date
    @UpdateDateColumn()
    m_date:Date|null;
    @DeleteDateColumn()
    d_date:Date|null;
    @Column()
    num:number // 소속 게시판
    @Column("text")
    content:string
    @Column()
    click_num:number
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