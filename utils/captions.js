
require('dotenv').config();
const axios = require('axios');

 const searchApiCaption =async(videoId)=>{

  try{
    const url = "https://www.searchapi.io/api/v1/search";
    const params = {
      "engine": "youtube_transcripts",
      "video_id": videoId,
      "lang":"ko",
      "api_key": process.env.SEARCHAPI_API_KEY,
    };

const res = await axios.get(url, { params });
console.log(res.data.transcripts,'res.data')
return res.data.transcripts;

  }catch(error){
    console.log(error,'error-searchApiCaption')
  }
}

module.exports ={searchApiCaption}