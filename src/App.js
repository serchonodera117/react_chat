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
  const [isToast, setTsToast] = useState()
  const [db] = useState(database);
  const [isLogged, setisLogged] = useState(false)
  const [dateToast, setDateToast] = useState("")
  const [messageToast, setMessageToast] = useState("")

  useEffect(()=>{
    let session = localStorage.getItem('isLogged');
    setisLogged(session != null? session : false);
    setTsToast(false)
  },[])

  function deployToast(title, message){
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
       <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
       <div className="toast-header">
           <img src={logo} className="rounded me-2 img-toast" alt="..."></img>
           <strong className="me-auto">Message: </strong>
           <small>{dateToast}</small>
           <button type="button" className="btn-close" onClick={closeToast}></button>
       </div>
       <div className="toast-body">
         {messageToast}
       </div>
       </div>
      : <div></div>}
    </div>
  );
}

export default App;
