const mongoose = require('mongoose');
const nodemailer =require('nodemailer');
const bcrypt = require('bcrypt');
const otpschema=mongoose.Schema({
    userId:String,
    otp: String,
    createdAt:Date,
    expireAt:Date
});
const UserOTPVarification=mongoose.model("userOTPVarification",otpschema);

// nodemailer                                                         send otp

const transporter=nodemailer.createTransport({
    service: "hotmail",
    auth:{
        user: "rohitgargbnl@outlook.com", 
        pass: "rohit1234567"
    }
});
const sendOTPEmail=async({_id,email},res)=>{
    const otp= `${Math.floor( 1000+ Math.random()*9000 )}`;
    const mailoptions={
        from:"rohitgargbnl@outlook.com",
        to: email,
        subject:"otp testing email",
        text:`otp for varification of your account is :- ${otp}   this otp will expire in 1 hour.`
    };
    const salt=await bcrypt.genSalt(10);
    const hashOTP=await bcrypt.hash(otp,salt);
    let newotpvarify=new UserOTPVarification({
        userId: _id,
        otp:hashOTP,
        createdAt:Date.now(),
        expireAt:Date.now()+3600000
    });
    newotpvarify=await newotpvarify.save(); 
    transporter.sendMail(mailoptions,function(err,info){
        if(err){
            console.log(err);
            return;
        }
        console.log("sent: "+ info.response);
        res.json({
            status: "pending",
            message: "varification otp email sent",
            data:{
                userid:_id,
                mail:email        
            }
        });
    });
};
module.exports.sendOTPEmail=sendOTPEmail;
module.exports.UserOTPVarification=UserOTPVarification; 