import logo from './logo.svg';
import './App.css';
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
    let session = JSON.parse(localStorage.getItem('isLogged'));
    let savedSession = (session==null) ? false : session;
    setisLogged(savedSession);
    setTsToast(false)
  },[])

  function deployToast(message){
    let date = new Date()
    let formatDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`; 
    
    setMessageToast(message)
    setDateToast(formatDate)
    setTsToast(true)
  }
  function closeToast(){
    setTimeout(()=>{
      setTsToast(false);
      let a = document.getElementById("toast-check");
      a.checked = false;
    },500)
  }
  function beginSession(){
    setisLogged(true)
    localStorage.setItem("isLogged", true);
  }
  function closeSession(){
    setisLogged(false)
    localStorage.setItem("isLogged", false);
  }
  return (
    <div className="App">
      {(isLogged)? <Chat db={db} onSesionClose={closeSession} ></Chat> : 
        <Login db={db} onLogin={beginSession} onToast={deployToast}></Login>
      }

      {(isToast)?
      <div className="toast-body">
        <div className="toast-head">
          <img src={logo} className="icon-toast"></img>
          <small className="toast-title">React Chat</small>
          <small>{dateToast}</small>
          <label htmlFor="toast-check" className="close-toast">X</label>
          <input  id="toast-check"type="checkbox" onChange={closeToast} className="hiddenItem"></input>
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
