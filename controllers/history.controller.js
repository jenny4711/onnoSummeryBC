
const { createChatWithGoogle, translateResult ,articleSummaryAi,createSummeryWithGoogle} = require('../utils/ai');
const History = require('../model/History');
const User = require('../model/User');
const { Client } = require("youtubei");
const client = new Client();
const historyController = {};


historyController. articleSummery=async (req,res)=>{
  try{
    const {lang,url}=req.body;
    const articleSummery = await createSummeryWithGoogle(url,lang)
    console.log(articleSummery,'articleSummery!!!!!!!!!!!!!!!!  ')
  }catch(error){
    console.log(error,'error-articleSummery')
  }

}

async function saveSummary({ videoId, summaryORG, lang, ask, summary }) {
  try {
    const existingVideo = await History.findOne({ videoId, lang, ask });

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
      console.log('Video already exists in the history', videoId);
    }
  } catch (error) {
    console.error('Error in saveSummary:', error.message);
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
      return res.status(403).json({ message: "Insufficient credit. Please recharge to continue." });
    }

    const existingVideo = await History.findOne({ videoId, lang, ask });
    if (existingVideo) {
      console.log('Summary already exists, retrieving from history', videoId);
      return res.status(200).json({ data: existingVideo.summary, videoId });
    }

  
 
    const transcript = await client.getVideoTranscript(videoId);

  
    
    if (!transcript || !Array.isArray(transcript)) {
      return res.status(404).json({ message: "Failed to retrieve transcript for the video." });
    }

    const texts = transcript.map(element => element.text);
    console.log('Retrieved texts for summary:', texts);

    const summaryORG = await createChatWithGoogle(texts.join(' '), ask);
    if (!summaryORG) {
      throw new Error("AI couldn't generate a summary.");
    }

    const summary = await translateResult(summaryORG, lang);
    if (!summary) {
      throw new Error("Failed to translate the summary.");
    }

    const newHistory = await saveSummary({ videoId, summaryORG, lang, ask, summary });
    // console.log('New summary created:', res);
    return res.status(200).json({ data: summary, videoId, newHistory });

  } catch (error) {
    console.error('Error in makeSummary:', error.message);
    res.status(500).json({ message: "An error occurred while processing your request.", error: error.message });
  }
};

module.exports = historyController;