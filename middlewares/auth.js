const User = require("../model/userModel");

const isLogin = async(req,res,next)=>{
    
    try{
        const userData = await User.findOne({ _id: req.session.user_id });
        if(req.session.user_id && userData.is_admin==0){
        next();

        }else{
            res.redirect('/');
        } 

    }catch(error){
        console.log(error.message);
    }

}

const isLogout = async(req,res,next)=>{
    
    try{
        const userData = await User.findOne({ _id: req.session.user_id });
        if(req.session.user_id && userData.is_admin==0){
            res.redirect('/home');
        }
        else{
        next();

        }

    }catch(error){
        console.log(error.message);
    }

}

module.exports ={
    isLogin,
    isLogout
}
