// require('dotenv').config();
const mongoose= require('mongoose');
const Joi = require('joi');
// const config= require('config');
const jwt = require('jsonwebtoken'); 
const userschema=mongoose.Schema({
    name:{
        type:String,
        min:3,
        max:20,
        require:true,
    },
    rollno:{
        type:Number,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    hostel:{
        type:String,
        min:1,
        max:5,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
        min:5
    },
    varified:{
        type:Boolean
    },
    curr_token:{
        type:String,   
    }
});

userschema.methods.generateAuthToken = async function(){
    const token= jwt.sign({_id:this._id},process.env.JWT_PRIVATE_KEY);
    this.curr_token=token
    await this.save();
    return token;
}
const User=mongoose.model('user',userschema);
function validateuser(user){
    const schema=Joi.object({
        name: Joi.string().min(3).max(20).required(),
        hostel: Joi.string().min(1).max(5),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
        phone: Joi.string().required().min(10).max(12),
        rollno: Joi.string().required().min(9).max(10)
    });
    return schema.validate(user);
};

module.exports.User=User;
module.exports.validateuser=validateuser;