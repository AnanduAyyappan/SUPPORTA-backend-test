const mongoose=require('mongoose')
require('dotenv').config()

const connectionstring=process.env.DBCONNECTIONSTRING

mongoose.connect(connectionstring).then(res=>{
console.log("MongoDB atlas connected succesfully with SSERVER");

}).catch(err=>{
    console.log("MongoDB atlas connection failed");
    console.log("this is string",connectionstring);
    console.error("Error details:", err);
})