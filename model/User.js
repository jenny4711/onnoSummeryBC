require('dotenv').config();
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;
const jwt=require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = Schema({
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  picture:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
  
  },
  firstName:{
    type:String,
  },
  status:{
    type:String,
    default:'free'
  },
  refCode:{
    type:String,
  },
  myRef:{
    type:Array,
  },
  lang:{
    type:String,
    default:'English'
  },
  promptStyle:{
    type:String
    
  },
  credit:{
    type:Number,
    
  },
  myHistory:{
    type:Array,
  },active:{
    type:Boolean,
  }
},{timestamps:true});
userSchema.methods.toJSON=function(){
  const obj = this._doc
  delete obj.password
  delete obj.__v
  return obj
}


userSchema.methods.generateToken= async function() {
  const token = await jwt.sign({id:this.id},JWT_SECRET_KEY,{
    expiresIn:'1d'
  
  });
  return token;
}

const User = mongoose.model('User',userSchema);
module.exports = User;