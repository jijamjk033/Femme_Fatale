const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
       
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    walletBalance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
      },
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0
    },
    referralCode: {
        type: String,
        unique: true,
    },
    userReferred: [{
        type: String,
    }]
    
    });


    userSchema.virtual('referralLink').get(function () {
        // Replace 'yourwebsite.com' with your actual website URL
        const baseUrl = ' http://localhost:3030';
        return `${baseUrl}/register?ref=${this.referralCode}`;
      });

module.exports = mongoose.model("User",userSchema);