
const { createChatWithGoogle, translateResult ,articleSummaryAi,createSummeryWithGoogle} = require('../utils/ai');
const History = require('../model/History');
const User = require('../model/User');
const { Client } = require("youtubei");
const {YoutubeTranscript } = require("youtube-transcript");
const{searchApiCaption}=require('../utils/captions')
const transcriptCache = new Map();
const client = new Client();
const historyController = {};

const fetchTranscriptWithCaching = async (videoId) => {
  if (transcriptCache.has(videoId)) {
    return transcriptCache.get(videoId);
  }
  

  let transcript =await client.getVideoTranscript(videoId);
  if(!transcript){
  return   transcript = await searchApiCaption(videoId);
  
  }
   
  transcriptCache.set(videoId, transcript);
  console.log(transcriptCache,'cache')
  console.log(transcript,"SEARCHAPI!!!@@@@@@@@@@@@@@@@@@@@@@@@")
  return transcript;
};




async function saveSummary({ videoId, summaryORG, lang, ask, summary }) {
 
  try {
    const existingVideo = await History.findOne({ videoId, lang });
   console.log(existingVideo,'test!!!!!extTTTTTTTT!!!!!!')
    if (!existingVideo) {
      const newHistory = new History({
        videoId,
        summaryORG,
        lang,
        ask,
        summary,
      });
      await newHistory.save();
      return newHistory;
    } else {
      return existingVideo;
    }
  } catch (error) {
    console.log('Error in saveSummary:', error.message);
    throw new Error('Failed to save summary.');
  }
}

historyController.makeSummary = async (req, res) => {

  try {
    const { videoId, lang, ask, email } = req.body;
    

    if (!videoId) {
      return res.status(400).json({ message: 'VideoId is required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.credit <= 0) {
      throw new Error("Insufficient credit. Please recharge to continue." );
    }

    const existingVideo = await History.findOne({ videoId, lang });
    if (existingVideo) {
     
      return res.status(200).json({ data: existingVideo.summary,newHistory:existingVideo ,videoId });
    }
 
    const transcript= await fetchTranscriptWithCaching(videoId);
 
  
    
    if (!transcript || !Array.isArray(transcript)) {
      return res.status(404).json({ message: "Failed to retrieve transcript for the video." });
    }

    const texts = transcript.map(element => element.text);
    

    const summaryORG = await createChatWithGoogle(texts.join(' '), ask);
    if (!summaryORG) {
      throw new Error("AI couldn't generate a summary.");
    }

    const summary = await translateResult(summaryORG, lang);
    if (!summary) {
      return res.status(200).json({ data: summaryORG, videoId })
    }

    const newHistory = await saveSummary({ videoId, summaryORG, lang, ask, summary });
    // console.log('New summary created:', res);
    return res.status(200).json({ data: summary, videoId, newHistory });

  } catch (error) {
  
    console.log('Error in makeSummary:', error);
    res.status(400).json({ message: "The requested action cannot be processed as it violates our security policy. Please try a different request.", error:error });
  }
};

module.exports = historyController;