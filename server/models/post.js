const mongoose=require('mongoose');
// const {MONGOURI}=require('./keys');

// mongoose.connect(MONGOURI,{
//     useNewUrlParser : true,
//     useUnifiedTopology:true

// });
const {ObjectId}=mongoose.Schema.Types;



const postSchema =new mongoose.Schema({
    title : {
        type :String,
        required :true
    },
    subject :{
        type :String,
        required :true
    },
    department :{
        type :String,
        required :true
    },
    desc :{
        type :String,
        required :true
    },
    url :{
        type :String,
        default :"default uri"
    },
    likes :[{type:ObjectId,ref:"User",unique : true}],
    comments :[{
         text:String,
         postedBy:{
            type:ObjectId,
            ref :"User"   
         }
        }],
    postedBy :{
         type:ObjectId,
         ref :"User"

    }

},
{ timestamps: true })

mongoose.model("Post",postSchema);
