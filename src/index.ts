import { QueryExpressionMap } from "typeorm/query-builder/QueryExpressionMap"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import {Post} from "./entity/Post"
import {Comment} from "./entity/Comment"
import { appendFile } from "fs"
import { application } from "express"
const admin=require('../config/admin.json')
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


const path_static="exam-student-community/build"

app.listen(8080,()=>{
    console.log('listening on 8080 port open !!!!')
})
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '../'+path_static+'/index.html'));
})
app.get('/test',(req,res)=>{
    console.log(req.body.test)
    res.sendFile(path.join(__dirname, '../'+path_static+'/index.html'));
})
app.get('/test1',(req,res)=>{
    var aaa={name:"minseok",age:"26"};
    res.json({name:"minseok",age:"26"});
})

// //미들웨어 요청과 응답 사이에 실행 되는 코드 app.use 로 수행 시킨다
// const passport=require('passport');
// const LocalStrategy=require('passport-local').Strategy;
// const session=require('express-session');
// app.use(session({secret: 'secret-code',resave:true,saveUninitialized:false}));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy({
//     usernameField: 'user_id',// form 의 name 값 과 같아야한다
//     passwordField: 'user_pw',
//     session: true,
//     passReqToCallback: false,
// },function(input_id,input_pw,done){ //input_id pw 는 입력한 값이다 
//     console.log(input_id,input_pw);
//     db.collection('login').findOne({id: input_id },function(err,result){
//         console.log(result);
//         if(err) return done(err) // err가 있으면 
//         if(!result) return done(null,false,{message: '존재하지 않는 아이디요'}) //result 가 null이면 
//         if(input_pw == result.pw){ // 찾은 정보의 비번이랑 입력 한 비번이 다르면
//             return  done(null,result)
//         } else{
//             return done(null,false, {message: 'password error'})
//         }
//     })
// }));
// //로그인 검사
// function can_login(req,res,next){
//     if(req.user){ // 유저 정보가 없으면
//         next() // 통과 ㄱㄱ 구문
//     }else{ //정보가 없으면 실행
//         res.send('로그인 필요 합니다')// 바꾸기 로그인 페이지 리다이렉션
//     }
// }

//login
app.get('/login',(req,res)=>{
    res.send('login')
    //로그인 페이지 주기
})
app.post('/login',(req,res)=>{ 
    var ID= req.body.user_id
    var PW= req.body.user_pw
    console.log(ID,PW)

    res.send('login good')
})

// user info modify
app.get('/register',(req,res)=>{

})
app.post('/register',(req,res)=>{

})
// mypage
app.get('/mypage',(req,res)=>{

})
// app.post('/mypage',())

// 게시판 생성
app.get('/create_list',(req,res)=>{
    //게시판 이름 
})
app.post('/create_list',(req,res)=>{
    res.send('게시판 생성')
})
//게시판 보여주기
app.get('/list',(req,res)=>{
    res.send('post ist page');
    //게시판 종류 페이지 게시판 목록 db 
})
//게시물 보여주기
app.get('/list/:id',(req,res)=>{
    var id=req.params.id;
    // 각 게시판의 게시물 db 
    res.send('** 게시판')
})
//게시물 보기
app.get('/detail/:id',(req,res)=>{
    // id 게시물 id
    res.send('detail');
})
//게시물 작성
app.get('/detail',(req,res)=>{
    res.send('write')
})
app.post('/detail',(req,res)=>{
    // 선택 창 에서 선택한 게시판에  넣기 
    // 1, 게시판 종류 2, 제목 작성자 날짜 ...
})
//게시물 삭제
app.delete('/detail/:id',(req,res)=>{
    res.send('삭제완료')
})
//게시물 수정
app.put('/detail/:id',(req,res)=>{
    res.send('수정 완료')
})

