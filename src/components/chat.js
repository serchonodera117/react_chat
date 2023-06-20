import React from 'react';
import Axios from 'axios';
import {useState, useEffect} from 'react';
import '../styles/main.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

function Chat({db}){
    const dataBase = db;
    return(
        <div className="chat">
            <div className="chat-container">
                my chat
            </div>
        </div>
    )
}

export default Chat;