const express= require('express');
const app = express();
const mongoose= require('mongoose');
const session = require("express-session");
const nocache=require('nocache');
const path = require("path");
require("dotenv").config();

//Local Host
// mongoose.connect('mongodb://127.0.0.1:27017/Femme_Fatale',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });

//Atlas

mongoose.connect(`${process.env.MONGODB}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

app.use(session({
    secret:process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(nocache());

// for user route
const userRoute = require("./routes/userRoute");
app.use('/',userRoute);

// for admin route
const adminRoute = require("./routes/adminRoute");
app.use('/admin',adminRoute);

app.listen(3030, ()=>{
    console.log("Server is running on port:  http://localhost:3030");
});

