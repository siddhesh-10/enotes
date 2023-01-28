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



router.get('/allpost',requirelogin,(req,res)=>{//for all posts
Post.find().populate('postedBy','_id name url').
then(posts=>{
   res.json({posts : posts})
}).catch(err=>
{
    console.log(err);
})
})
router.get('/mypost',requirelogin,(req,res)=>{//for user posts
Post.find({postedBy : req.user._id}).populate('postedBy','_id name url')
.populate("comments.postedBy","_id name url")
.sort('-createdAt')
.then(posts=>{
   res.json({posts : posts})
}).catch(err=>
{
    console.log(err);
})
})


router.post('/post',requirelogin,(req,res)=>{
    const {title,body}=req.body;
    if(!title || !body)
    {
      return  res.status(422).json({error:"please provide all details"})
    }
   req.user.password=undefined;
  const post=new Post({
      title : title,
      body :body,
      postedBy :req.user
  })
  console.log("here");
  post.save().then(result=>{
      res.status(200).json({post:result});
  }).catch(error=>{
      console.log(error);
  })
})
router.post('/createposts', requirelogin, (req, res) => {
    console.log("inserver");
    try {
        const {title,subject,desc,url,department}=req.body;
        const {_id,name,email}=req.user;
        const post =new Post({
            title :title,
            subject:subject,
            department:department.value,
            desc:desc,
            url:url,
            postedBy:{
                _id,
                name,
                email
            }
        });
        console.log(post);
        post.save().then((posts =>{
            res.status(200).json({message : "posted succesfully"});
        })).catch((err)=>{
            console.log(err);
            res.status(400).json({error : err});
        })
      } catch (error) {
        res.status(422).json({error : "Error, could not upload file"});
        return;
      }
    });

router.get('/homes',requirelogin,(req,res)=>{
    console.log("in home")
    Post.find().populate('postedBy','_id name url')
    .populate("comments.postedBy","_id name url")
    .sort('-createdAt')
    .then(posts=>{
   res.json({posts : posts})
}).catch(err=>
{
    console.log("here in get home");
    console.log(err);
})
})
router.get('/search/:dept',requirelogin,(req,res)=>{
    
    Post.find({department:req.params.dept}).populate('postedBy','_id name url')
    .populate("comments.postedBy","_id name url")
    .sort('-createdAt')
    .then(posts=>{
   res.json({posts : posts})
}).catch(err=>
{
    console.log("here in get home");
    console.log(err);
})
})
router.get('/searchs/:sub',requirelogin,(req,res)=>{
    
    Post.find({subject:req.params.sub}).populate('postedBy','_id name url')
    .populate("comments.postedBy","_id name url")
    .sort('-createdAt')
    .then(posts=>{
        
   res.json({posts : posts})
}).catch(err=>
{
    console.log("here in get home");
    console.log(err);
})
})
router.post('/search-sub',requirelogin,(req,res)=>{
    let subPattern=new RegExp("^"+req.body.query);
    Post.find({subject:{$regex:subPattern}})
    .select("_id subject")
    .then((result)=>{
        res.json({post:result});
    })
    .catch((err)=>{
        res.status(422).json({error : "Error"}); 
    })
})

router.put('/like',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true //new updated record
    })
    .populate('postedBy','_id name url')
    .populate("comments.postedBy","_id name url")
    .exec((err,result)=>{
         if(err)
         {
             console.log(err);
            res.status(422).json({error : "Error"});
        return;
         }
         else
         {
            res.json(result);
         }
    })
})
router.put('/unlike',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true //new updated record
    })
    .populate('postedBy','_id name url')
    .populate("comments.postedBy","_id name url")
    .exec((err,result)=>{
         if(err)
         {
            res.status(422).json({error : "Error"});
        return;
         }
         else
         {
            res.json(result);
         }
    })
})
router.put('/comment',requirelogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true //new updated record
    }).populate("comments.postedBy","_id name url")
    .populate('postedBy','_id name url').
    exec((err,result)=>{
         if(err)
         {
            res.status(422).json({error : "Error"});
        return;
         }
         else
         {
            res.json({result});
         }
    })
})

router.delete('/deletepost/:postId',requirelogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate('postedBy','_id name url')
    .populate("comments.postedBy","_id name url")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})
router.post('/changepic',requirelogin,(req,res)=>{
    const {id,url}=req.body;
    console.log(id);
    console.log(url);
    console.log("kk");
    if(!id || !url)
    {
       return res.status(422).json({error:"pic not updated"});
    }
    User.findOneAndUpdate({_id : id},{url : url}).
    then(savedUser=>{
        if(!savedUser)
        {
         return    res.status(422).json({error:"pic not updated"});
        }
        else
        {
    User.findOne({_id : id}).
    then(savedUser=>{
        if(!savedUser)
        {
         return    res.status(422).json({error:"pic not updated"});
        }
        
                
                
          return  res.json(savedUser);
            
        })
        .catch(err=>{res.status(422).json({error:"pic not updated"});console.log(err);
            })
        }
        })
   })

// router.delete('/deletecomment/:cId',requirelogin,(req,res)=>{
//     Post.findOne({_id:req.params.cId})
//     .populate("postedBy","_id")
//     .exec((err,post)=>{
//         if(err || !post){
//             return res.status(422).json({error:err})
//         }
//         if(post.postedBy._id.toString() === req.user._id.toString()){
//               post.remove()
//               .then(result=>{
//                   res.json(result)
//               }).catch(err=>{
//                   console.log(err)
//               })
//         }
//     })
// })

module.exports=router;