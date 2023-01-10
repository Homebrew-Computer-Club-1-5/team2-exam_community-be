import { QueryExpressionMap } from "typeorm/query-builder/QueryExpressionMap"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import {Post} from "./entity/Post"
import {Comment} from "./entity/Comment"
import { appendFile } from "fs"
import { application } from "express"
import { DataSource } from "typeorm"
import { json } from "body-parser"

const post_list=require('../src/post_list.json')
const express=require('express')
const app=express();
const path=require('path');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'../test1/build')));
app.use(express.json());
var cors = require('cors');
app.use(cors());
const methodOverride=require('method-override');
app.use(methodOverride('_method'));


AppDataSource.initialize().then(async () => {


}).catch(error => console.log(error))


const path_static="exam-student-community/build"

app.listen(8080,()=>{
    console.log('listening on 8080 port open !!!!')
})
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '../'+path_static+'/index.html'));
})
//미들웨어 요청과 응답 사이에 실행 되는 코드 app.use 로 수행 시킨다
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const session=require('express-session');
app.use(session({secret: 'secret-code',resave:true,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'user_id',// form 의 name 값 과 같아야한다
    passwordField: 'user_pw',
    session: true,
    passReqToCallback: false,
},
    async (input_id,input_pw,done)=>{
        const login_user=await User.findOneBy({user_id:input_id})
        // no user
        if(login_user){  // 뭐가 있다면
            //check password  사용자 지정 repository 사용 맞으면 통과
            if(await login_user.comparePassword(input_pw)){ //같으면 통과
                return  done(null,login_user)
            }else{ // 틀리면 message 반환
                return done(null,false, {message: 'password error'})
            }    
        }else{
            return done(null,false)
        }
}))

//로그인 검사 미들 웨어
export function can_login(req,res,next){
    if(req.user){ // 유저 정보가 없으면
        next() // 통과 ㄱㄱ 구문
    }else{ //정보가 없으면 실행
        res.json({message:"password error"})// 바꾸기 로그인 페이지 리다이렉션
    }
}

//login
app.get('/login',(req,res)=>{
    res.send('login')
    //로그인 페이지 주기
})
app.post('/login',passport.authenticate('local',{
    failureRedirect:'/fail'
}),async (req,res)=>{ 
    res.json({message:"login good"})
})

// user info modify
app.get('/register',(req,res)=>{

})
app.post('/register',async (req,res)=>{
    const user = new User()
    user.name=req.body.name
    user.age=parseInt(req.body.age) 
    user.email=req.body.email
    user.phone=req.body.phone
    user.gender=req.body.gender
    user.c_date=new Date()
    user.user_id=req.body.user_id
    user.user_pw=req.body.user_pw
    await user.save()
    res.json({message:"register clear"})
})
// mypage update 해야함 
app.get('/mypage',can_login,async (req,res)=>{

})
app.post('/mypage',can_login, async (req,res)=>{
    
})


//게시판 보여주기
app.get('/list',(req,res)=>{
    // for()
    

    res.send('post ist page');
    //게시판 종류 페이지 게시판 목록 db 
})
//게시물 보여주기 clear
app.get('/list/:id',async(req,res)=>{
    var post_num=parseInt(req.params.id)
    const all_list=await Post.findBy({num:post_num})
    // 각 게시판의 게시물 db 
    res.status(201).json(all_list)
})
//게시물 보기 clear
app.get('/detail/:id',can_login,async (req,res)=>{
    var post_id=parseInt(req.params.id)
    
    const post_detail=await Post.findOneBy({id:post_id})
    const comment_detail=await Comment.findBy({post_key:req.params.id})
    res.json(post_detail,comment_detail); // 게시물 자료와 댓글 자료 같이 주기
})
//게시물 작성 페이지 요청
app.get('/detail',can_login,async(req,res)=>{
    
    // 선택 창 에서 선택한 게시판에  넣기 
    // 1, 게시판 종류 2, 제목 작성자 날짜 ...
})
app.post('/detail',can_login,async (req,res)=>{
    
    const NewPost = new Post()
    NewPost.user_name=req.body.user_name
    NewPost.title=req.body.title
    NewPost.c_date=new Date()
    NewPost.num=parseInt(req.body.num)
    NewPost.content=req.body.comment
    NewPost.click_num=parseInt(req.body.click_num)
    NewPost.like=parseInt(req.body.like)
    NewPost.comment_num=parseInt(req.body.comment_num)
    // 유저 정보 어떻게 함?
    // const create_user=await User.findOneBy{id:}
    NewPost.user_key=req.user.id // 이게 맞나?
    await NewPost.save()
    res.status(201).json({message:"post save"})

})
//게시물 삭제 clear
app.delete('/detail/:id',can_login,async(req,res)=>{
    var post_id=parseInt(req.params.id)
    const result=await Post.findOneBy({id:post_id})
    console.log('type '+typeof(result.user_key),typeof(req.user.id))
    if(result.user_key==req.user.id ){ // 게시물의 주인 키값과 유저 키 값이 같으면 삭제
        await result.remove()
        res.json({message:"delete clear"})
    }else{
        res.json({message:"delete fail no "})
    }
})
//게시물 수정
app.put('/detail/:id',can_login,async(req,res)=>{
    
    res.send('수정 완료')
})
app.get('/comment',can_login,async(req,res)=>{

})
//답글 작성
app.post('/comment',can_login,async(req,res)=>{
    const NewComment=new Comment()
    //반드시 답글 달때는 게시물 유일키도 같이 보내야함
    console.log(typeof("post_key type"+req.body.post_key))
    NewComment.post_key=req.body.post_key
    NewComment.user_id=req.body.user_id
    NewComment.content=req.body.comment
    NewComment.c_date=new Date()
})
app.delete('/comment',async(req,res)=>{
    var comment=parseInt(req.body.id)
    const comment_d=await Comment.findOneBy({id:comment})
    if(comment_d==req.user.user_id){
        await comment_d.remove()
        res.json({message: " delete comment"})
    }else{
        res.json({message: "don`t delete"})
    }
})


//세션 저장  user.id 로 세션 생성 후 저장 한다 user변수에 로그인 기능에서의 result가 들어간다
passport.serializeUser(function(user,done){
    done(null,user.id) // 세션 값생성후 사용자 브라우저의 쿠키에 값을 전송 한다
});
// 마이페이지 접속시 사용 세션 확인 구문  **user.id 가 아이디 변수에 들어간다**
passport.deserializeUser(function(re_id,done){ //세션 정보가 있다면 해당 유저의 추가 정보를 찯아 {} 반환
    async ()=> {
        const login_user:User=await User.findOneBy({user_id:re_id})
        if(!login_user){
            console.log('login error')
            done(null,{message:"no session"})
        }else{
            done(null,login_user)
        }
    }
    // db.collection('login').findOne({id: re_id},function(err,result){
    //     if(err) return console.log(err)  
    //     done(null,result) //찾은 정보를 전달
    // })
});//done(server err, 성시 데사용자 데이터 반환, 메시지)
