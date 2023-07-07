import React,{useState} from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Aske!",
      sender:"ChatGPT"
    }
  ]);

  const handleSend = async(message)=> {
     const newMessage = {
      message: message,
      sender:"user",
      direction:"outgoing"
     }
     
     const newMessages = [...messages,newMessage]

     setMessages(newMessages);

     setTyping(true);


     await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(ChatMessages) {

   let apiMessages = ChatMessages.map((messageObject) => {

    let role = "";
    if(messageObject.sender === "ChatGPT") {
        role = "assistant"
    } else {
      role = "user"
    }

    return {role: role, content: messageObject.message};
   });

   const systemMessage = {
    role: "system",
    content: "Explain all concepts like i am 8 years old child"
   }

   const apiRequestBody = {
    "model" : "gpt-3.5-turbo",
    "messages" : [systemMessage,...apiMessages]
   }

   await fetch ("https://api.openai.com/v1/chat/completions",{
     method : "POST",
     headers:{
      "Authorization": "Bearer " + API_KEY,
      "Content-Type" : "application/json"
     },
     body : JSON.stringify(apiRequestBody)
   }).then((data)=>{
    return data.json();
   }).then((data) =>{
     console.log(data);
     console.log(data.choices[0].message.content);
     setMessages([...ChatMessages,{
      message: data.choices[0].message.content,
            sender: "ChatGPT"
     }]);
     setTyping(false);
   });
  }
  return (
    <div className='App'>
      <h2>Unleash Conversational Intelligence</h2>
      <div style={{position:"relative",width:"600px",height:"600px",}}>
      <MainContainer style={{padding:"20px",borderRadius:"10px"}}>
        <ChatContainer>
          <MessageList scrollBehavior='smooth' typingIndicator={typing && <TypingIndicator content="Aske is Responding"/>}>
            {messages.map((message,i) => (
                <Message key={i} model={message}/>
            ))}
          </MessageList>
          <MessageInput placeholder='Type your Message here...' onSend={handleSend}/>
        </ChatContainer>
      </MainContainer>
      </div>    
    </div>
  )
}

export default App