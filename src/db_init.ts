//db 생성
// CREATE DATABASE homebrew default CHARACTER SET UTF8;
//db drop
// DROP database homebrew;

import { QueryExpressionMap } from "typeorm/query-builder/QueryExpressionMap";
import { AppDataSource } from "./data-source";
import { Users } from "./entity/Users";
import { Posts } from "./entity/Posts";
import { Comments } from "./entity/Comments";
import { v4 as uuidv4 } from "uuid";
import { Newpw } from "./entity/Newpw";
import { Like } from "typeorm";
// import { Likes } from "./entity/Likes"
const admin = require("../config/admin.json");

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new user into the database...");
    const user = new Users();
    // user.uuid=uuidv4();
    user.name = "minseok";
    user.age = "3";
    user.email = "aaaaa@gmail.com";
    user.gender = "m";
    user.c_date = new Date();
    user.user_id = admin.ID;
    user.user_pw = admin.PW;
    await AppDataSource.manager.save(user);
    console.log("Saved a new user with id: " + user.id);
    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(Users);
    console.log("Loaded users: ", users);

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );

    //post
    const post = new Posts();
    // post.uuid=user.uuid
    post.user_id = admin.ID;
    post.user_name = user.name;
    post.title = "test1";
    post.c_date = new Date();
    post.m_date = new Date();
    post.num = 1;
    post.content = "testsetsetsetsetsetsetestsetset";
    post.click_num = 0;
    post.comment_num = 1;
    post.is_user_hid = false;
    post.user_key = user;
    await AppDataSource.manager.save(post);
    console.log("Saved a new post with id: " + post.id);

    console.log("Loading users from the database...");
    const posts = await AppDataSource.manager.find(Posts);
    console.log("Loaded posts: ", posts);
    //comment
    const comment = new Comments();
    // comment.uuid=user.uuid
    comment.c_date = new Date();
    comment.post_key = post;
    comment.post_id = post.id;
    comment.user_id = user.user_id;
    comment.user_name = user.name;
    comment.content = "test commnet";

    await AppDataSource.manager.save(comment);
    console.log("Saved a new post with id: " + comment.id);

    console.log("Loading comment from the database...");
    const comments = await AppDataSource.manager.find(Comments);
    console.log("Loaded comments : ", comments);

    const newpw = new Newpw();
    newpw.user_id = user.user_id;
    newpw.user_key = user.id;
    newpw.token = "aaaa";
    newpw.c_date = new Date();
    await AppDataSource.manager.save(newpw);

    // const like=new Likes()
    // like.postId=post.id
    // like.userId=user.id

    // await AppDataSource.manager.save(like)

    // await Likes.remove(like)
    await Newpw.remove(newpw);
  })
  .catch((error) => console.log(error));
