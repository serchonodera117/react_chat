import React from 'react';
import {useState, useEffect} from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs} from "firebase/firestore";

import { signInWithEmailAndPassword } from "firebase/auth";
import defaultUserImage from '../images/default_userimg.png'
import '../styles/main.css';
import '../styles/login.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


function Login({db, onToast, onLogin}) {
    const [addUserData, setUserData] = useState({username:'', password:'', image:'', contacts:[], friend_requests:[]})
    const [photoName, setPhotoName] = useState("")
    const [loginData, setLoginData] = useState({username:'', password:''})
    const dataBase = db;

    useEffect(() => {
        setUserData({username:'', password:'', image:defaultUserImage, contacts:[], friend_requests:[]})
        setPhotoName("Profile_Pic(.png/.jpg/.gif/.webp)")
    },[])

    function activateToast(message){
        onToast(message.toString());
    }
    function photoSelected(e){
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () =>{
            let resultImage = reader.result;
            let photoName = e.target.files[0].name;
            setUserData(obj=>({...obj, image: resultImage}))
            setPhotoName(photoName)
        }
    }
    function writeUsername(e){
        let theUsername = e.target.value;
        setUserData(item=>({...item, username: theUsername}))
    }
    function writePassword(e){
        let thePassword = e.target.value;
        setUserData(item=>({...item, password: thePassword}))
    }

    async function registerUser(e){
        let db = getFirestore()
        e.preventDefault();
        try {
            const docRef =  await addDoc(collection(db,"users"), addUserData);
            let checkbox = document.getElementById("input-checkbox-changelogin")
            checkbox.checked = false;
            
            activateToast(`${addUserData.username} se ha registrado con éxito`)
            setUserData({username:'', password:'', image:defaultUserImage, contacts:[], friend_requests:[]})
            
        }catch(error){
            activateToast("Error al insertar usuario : ", error)
        }
    }

    function userNameLogin(e){
        let valueInput = e.target.value
        setLoginData(item=>({...item, username:valueInput}))
    }

    function passwordLogin(e){
        let valueInput = e.target.value
        setLoginData(item=>({...item, password:valueInput}))
    }

    async  function Logon(e){
        let db = getFirestore();
        e.preventDefault();
        try {
            const userCollections = collection(db,"users");
            const myQuery = query(userCollections, where("username", "==", loginData.username), where("password", "==", loginData.password))
            const request = await getDocs(myQuery)
            let userData;
            request.forEach((doc) => {
                userData = doc.data();
                userData.id = doc.id
            })
            localStorage.setItem("user", JSON.stringify(userData));
            if(userData!=null){
                onLogin()
                activateToast(`${userData.username} Bienvenido :3`)
            }else{
                activateToast("Usuario o contraseña invalidos U ,u")
            }
        } catch (error) {
            activateToast("Error al insertar usuario : ", error)
        }
    }
    return(
        <div className="login">
            <label htmlFor="input-checkbox-changelogin" className="floating-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
            </svg>
            </label>
            <input id="input-checkbox-changelogin" className='hiddenItem' type="checkbox"></input>
            
            <div className="cards-container">
                <div className="login-container">
                    <h1 className="title-login">LOGIN</h1>
                    <form className="login-form" onSubmit={Logon}>
                        <div className="form-row">
                            <label htmlFor="input-username">Username</label><br></br>
                            <input className='text-box-login' onChange={userNameLogin} id="input-username" type="text" value={loginData.username}></input>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className="form-row">
                            <label htmlFor="input-password">Password</label><br></br>
                            <input className='text-box-login' onChange={passwordLogin} id="input-password" type="passwprd" value={loginData.password} ></input>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <button type="submit" className="login-btn">GO</button>
                    </form>
                </div>


                <div className="register-container">
                    <h1 className="title-login">Add User</h1>
                    <br></br>
                    <form className="login-form" onSubmit={registerUser}>
                        <div className="form-row">
                            <img src={addUserData.image} className="img-profile-pic"></img>
                            <label htmlFor="input-img-user" className='btn-chose-img'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera2" viewBox="0 0 16 16">
                                    <path d="M5 8c0-1.657 2.343-3 4-3V4a4 4 0 0 0-4 4z"/>
                                    <path d="M12.318 3h2.015C15.253 3 16 3.746 16 4.667v6.666c0 .92-.746 1.667-1.667 1.667h-2.015A5.97 5.97 0 0 1 9 14a5.972 5.972 0 0 1-3.318-1H1.667C.747 13 0 12.254 0 11.333V4.667C0 3.747.746 3 1.667 3H2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1h.682A5.97 5.97 0 0 1 9 2c1.227 0 2.367.368 3.318 1zM2 4.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0zM14 8A5 5 0 1 0 4 8a5 5 0 0 0 10 0z"/>
                                </svg>
                            </label>
                            <br></br>
                            <input type="file"  className="hiddenItem" accept='.jpg, .png, .gif, .webp' id='input-img-user'  onChange={photoSelected}></input>
                            <br></br>
                            <label>{photoName}</label>
                        </div>
                        <br></br>
                        <div className="form-row">
                            <label htmlFor="input-add-username">Username</label><br></br>
                            <input className='text-box-login' id="input-add-username" type="text" onChange={writeUsername} value={addUserData.username}></input>
                        </div>
                        <br></br>
                        <div className="form-row">
                            <label htmlFor="input-add-password">Password</label><br></br>
                            <input className='text-box-login' id="input-add-password" onChange={writePassword} value={addUserData.password} type="passwprd"></input>
                        </div>
                        <br></br>
                        <button type="submit" className="login-btn">sign in</button>
                    </form>
                </div>
            </div>
            

        </div>
    )
}
export default Login;