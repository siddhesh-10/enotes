require('dotenv').config();
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const requirelogin=require('../middleware/requirelogin');
const bcrypt=require("bcryptjs");
const User=mongoose.model("User");

const jwt=require("jsonwebtoken");
const JWT_SECRET=process.env.JWT_SECRET;


const Post=mongoose.model('Post');
const { Storage } = require('@google-cloud/storage');



router.get('/user/:id',requirelogin,(req,res)=>{
    
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name url")
         .populate("comments.postedBy","_id name url")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})




module.exports=router;