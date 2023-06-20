import React from 'react';
import Axios from 'axios';
import {useState, useEffect} from 'react';
import '../styles/main.css';
import '../styles/login.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


function Login({db}) {
    const dataBase = db;


    return(
        <div className="login">
            <label htmlFor="input-checkbox-changelogin" className="floating-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
            </svg>
            </label>
            <input id="input-checkbox-changelogin" className='hiddenCheckbox' type="checkbox"></input>
            
            <div className="login-container">
                <h1 className="title-login">LOGIN</h1>
                <form className="login-form">
                    <div className="form-row">
                        <label htmlFor="input-username">Username</label><br></br>
                        <input className='text-box-login' id="input-username" type="text"></input>
                    </div>
                    <br></br>
                    <div className="form-row">
                        <label htmlFor="input-password">Password</label><br></br>
                        <input className='text-box-login' id="input-password" type="passwprd"></input>
                    </div>
                    <br></br>
                    <button type="submit" className="login-btn">GO</button>
                </form>
            </div>
            
            <div className="register-container">
                <h1 className="title-login">Add User</h1>
                <form className="login-form">
                    <div className="form-row">
                        <label htmlFor="input-username">Username</label><br></br>
                        <input className='text-box-login' id="input-username" type="text"></input>
                    </div>
                    <br></br>
                    <div className="form-row">
                        <label htmlFor="input-password">Password</label><br></br>
                        <input className='text-box-login' id="input-password" type="passwprd"></input>
                    </div>
                    <br></br>
                    <button type="submit" className="login-btn">GO</button>
                </form>
            </div>
        </div>
    )
}
export default Login;