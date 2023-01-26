import { QueryExpressionMap } from "typeorm/query-builder/QueryExpressionMap"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import {Post} from "./entity/Post"
import {Comment} from "./entity/Comment"
const admin = require('../config/admin.json')

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.name = "minseok"
    user.age = 25
    user.email="aaaaa@gmail.com"
    user.phone="01012341234"
    user.gender="m"
    user.c_date=new Date()
    user.user_id=admin.ID
    user.user_pw=admin.PW
    await AppDataSource.manager.save(user) 
    console.log("Saved a new user with id: " + user.id)
    
    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

    //post 
    const post=new Post()
    post.user_id=admin.ID
    post.title="test1"
    post.c_date=new Date()
    post.m_date=new Date()
    post.num=1
    post.content="testsetsetsetsetsetsetestsetset"
    post.click_num=0
    post.like=1
    post.comment_num=1
    post.hide_user=false
    post.user_key=user
    await AppDataSource.manager.save(post) 
    console.log("Saved a new post with id: " + post.id)
    
    console.log("Loading users from the database...")
    const posts = await AppDataSource.manager.find(Post)
    console.log("Loaded posts: ", posts)

    const comment=new Comment()
    comment.c_date=new Date()
    comment.post_key=post
    comment.user_id=user.user_id
    comment.content="test commnet"

    await AppDataSource.manager.save(comment) 
    console.log("Saved a new post with id: " + comment.id)
    
    console.log("Loading comment from the database...")
    const comments = await AppDataSource.manager.find(Comment)
    console.log("Loaded comments : ", comments)
    
}).catch(error => console.log(error))
