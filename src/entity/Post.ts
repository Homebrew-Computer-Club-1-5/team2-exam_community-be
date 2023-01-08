import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('post')
export class Post{
    @PrimaryGeneratedColumn()
    id: number

}