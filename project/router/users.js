const {User,validateuser} = require('../module/user'); 
const express = require('express');
const _=require('lodash');
const bcrypt = require('bcrypt');
const {UserOTPVarification,sendOTPEmail}= require('../module/userOtpVarification');
const router = express.Router();
const { result } = require('lodash');
const auth=require('../middleware/auths');

router.get('/mydetails',auth,async(req,res)=>{
    const user =await User.findById(req.user._id).select({tokens:0 ,password:0});
    res.send(user);
});
//                                                                   new user
router.post('/signup',async(req,res)=>{
    const { error }=validateuser(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    };
    let user= await User.findOne({$or : [{email:req.body.email},{phone:req.body.phone},{rollno:req.body.rollno}]});
    if(user){
        res.status(400).send("user already registered");
        return;
    }
    user= new User(_.pick(req.body,['name','hostel','rollno','phone','email','password']));
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt);
    user.varified=false;
    user= await user.save().then((result)=>{
        sendOTPEmail(result,res)
    });
    // res.send(_.pick(user,['name','rollno','email','hostel']));
});
 //                                                                      varify otp                                                                
router.post('/otpvarify',async(req,res)=>{
    let {userId,otp}=req.body;
    if(!userId || !otp){
        res.status(400).send('please completely fill the details');
        return;
    }
    const record=await UserOTPVarification.find({userId});
    if(!record){
        res.status(400).send("no record found");
        return;
    }
    const expireAt= record[0].expireAt;
    const hashotp=record[0].otp;

    if(expireAt<Date.now()){
        await UserOTPVarification.deleteMany({userId});
        res.send('otp has expired please resend otp');
        return;
    }
    validotp= await bcrypt.compare(otp,hashotp);
    if(!validotp){
        res.status(400).send("invalid otp please varify it again");
        return;
    }
    await User.updateOne({_id:userId},{varified:true});
    await UserOTPVarification.deleteMany({userId});
    res.json({
        status:"varified",
        message:"your account is varified successfully"
    });
});
//                                                              resend otp
router.post('/resendotp',async(req,res)=>{
    let{userId,email}=req.body;
    if(!userId || !email){
        res.status(400).send('please completely fill the details');
        return;
    }
    await UserOTPVarification.deleteMany({userId});
    sendOTPEmail({_id:userId,email},res);
    res.json({
        message:"otp resend successfully"
    });
})
module.exports =router; 