import React from "react";
import ChatBot from "react-chatbotify";

const MyChatBot = () => {


 
   
  
  async function run(userPrompt) {

    const token = localStorage.getItem("token");
     
  
    try{

      

      const response = await fetch("http://localhost:8000/api/bmi/generatedResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: userPrompt
          
        }),
      });
      if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
    } catch (error) {
      console.error("Error generating response:", error);
      return "There was an error generating the response. Please try again later.";
    }
   
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

  return <ChatBot flow={flow}  styles={{
      chatIconStyle: {
        backgroundColor: "#2f855a", // Change the background color
       
      },
      botBubbleStyle: {

        
      }
    }}  />;
};

export default MyChatBot;