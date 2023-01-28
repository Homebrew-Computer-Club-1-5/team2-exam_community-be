import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, JoinTable, AfterUpdate } from "typeorm"
import { User } from "./User"
import { Comment } from "./Comment"

@Entity('post')
export class Post extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    user_id:string
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
    like_user:string[]
    @Column()
    comment_num:number
    @Column()
    hide_user:boolean
    @ManyToOne(type=>User,user=>user.posts,{
        onDelete:'CASCADE',
    })
    @JoinTable()
    user_key:User;
    @OneToMany(type=>Comment,comment=>comment.post_key,{
        cascade:true,
    })
    comments:Comment[]

    static find_num(num:number) {
        return this.createQueryBuilder("post")
        .select()
        .where("post.num = ", {num})
        .getOne();
    }

}