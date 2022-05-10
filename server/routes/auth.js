require('dotenv').config();
const express=require('express');
const { json } = require('express/lib/response');
const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");
const User=mongoose.model("User");
const router=express.Router();
const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require('../config/keys');
const requirelogin =require('../middleware/requirelogin');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} = require('../config/keys');
const crypto = require('crypto')
//
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

// router.get('/',(req,res)=>{

//   res.send("hello");

// })
//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
router.post('/signup',(req,res)=>{

    console.log("inserver")
    const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };
  const {name,email,password,url}=req.body;
 
  if(!(validateEmail(email)))
  {
      console.log("invalid email")
    return  res.status(422).json({error : "Invalid email"});
  }
  if(password.length <5) {
      console.log("l5")
    return res.status(422).json({error: "password is weak length should be greater than 5"});
}
  if(password.length >20) {
      console.log("l5")
    return res.status(422).json({error: "password is not valid"});
}
  if(name.length <2) {
      console.log("l5")
    return res.status(422).json({error: "name is not valid"});
}
  if(name.length >20) {
      console.log("l5")
    return res.status(422).json({error: "name is not valid"});
}
  if(!name || !password || !email)
  {
    console.log(req.body);
    return  res.status(422).json({error : "plese provide all details"});
  }
  else
  {
    // res.json({message : "signup succesful"});
    User.findOne({email : email}).
    then((savedUser)=>{
        if(savedUser)
        {
            res.status(422).json({error : "user already exists"});
        }
        bcrypt.hash(password,12).then(hashedpassword=>{
            const user=new User({
                email : email,
                name : name ,
                password : hashedpassword,
                url :url
            });
            user.save().then((users =>{
                res.status(200).json({message : "signup succesfully"});
            })).catch((err)=>{
                console.log(err);
            })
        })
       
        
    }).catch((err)=>{
        console.log(err);
    })

  }
})

router.post('/login',(req,res)=>{
    const {email,password}=req.body;
    
    if(!email || !password)
    {
       return res.status(422).json({error:"please fill all fields"});
    }
    User.findOne({email : email}).
    then(savedUser=>{
        if(!savedUser)
        {
         return    res.status(422).json({error:"Invalid email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(matched=>{
            if(matched)
            {
                //res.json({message : "sign in succesfully"})
                const token=jwt.sign({_id : savedUser._id},JWT_SECRET);
                const {_id,name,email,url}=savedUser;
                
            res.json({token,user :{_id,name,email,url}});
            }
            else
            {
                return    res.status(422).json({error:"Invalid email or password"}); 
            }
        })
        .catch(err=>{res.status(422).json({error:"Invalid email or password"});console.log(err);
            })
       
    })
})
router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
      if(err){
        res.json({error:"error"})
      }
      console.log("llll");
      const token = buffer.toString("hex")
      User.findOne({email:req.body.email})
      .then(user=>{
          if(!user){
              return res.json({error:"User dont exists with that email"})
          }
          else{

           // em6715.gmail.com
           //u25742986.wl237.sendgrid.net
          user.resetToken = token
          user.expireToken = Date.now() + 4800000;
          user.save().then((result)=>{
            console.log(result);
           // let link = "http://" + req.headers.host + "/api/auth/reset/" + user.resetPasswordToken;
                    const mailOptions = {
                        to: user.email,
                        from: "enoteskit@gmail.com",
                        subject: "Password change request",
                        html:`<p>You requested for password reset</p><h5>click in this <a href="${EMAIL}reset/${token}">link</a> to reset password in 30 minutes</h5>`
                    };
                    sgMail
                    .send(mailOptions)
                    .then((response) => {
                      res.json({message: 'A reset email has been sent to ' + user.email + '.'});
                      console.log(response[0].headers)
                    })
                    .catch((error) => {
                      console.error(error);
                      res.json({error: error.message});
                    })
                    // sgMail.send(mailOptions, (error, result) => {
                    //     if (error) return res.json({error: error.message});

                    //     res.json({message: 'A reset email has been sent to ' + user.email + '.'});
                    // });

              // transporter.sendMail({
              //     to:user.email,
              //     from:"no-replay@enotes.com",
              //     subject:"password reset",
              //     html:`
              //     <p>You requested for password reset</p>
              //     <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password in 30 minutes</h5>
              //     `
              // }).then(()=>{
              //   console.log("jkr");
              //   res.json({message:"please check your email"})
              // })
              // .catch((e)=>{
              //   console.log(e);
              //   res.json({error:e})
              // })
              
          })
          .catch((e)=>{
            console.log(e);
            res.json({error:"error."})
          })
        }

      })
  })
})

router.post('/new-password',(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
      if(!user){
          return res.status(422).json({error:"Try again session expired"})
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         user.password = hashedpassword
         user.resetToken = undefined
         user.expireToken = undefined
         user.save().then((saveduser)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
})

module.exports=router;