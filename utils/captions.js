
require('dotenv').config();
const axios = require('axios');


const findLanguage=async(videoId)=>{
  try{
    const url = "https://www.searchapi.io/api/v1/search";
const params = {
  "engine": "youtube_video",
  "video_id": videoId,
  "api_key": process.env.SEARCHAPI_API_KEY2,
};

    const res = await axios.get(url, { params });
console.log(res.data.available_transcripts_languages,'res.data')
return res.data.available_transcripts_languages;
  }catch(error){
    console.log(error,'error-findLanguage')
  }
}

 const searchApiCaption =async(videoId)=>{

  try{
    const lang=await findLanguage(videoId);
    const url = "https://www.searchapi.io/api/v1/search";
    const params = {
      "engine": "youtube_transcripts",
      "video_id": videoId,
   "lang": lang[0].lang,
      "api_key": process.env.SEARCHAPI_API_KEY,
    };

const res = await axios.get(url, { params });

return res.data.transcripts;

  }catch(error){
    console.log(error,'error-searchApiCaption')
  }
}



module.exports ={searchApiCaption}