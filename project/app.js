require('dotenv').config()
const error=require('./middleware/error');
const mongoose =require('mongoose');
const express= require('express');
const auth=require('./router/auth');
const users= require('./router/users');
const items= require('./router/items');
const home= require('./router/home');
// const config= require('config');

process.on('uncaughtException',(ex)=>{
    console.log('we go an uncaught exception');
    process.exit(1);
});

process.on('unhandledRejection',(ex)=>{
    console.log('we go an unhandled Rejection');
    process.exit(1);
});

// if(!config.get('JWT_PRIVATE_KEY')){
// console.error("falet error, jwtprivatekey is not defined");
// process.exit(1);
// }
mongoose.connect('mongodb://localhost:27017/thaparolx')
.then(()=> console.log('connected to mongodb !!!'))
.catch(err => console.error("could not connect to mongodb",err))
const app = express();
//                                                  if you want to stop services of server 

// app.use((req,res,next)=>{
//     res.status(503).send('servise is under mantianance try back soon');
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users',users); 
app.use('/api/items',items); 
app.use('/api/auth',auth);
app.use('/api/home', home);
app.use(error);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));