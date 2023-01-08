import { UsingJoinColumnOnlyOnOneSideAllowedError } from "typeorm";

const express=require('express')
const app=express();

app.listen(8080,()=>{
    console.log('listening on 8080 port open !!!!')
})

app.get('/',(req,res)=>{
    res.send('wellcome to main page')
})
