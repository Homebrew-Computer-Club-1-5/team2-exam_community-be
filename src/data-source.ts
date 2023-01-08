import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
const db_config=require('../config/db-config.json') // db setting file

export const AppDataSource = new DataSource({
    type: "mysql",
    host: db_config.host,
    port: db_config.port,
    username: db_config.user,
    password: db_config.password,
    database: db_config.database,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
