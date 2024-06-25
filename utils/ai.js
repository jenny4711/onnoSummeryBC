//Summarize the following into two sentences at the 12th grade level:
//방법-Summeraize following in a step-by-step format,providing clear instructions on how to complete a task or achieve a goal.
//스토리형식-Summarize following in a narrative format, capturing the key events, characters, and plot points in a concise and engaging way.
const { GoogleGenerativeAI ,HarmBlockThreshold,HarmCategory} = require("@google/generative-ai");
const OpenAI = require('openai');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY1;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const safetySettings = [
  {
  category: HarmCategory.HARM_CATEGORY_HARASSMENT,
  threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
  category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
  category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
  category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
  threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  ];

  const generationConfig = {
    temperature: 0,
    topK: 1,
    topP: 1,
    maxOutputToken:400,
    };
  
  

const createChatWithGoogle = async (prompt, ask,lang) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"},safetySettings ,generationConfig);
console.log('askCreateChatWithGoogle')
  //------------------------------------------------------------------------------------------------
  const result = await model.generateContentStream(`${ask}  ${prompt} `);

  let text = '';
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    console.log(chunkText);
    text += chunkText;
  }
                                                                                                                                                           
console.log('text!!!!!!!!coming!!!!!!!!!!!!!!!!!!!!')
  return text;
};

const translateResult = async (story, lang) => {
  console.log('story!!!!!!!!!!!!!!!!translateResult!!!!!!!!!!!!');
  try{
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"},safetySettings ,generationConfig);
    const result = await model.generateContentStream(`You are a ${lang} interpreter.Please translate this ${story} into ${lang} and make it easier to understand.`);
    console.log(result,'result!!!!!!!!!')
return result;
  }catch(error){
    console.log('Error:', error, 'error=translateResult');
    console.error('Error creating chat completion:', error);
  }
  // try {
  //   const response = await openai.chat.completions.create({
  //     model: 'gpt-3.5-turbo',
  //     messages: [
  //       { role: 'system', content: `You are a ${lang} interpreter.` },
  //       { role: 'user', content: `Please translate this ${story} into ${lang} and make it easier to understand.  ` },
  //     ],
  //   });
  
  //   return response.choices[0].message.content;
  // } catch (error) {
  //   console.error('Error creating chat completion:', error);
  // }
};
//----------------------------------------

const articleSummaryAi = async (url, lang) => {
  console.log(url,'url!!!',lang,'lang!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are a ${lang} interpreter and content summarization expert .` },
        { role: 'user', content: `Please read this article ${url} and summarize the key points in ${lang} in a way that's easy to understand. ` },
      ],
    });
    console.log('articleSummeryAi!!!!!!!!');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error creating chat completion:', error);
  }
};


const createSummeryWithGoogle = async (url, lang) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro"},safetySettings ,generationConfig);

  //------------------------------------------------------------------------------------------------
  const result = await model.generateContentStream(`Please read this article ${url} and summarize the key points in ${lang} in a way that's easy to understand. `);

  let text = '';
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    console.log(chunkText);
    text += chunkText;
  }
                                                                                                                                                           
console.log('createSummeryWithGoogle')
  return text;
};


module.exports = { createChatWithGoogle, translateResult,articleSummaryAi,createSummeryWithGoogle };