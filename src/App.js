import logo from './logo.svg';
import './App.css';
import Axios from 'axios';
import {useState, useEffect} from 'react';
import './styles/main.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>deploy test xd</p>
      </header>
    </div>
  );
}

export default App;
