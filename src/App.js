import logo from './logo.svg';
import './App.css';
import Axios from 'axios';
import {useState, useEffect} from 'react';
import './styles/main.css';
import Login from './components/login';
import Chat from './components/chat';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  //your project credentials

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database =  getDatabase(app);

function App() {
  const [isToast, setTsToast] = useState(false)
  const [db] = useState(database);
  const [isLogged, setisLogged] = useState(false)
  const [dateToast, setDateToast] = useState("")
  const [messageToast, setMessageToast] = useState("")

  useEffect(()=>{
    let session = localStorage.getItem('isLogged');
    setisLogged(session != null? session : false);
    setTsToast(false)
  },[])

  function deployToast(message){
    let date = new Date()
    let formatDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`; 
    
    setMessageToast(message)
    setDateToast(formatDate)
    setTsToast(true)
  }
  function closeToast(){setTsToast(false);}

  return (
    <div className="App">
      {(isLogged)? <Chat db={db} ></Chat>: <Login db={db} onToast={deployToast}></Login>}


      {(isToast)?
      <div className="toast-body">
        <div className="toast-head">
          <img src={logo} className="icon-toast"></img>
          <small className="toast-title">React Chat</small>
          <small>{dateToast}</small>
          <button className="close-toast" onClick={closeToast}>X</button>
        </div>
        <hr></hr>
        <div className="toast-content">
          {messageToast}
        </div>
      </div>
        : <div></div>}
    </div>
  );
}

export default App;
