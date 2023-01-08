import { QueryExpressionMap } from "typeorm/query-builder/QueryExpressionMap"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { appendFile } from "fs"
import { application } from "express"
const express=require('express')
const app=express();
const path=require('path');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'../test1/build')));
app.use(express.json());
var cors = require('cors');
app.use(cors());
// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user) 
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))

const path_static="exam-student-community/build"

app.listen(8080,()=>{
    console.log('listening on 8080 port open !!!!')
})
app.get('/',(req,res)=>{
    // res.send('wellcome main page ~~')
    
})
app.get('/test',(req,res)=>{
    console.log(req.body.test)
    res.sendFile(path.join(__dirname, '../'+path_static+'/index.html'));
})
app.get('/test1',(req,res)=>{
    var aaa={name:"minseok",age:"26"};
    res.json({name:"minseok",age:"26"});
})

//login
app.get('/login',(req,res)=>{
    res.send('login')
})
app.post('/login',(req,res)=>{
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

