require('dotenv').config()
const express=require('express')
const cors=require('cors')
const router=require('./router/route')
require('./database/databaseConnection')






const SServer=express()

SServer.use(cors())
SServer.use(express.json())
SServer.use(router)
SServer.use('/uploads',express.static('./uploads'))




  
 

const PORT=process.env.PORT || 3000 



  
  



SServer.listen(PORT,()=>{
    console.log(`My CEServer in port: ${PORT} and waiting for client request!!!....`);
    console.log("DB Connection String:", process.env.DBCONNECTIONSTRING);

})

SServer.get('/',(req,res)=>{
    res.status(200).send('<h1 style="color:red;">Hi,My SServer in port and waiting for client request!!!....</h1>')
    console.log("DB Connection String:", process.env.DBCONNECTIONSTRING);
})

SServer.post('/',(req,res)=>{
    res.status(200).send('POST REQUEST')
    console.log("DB Connection String:", process.env.DBCONNECTIONSTRING);

})


