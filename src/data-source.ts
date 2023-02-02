import "reflect-metadata"
import { BaseEntity, DataSource } from "typeorm"
import { User } from "./entity/User"
import { Comment } from "./entity/Comment"
import { Post } from "./entity/Post"
import { Newpw } from "./entity/Newpw"
import { Likes } from "./entity/Likes"

const db_config=require('../config/db-config.json') // db setting file

export const AppDataSource = new DataSource({
    type: db_config.type,
    host: db_config.host,
    port: db_config.port,
    username: db_config.user,
    password: db_config.password,
    timezone:"+09:00",
    database: db_config.database,
    synchronize: true,
    logging: false,
    entities: [User,Post,Comment,Newpw,Likes,BaseEntity],
    migrations: [],
    subscribers: [],
})
