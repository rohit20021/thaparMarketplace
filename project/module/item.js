const mongoose= require('mongoose');
const Joi = require('joi');
const { string } = require('joi');

const itemschema=mongoose.Schema({
    name:{
        type:String,
        min:3,
        max:40,
        require:true,
    },
    quantity:{
        type:Number,
        min:1,
        max:20,
        default:1
    },
    price:{
        type:Number,
        min:0,
        max:20000,
        require:true
    },
    description:{
        type:String,
        require:true,
        min:10,
        max:2000
    },
    time:{
        type:String,
    },
    user_id:{
        type:String,
        require:true
    }
});
const Item=mongoose.model('item',itemschema);

function validateitem(item){
    const schema=Joi.object({
        name: Joi.string().min(3).max(40).required(),
        description: Joi.string().required().min(10).max(20000),
        time: Joi.string(),
        quantity: Joi.number().min(1).max(20),
        price: Joi.number().required().min(0).max(20000)
    });
    return schema.validate(item);
};

module.exports.Item=Item;
module.exports.validateitem=validateitem;