const authController={};
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET
authController.authenticate =async(req,res,next)=>{
  try{
    const tokenString = req.headers.authorization
    if(!tokenString) throw new Error('Token not found')
    const token = tokenString.replace("Bearer ","")
  jwt.verify(token,process.env.JWT_SECRET_KEY,(err,payload)=>{
    if(err) throw new Error('Invalid Token')
    req.userId=payload._id
  
  })

next()
  }catch(error){
    res.status(400).json({status:'fail',error:error.message})
  }
}

module.exports = authController;