import React from "react";
import '../styles/main.css';
import '../styles/chat_messages.css';

import {useState, useEffect} from 'react';
import { getFirestore, collection, addDoc, query, where, limit,
    getDocs,getDoc , doc, runTransaction, onSnapshot} from "firebase/firestore";

function ChatMessageComponent({dataContact}){
    const [message, setMessage] = useState("")
    const [contactData, setContactData] = useState("")

    const objContact={
        chat_id: dataContact.chat_id,
        date_time_message: dataContact.date_time_message,
        id:dataContact.id,
        image:dataContact.image,
        last_messge: dataContact.last_messge,
        missing_messages: dataContact.missing_messages,
        username: dataContact.username
    }

    // useEffect(()=>{
    //     if(dataContact.id){
    //         getMessages(dataContact.id)
    //         setContactData(objContact)
    //     }
    // },[])
    // function getMessages(id){
    //     console.log("geting messages from", id, "...")
    // }
    function writeMessage(e){
        let checkBtn = document.getElementById("display-send-button")
        let inputMessage = e.target.value;
        setMessage(inputMessage)

        checkBtn.checked = (!inputMessage.trim())? false: true
    }
    function sendMessage(){
        let checkBtn = document.getElementById("display-send-button")
        setMessage("")
        checkBtn.checked = false
    }
   function sendMessageByEnter(e){
    if(message.trim() && e.key=="Enter"){
        sendMessage()
    }
   }
    return(
        <div className="chat-component-container">
            <div className="chat-message-container">
                <div className="chat-header">
                    <img src={objContact.image} className="img-user" alt={objContact.username +".img"}></img>
                    <br></br>
                    <span className="user-name">{objContact.username}</span>
                </div>
                <div className="chat-body">body messages</div>
                <div className="chat-foter-text">
                    <div className="box-send-content">
                        <input type="text" className="input-messages" onChange={writeMessage} onKeyDown={sendMessageByEnter} value={message} placeholder="write your message here. . ."></input>
                        <button className="send-message" onClick={sendMessage}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                        </svg>
                        </button>
                        <input id="display-send-button" type="checkbox" className="display-button hiddenItem"></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatMessageComponent;