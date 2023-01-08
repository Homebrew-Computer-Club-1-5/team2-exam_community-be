import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number
    @Column() // 컬럼 명을 ()안에 넣어도 괜찮은가?
    name: string
    @Column()
    age: number
    @Column()
    email:string
    @Column()
    phone:string
    @Column()
    gender:string
    @Column()
    c_date:Date
    @Column()
    user_id:string
    @Column()
    user_pw:string
}
