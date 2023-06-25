import React from 'react';
import Axios from 'axios';
import {useState, useEffect} from 'react';
import '../styles/main.css';
import '../styles/chat.css';


import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

function Chat({db, onSesionClose}){
    const dataBase = db;
    const [userData, setUserData] = useState("")

    useEffect(()=>{
        let localUserData = JSON.parse(localStorage.getItem('user'))
        if(userData!==null){
          setUserData(localUserData)
        }
    },[]);
    function closeSession(){
        localStorage.removeItem('user')
        onSesionClose()
    }
    return(
        <div className="chat-component">
                <button className='btn-close-session' onClick={closeSession}>Close session</button>
            <div className="chat-container">
                <div className='contacts'>
                    <div className="head-contacts">
                        <img className='user-img'  src={userData.image}alt={userData.username + " "+ " profile image"}></img>
                        <input type="search" className="search-contact" placeholder='Search contacts. . .'></input>
                        <i className='icon-search'>
                        <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        </i>
                    </div>
                    <hr></hr>
                    <div className="body-contacts">
                        body
                        userData.contacts.forEach(item=[
                            list
                        ])
                    </div>
                </div>
                <div className='chat'>
                    chat
                </div>
            </div>
        </div>
    )
}

export default Chat;