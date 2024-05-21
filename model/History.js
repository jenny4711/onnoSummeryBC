const mongoose = require("mongoose")
const Schema = mongoose.Schema;
require('dotenv').config()

const historySchema = Schema({
  videoId:{
    type:String,
    required:true,
    
  },
  summaryORG:{
    type:String,
    required:true,
  },
  lang:{
    type:String,
    required:true,
  },
  ask:{
    type:String,
  },
  summary:{
    type:String,
    required:true,
  },
},{timestamps:true})
historySchema.method.toJSON=function(){
  const obj= this._doc;
  delete obj.__v;
  return obj;
}
const History = mongoose.model("History", historySchema);
module.exports = History;