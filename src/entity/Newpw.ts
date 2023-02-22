import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

//user id email token date
@Entity("newpw")
export class Newpw extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | null;
  @Column()
  user_key: number;
  @Column()
  user_id: string;
  @Column()
  token: string;
  @CreateDateColumn()
  c_date: Date;
}
