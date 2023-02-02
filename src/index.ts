import { QueryExpressionMap } from "typeorm/query-builder/QueryExpressionMap";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { Comment } from "./entity/Comment";
import { Newpw } from "./entity/Newpw";
// import { Request, Response, application } from "express";
import {
  DataSource,
  EntityManager,
  EntitySchemaEmbeddedColumnOptions,
  UpdateQueryBuilder,
} from "typeorm";
import { isArrayBuffer } from "util/types";
import {
  allowedNodeEnvironmentFlags,
  disconnect,
  resourceUsage,
} from "process";
import { userInfo } from "os";
import { resourceLimits } from "worker_threads";
import { generateKey } from "crypto";
import { v4 as uuidv4 } from "uuid";
import moment = require("moment-timezone");
import { NodeMailer } from "./utils/node-mailer";

const getTime = () => {
  var m = moment().tz("Asia/Seoul");
  return m.format("YYYY-MM-DD HH:mm:ss");
};
// const temp=new Date()
// const cur=newDate

var typeorm = require("typeorm");
var EntitySchema = typeorm.EntitySchema;
const express = require("express");
var cors = require("cors");
const app = express();
app.use(
  cors({
    orgin: "*",
    credential: true,
  })
);
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require("path");
app.use(express.static(path.join(__dirname, "../test1/build")));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const dotenv = require("dotenv");
const cokie = require("cookie-parser");
const admin_info = require("../config/admin.json");

AppDataSource.initialize()
  .then(async () => {})
  .catch((error) => console.log(error));

const path_static = "exam-student-community/build";

app.listen(8080, () => {
  console.log("listening on 8080 port open !!!!");
});
app.get("/", (req, res) => {
  res.json({ message: "main page / !!" });
  // res.sendFile(path.join(__dirname, '../'+path_static+'/index.html'));
});

//미들웨어 요청과 응답 사이에 실행 되는 코드 app.use 로 수행 시킨다
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "user_id", // form 의 name 값 과 같아야한다
      passwordField: "user_pw",
      session: true,
      passReqToCallback: false,
    },
    async (input_id, input_pw, done) => {
      // const login_user=await User.findOneBy({user_id:input_id})
      const login_user = await User.findbyid(input_id);
      console.log(login_user);
      // no user
      if (login_user) {
        // 뭐가 있다면
        //check password  사용자 지정 repository 사용 맞으면 통과
        if (await login_user.comparePassword(input_pw)) {
          //같으면 통과
          return done(null, login_user);
        } else {
          // 틀리면 message 반환
          console.log("비번 다름");
          return done(null, false, { message: "password error" });
        }
      } else {
        console.log("id 없음");
        return done(null, false, { message: "id error" });
      }
    }
  )
);

//로그인 검사 미들 웨어
function can_login(req, res, next) {
  if (req.user) {
    // 유저 정보가 없으면
    next(); // 통과 ㄱㄱ 구문
  } else {
    //정보가 없으면 실행
    res.json({ message: "session error" }); // 바꾸기 로그인 페이지 리다이렉션
  }
}

//login
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/fail_login", // fail시 api 호출
  }),
  async (req, res) => {
    console.log(req.user);
    var res_user = req.user;
    res_user.user_pw = ""; // 중요한 pw값은 넘기지 않겠다는 마음으로
    res.json(res_user);
  }
);

// app.post('api/login',function(req,res,next){
//     passport.authenticate("local",function(req,res,info){
//         if (err) return next(err);
//         if (user){
//             req.logIn(user,(err)=>{
//                 if(err)return next(err);
//                 var res_user=user;
//                 res_user.pw=""
//                 res.json({info:{message:"유저 맞음"},res_user})
//             })
//         }else{
//             res.json({info:info})
//         }
//     })(req,res,next)
// })

app.get("/fail_login", (req, res) => {
  res.status(500).json({ message: "login fail " });
});

app.get("/user", can_login, (req, res) => {
  console.log(req.user);
  console.log(req.user.id);
  res.json(req.user.id);
});
app.get("/login", can_login, async (req, res) => {
  const user = req.user.id;
  try {
    const find_user = await User.findOne({ where: { id: user } });
    console.log("find_user " + find_user);
    if (req.user.id == find_user.id) {
      res.json({ isAuthenticated: true, username: req.user.name });
    } else {
      res.json({ isAuthenticated: false });
    }
  } catch (err) {
    console.log("로그인 정보 없음");
  }
});

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//중복 아이디 입니다
app.post("/id_compare", async (req, res) => {
  const user_input = req.body.user_id;
  console.log(user_input);
  const compare_user = AppDataSource.getRepository(User);
  const us = await compare_user.findOne({ where: { user_id: user_input } });
  if (us) {
    res.json({ boo: false });
  } else {
    res.json({ boo: true });
  }
});
//id find
app.post("/find_id", async (req, res) => {
  const phone_num = req.body.phone;
  const user = await User.findOneBy({ phone: phone_num });
  console.log("find user id");
  res.json(user.user_id);
});
//new pw create
//토큰 생성해서 사용자의 메일이나 전화 번호 로 값을 보내고 인증 받는다
//1 암호화 해댜한다 2 암호화가 자동으로 가능 하다 insertAfter 때문에
app.post("/new_creat_pw", async (req, res) => {
  //유저정보
});

//회원정보 요청
app.get("/register", can_login, async (req, res) => {
  const user = await User.findOneBy({ id: req.user.id });
  user.user_pw = ""; // user pw 중요한건 넘기지 않겠다는 마음
  res.json(user);
});

app.post("/register", async (req, res) => {
  const user = new User();
  // user.uuid=uuidv4();
  user.name = req.body.name;
  user.age = req.body.age;
  user.email = req.body.email;
  user.phone = req.body.phone;
  user.gender = req.body.gender;
  user.c_date = new Date();
  user.user_id = req.body.user_id;
  user.user_pw = req.body.user_pw;
  await user.save();
  console.log("[DEBUG]:signup success");
  res.json({ message: "register clear" });
});
app.delete("/register", can_login, async (req, res) => {
  console.log("remove user");
  await User.remove(req.user);
});
// mypage update 해야함
app.post("/mypage", can_login, async (req, res) => {
  const up_user = AppDataSource.getRepository(User);
  await up_user
    .createQueryBuilder()
    .update(User)
    .set({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      m_date: new Date(),
    })
    // .set(req.body) 이렇게 해도 괜찮아
    .where({ id: req.user.id })
    .execute()
    .then((data) => {
      console.log("update user" + data);
      res.json(data);
    })
    .catch((err) => {
      console.log("update user error " + err);
      res.json(err);
    });
});
app.get("/mypost", can_login, async (req, res) => {
  const mypost = AppDataSource.getRepository(Post);
  const post = await mypost.find({
    where: {
      user_id: req.user.user_id,
    },
    order: {
      c_date: "DESC",
    },
  });
  if (post) {
    console.log("my post 성공 ");
    res.json(post);
  } else {
    res.json({ message: "mypost fail" });
  }
});
app.get("/mycomment", can_login, async (req, res) => {
  const mycomment = AppDataSource.getRepository(Comment);
  const comment = await mycomment.find({
    where: {
      user_id: req.user.user_id,
    },
    order: {
      c_date: "DESC",
    },
  });
  if (comment) {
    console.log("my post 성공 ");
    res.json(comment);
  } else {
    res.json({ message: "mypost fail" });
  }
});

//게시판 보여주기
app.get("/blogs", async (req, res) => {
  const postsql = AppDataSource.getRepository(Post);
  var arr = [];
  //1 자유게시판
  var post_num = [1, 2, 3, 4]; // post_num[0]은 1부터 시작 한다
  for (let i = 0; i < post_num.length; i++) {
    console.log(post_num);
    arr[i] = await postsql.findAndCount({
      where: {
        num: post_num[i],
      },
      order: {
        c_date: "DESC", // 내림차순으로 나중에 만든거 부터
      },
      skip: 0,
      take: 4,
      // cache:true, // 캐시 할건지
    });
  }
  console.log(arr);
  res.json(arr);
  //게시판 종류 페이지 게시판 목록 db
});
//게시물 보여주기 clear
// AppDataSource
app.get("/blogs/:id", async (req, res) => {
  var num_id: number = parseInt(req.params.id);
  console.log(num_id);
  const post_list = AppDataSource.getRepository(Post);
  await post_list
    .findAndCount({
      where: { num: num_id },
      order: { c_date: "DESC" },
    })
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.log("error" + err);
      res.json({ message: "wow sad" });
    });
});
//게시물 보기 clear
app.get("/detail/:id", async (req, res) => {
  var post_id = parseInt(req.params.id);
  console.log(req.params.id);
  console.log(typeof req.params.id);
  const post_detail = await Post.findOneBy({ id: post_id });
  //조회수 1증가

  post_detail.click_num = post_detail.click_num + 1;
  await Post.save(post_detail); //저장
  // const post_comments=await Comment.findAndCount({post_key:post_detail.id})
  const post_comments = await Comment.find_post_key(post_id);
  console.log(post_detail);
  console.log(post_comments);

  var Ruser_id = "";
  if (post_detail.hide_user == true) {
    // 유저가 숨기기 원하면 넘기기전에 아이디를 수정 해서 리턴
    Ruser_id = post_detail.user_id;
    post_detail.user_id = "cloaking";
  }
  res.json({ post_detail, post_comments });
  //요청자가 작성자이면
  // if(req.user.user_id==Ruser_id){
  //     var message={msg:'myPost'}
  //     res.json({post_detail,post_comments,message})
  // }else{
  //     res.json({post_detail,post_comments})
  // }
});


app.post('/detail',can_login,async (req,res)=>{
    const NewPost = new Post()
    // NewPost.uuid=req.user.uuid;
    NewPost.user_id=req.user.user_id
    NewPost.user_name=req.user.user_name
    NewPost.title=req.body.title
    NewPost.c_date=new Date()
    NewPost.num=parseInt(req.body.num)
    NewPost.content=req.body.content
    NewPost.click_num=0
    NewPost.comment_num=0
    NewPost.user_key=req.user.id // 이게 맞나? => 맞다 ^^^^^^^^^
    NewPost.hide_user=false
    await NewPost.save()
    console.log(NewPost)
    res.status(201).json({message:"post save"})

app.post("/detail", can_login, async (req, res) => {
  const NewPost = new Post();
  // NewPost.uuid=req.user.uuid;
  NewPost.user_id = req.user.user_id;
  NewPost.title = req.body.title;
  NewPost.c_date = new Date();
  NewPost.num = parseInt(req.body.num);
  NewPost.content = req.body.content;
  NewPost.click_num = 0;
  NewPost.comment_num = 0;
  NewPost.user_key = req.user.id; // 이게 맞나? => 맞다 ^^^^^^^^^
  NewPost.hide_user = false;
  await NewPost.save();
  console.log(NewPost);
  res.status(201).json({ message: "post save" });
});
//게시물 삭제 clear
app.delete("/detail/:id", can_login, async (req, res) => {
  var post_id = parseInt(req.params.id);
  var result = new Post();
  result = await Post.findOneBy({ id: post_id });
  if (result.user_id == req.user.user_id) {
    // 게시물의 주인 아이디 값과 유저 아이디 값이 같으면 삭제
    var com = await Comment.find({ where: { user_id: result.user_id } }); //댓글 삭제
    if (com) {
      // 나중에 조건을 안에 comment_num 을 넣어서 댓글 확인하고 조회하면 더좋은 성늘 을 가질것
      Comment.remove(com); //  댓글 있으면 삭제
    }
    await result.remove();
    res.json({ message: "delete clear" });
  } else {
    res.json({ message: "delete fail no " });
  }
});
// 이건 무슨 기능???
app.get("/finduser", async (req, res) => {
  const user = await User.findOne({ where: { id: 1 } });
  const post = await Post.findAndCount({ where: { id: 1 } });
  console.log(user, post);

  res.json({ message: "end" });
});

app.get("/modify/:id", can_login, async (req, res) => {
  const up_post = AppDataSource.getRepository(Post);
  const post = await up_post.find({
    where: { id: parseInt(req.params.id) },
  });
  if (post) {
    res.json(post);
  } else {
    res.json({ massage: "fail post" });
  }
});
//게시물 수정
app.put("/detail/:id", can_login, async (req, res) => {
  const up_post = AppDataSource.getRepository(Post);
  const post = await Post.findOneBy({ id: parseInt(req.params.id) });
  console.log("before post" + post);
  if (req.user.user_id == post.user_id) {
    await up_post
      .createQueryBuilder()
      .update(Post)
      .set(req.body) // 만약 안되면 값을 겍체로 하나하나 씩 설정 하기
      .where({ id: parseInt(req.params.id) })
      .execute()
      .then((data) => {
        res.json(data);
        console.log("update post" + data);
      })
      .catch((err) => {
        console.log("update error " + err);
        res.json(err);
      });
  }
});

//답글 작성
//보내줘 post_key , content
app.post('/comment',can_login,async(req,res)=>{
    const NewComment=new Comment()
    // NewComment.uuid=req.user.uuid;
    //반드시 답글 달때는 게시물 유일키도 같이 보내야함
    console.log(typeof("post_key type"+req.body.post_key))
    NewComment.post_id=req.body.post_key
    NewComment.post_key=req.body.post_key 
    NewComment.user_id=req.user.user_id 
    NewComment.user_name=req.user.name
    NewComment.content=req.body.content
    NewComment.c_date=new Date()
    await NewComment.save()
    //update post coment_num++
    // const like=await Post.findOneBy({id:req.body.post_key})
    // like.like_up();// 하나증가
    // 하나 증가
    var post=new Post()
    post = await Post.findOneBy({id:req.body.post_key})
    post.comment_num=post.comment_num+1;
    await Post.save(post)
    res.json({message:"comment save"})
})
//보내줘 coment id 값 
app.delete('/comment/:id',can_login,async(req,res)=>{
    var comment=parseInt(req.params.id)
    const comment_d=await Comment.findOneBy({id:comment})
    if(comment_d.user_id==req.user.user_id){
        //update post coment_num--
        var post=new Post()
        post = await Post.findOneBy({id:req.body.post_key})
        post.comment_num=post.comment_num-1;
        await Post.save(post)
        await comment_d.remove()
        res.json({message: " delete comment"})
    }else{
        res.json({message: "don`t delete"})
    }
})

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ where: { id } });
    console.log("find user, create session" + user);
    if (!user) {
      console.log("no user");
      return done(null, { message: "no user" });
    } else {
      console.log("login good");
      return done(null, user);
    }
  } catch (err) {
    console.error(err);
    return done(err);
  }
});

//새로운 이메일 받고 조회 -> 그유저 id email 를 newpw 에넣고 토큰값도 넣고 **** 여기 api에서 메일 날려야함 ****
app.post("/api/newpw", async (req, res) => {
  let i_email = req.body.email;
  let i_id = req.body.id;
  let user = await User.findOne({ where: { email: i_email, user_id: i_id } });
  //TODO: newpw 부분 정리하기

  var newpw = await Newpw.findOne({ where: { user_email: i_email } });
  const nodeMailer = new NodeMailer();
  // baseEntity .save는 기존것이 있으면 업데이트 없으면 생성
  let i_token = await rand();
  if (user) {
    if (newpw != null) {
      newpw.token = i_token;
      newpw.c_date = new Date();
      await newpw.save();
      let nodeMaileSuccessJson = await nodeMailer.send_password_set_email(
        i_email,
        i_token
      );
      console.log("[DEBUG] send_again:" + nodeMaileSuccessJson);
      res.send(nodeMaileSuccessJson);
    } else {
      let newpw = new Newpw();
      newpw.user_key = user.id;
      newpw.user_email = i_email;
      newpw.token = i_token;
      newpw.c_date = new Date();
      await newpw.save(); // 일정시간이 지나면 삭제 해야하는것이 좋을듯
      let nodeMaileSuccessJson = nodeMailer.send_password_set_email(
        i_email,
        i_token
      );
      console.log("[DEBUG] node_mailer:" + nodeMaileSuccessJson);
      res.send(nodeMaileSuccessJson);
    }
  } else {
    res.send({ success: false, message: "user not found" });
  }
});

//  새로운 비번 email id 토큰  put 사용해서 토큰비교후 유저 비번 수정 하고 newpw 삭제
app.put("/api/newpw", async (req, res) => {
  // 토큰으로 조회 ,newpw 에 없는경우
  var i_token = req.body.token;
  var i_pw = req.body.pw;
  var newpw = await Newpw.findOne({ where: { token: i_token } }); //토큰으로 조회 있으면 수정하려하는 사람이니깐
  if (newpw == null) {
    res.json({ succes: false, message: "token wrong or missed" });
  } else {
    var user = await User.findOne({ where: { id: newpw.user_key } }); // user id 조회
    user.user_pw = i_pw; //변경
    user.saveEncryptedPassword(); // 이거하면 다시 객체 비번 hash ㄱㄱ 이거 될디 모르겠어 한번 해봐야함
    await user.save();
    await Newpw.remove(newpw); // 완료후 삭제
    res.json({ success: true, message: "new create pw " });
  }
});
async function rand(): Promise<string> {
  var RandomValue = Math.random().toString(36).slice(2);
  return RandomValue;
}
