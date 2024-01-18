// const config= require('config');
const jwt = require('jsonwebtoken');

function auths(req,res,next){
    console.log('under the middleware');
    next();
};
function auth(req,res,next){
    const token=req.header('x-auth-token');
    if(!token){
        res.status(401).send('access denied no token provided');
        return;
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        req.user=decoded;
        next();
    }
    catch(ex){
        res.status(400).send('invilid user')
    }
}
module.exports=auths;
module.exports=auth;