import React from "react";
import ChatBot from "react-chatbotify";

const MyChatBot = () => {
  const nutritionContext =
    "You are a nutritionist. All questions and answers should be related only to food.";
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCE2XFM6jP6Z4Fz5X2FlD7do0hTzSLSL5g"
  );
  
  async function run(userPrompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });    
    const fullPrompt = nutritionContext + "\n" + userPrompt;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }

  const flow = {
    start: {
      message: "EasyAssistant. I am your personal nutritionist! How can i help you ",
      path: "model_loop",
    },
    model_loop: {
      message: async (params) => {
        return await run(params.userInput);
      },
      path: "model_loop",
    },
  };

  return <ChatBot flow={flow} />;
};

export default MyChatBot;