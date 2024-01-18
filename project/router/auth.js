const {User} = require('../module/user');
const express = require('express');
const _=require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const Joi =require('joi');


router.post('/',async(req,res)=>{
    const { error }=validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return; 
    };
    let regex = new RegExp('[a-z0-9]+@thapar.edu');
    if(!regex.test(req.body.email)){
        res.status(400).send("only for thapar students");
        return;
    };
    const user= await User.findOne({$and : [{email:req.body.email},{rollno:req.body.rollno}]});
    if(!user){
        res.status(400).send("invalid email or password");
        return;
    }
    const validpass= await bcrypt.compare(req.body.password,user.password);
    if(!validpass){
        res.status(400).send("invalid email or pass");
        return; 
    }
    const token= await user.generateAuthToken(); 
    res.header('x-auth-token',token).send("successfully login");
    // res.send(token);

});
function validate(req){
    const schema=Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
        rollno: Joi.string().required().min(9).max(10)
    });
    return schema.validate(req);
};
module.exports =router;