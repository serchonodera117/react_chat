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
  const [db] = useState(database);
  const [isLogged, setisLogged] = useState(false)

  useEffect(()=>{
    let session = localStorage.getItem('isLogged');
    setisLogged(session != null? session : false);
  },[])

  return (
    <div className="App">
      {(isLogged)? <Chat db={db}></Chat>: <Login db={db}></Login>}
    </div>
  );
}

export default App;
