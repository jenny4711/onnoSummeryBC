const mongoose = require("mongoose")
const History=require('./History')
const Schema = mongoose.Schema;
require('dotenv').config()
const myHistorySchema = Schema({
  historyId:{
    type:mongoose.ObjectId,ref:History,

  },
  userEmail:{
    type:String,
    required:true,
  }
  

  },{timestamps:true})
  myHistorySchema.method.toJSON=function(){
    const obj=this._doc;
    delete obj.__v;
    return obj;
  }
  const MyHistory = mongoose.model("MyHistory",myHistorySchema);
  module.exports=MyHistory;