require('dotenv').config();
const {JWT_SECRET}=require('../config/keys');
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const User =mongoose.model("User");

module.exports=((req,res,next)=>{

    const {authorization}=req.headers;
    console.log(req.headers);
    if(!authorization)
    {
       return res.redirect('/');
      return  res.json({error : "you must logged in.."});
    }
    const token= authorization.replace("Bearer ","");
     jwt.verify(token,JWT_SECRET,(err,payload)=>{
         if(err)
         {
          return  res.json({error : "you must logged in."});
         }
        const{_id} = payload;
   
            User.findById(_id).then(userdata=>{
                req.user=userdata;
                
                next();
            })
           
     })
    })
