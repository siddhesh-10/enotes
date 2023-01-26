const express=require('express');
const app=express();
const PORT=process.env.PORT || 5000;
const mongoose=require('mongoose');
const {MONGOURI}=require('./config/keys');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connection.on('connected',()=>{
console.log("connected to mongo")
})
mongoose.connection.on('error',(error)=>{
console.log("error while connecting to mongo",error)
})
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://enotes-v71e.onrender.com/');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));
mongoose.connect(MONGOURI,{
    useNewUrlParser : true,
    useUnifiedTopology:true

});
if(process.env.NODE_ENV=="production"){
    app.use(express.static('../client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'../clientl','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})



