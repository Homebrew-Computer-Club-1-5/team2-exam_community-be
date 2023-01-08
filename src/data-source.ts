import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Comment } from "./entity/Comment"
import { Post } from "./entity/Post"
const db_config=require('../config/db-config.json') // db setting file

export const AppDataSource = new DataSource({
    type: db_config.type,
    host: db_config.host,
    port: db_config.port,
    username: db_config.user,
    password: db_config.password,
    database: db_config.database,
    synchronize: true,
    logging: false,
    entities: [User,Post,Comment],
    migrations: [],
    subscribers: [],
})
