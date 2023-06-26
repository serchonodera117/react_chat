import React from 'react';
import {useState, useEffect} from 'react';
import '../styles/main.css';
import '../styles/chat.css';

import defaultImage from '../images/default_userimg.png'
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, limit,
     getDocs } from "firebase/firestore";
import select from "firebase/firestore"


function Chat({db, onSesionClose}){
    const dataBase = db;
    const [userData, setUserData] = useState("")
    const [searchWebUsers, setSearchWebUsers] = useState("")
    const [webListUsers, setWebListUsers] = useState([])

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

    function writeSearch(e){
        let textQuery = e.target.value;
        setSearchWebUsers(textQuery)

        if(textQuery.trim()){
            searchNewUsers()
        }
        else{
            clearSearch()
        }
    }
   async function searchNewUsers(){
         let textQuery = searchWebUsers
        let myDB = getFirestore()
        const userCollections = collection(myDB,"users");
        const myQuery = query(userCollections, where("username", ">=", textQuery),
                     limit(10))
        
        try{
            let QuerySnapshot = await getDocs(myQuery)
            let users = []
                 QuerySnapshot.forEach((doc)=>{
                    let user = doc.data();
                        user.id = doc.id;
                        let obj = {
                            id: user.id,
                            username: user.username, 
                            image: user.image, 
                            contacts: user.contacts,
                            friend_requests: user.friend_requests
                        }
                        users.push(obj)
                  })
            setWebListUsers(users)
        }catch(error){
            setWebListUsers([])
            console.error("error al buscar usuarios:", error)
        }
    }
    function clearSearch(){
        setSearchWebUsers("")
        setWebListUsers([])
    }

    async function getAllUsers(){
        let myDB = getFirestore()
        const userCollections = collection(myDB,"users");
        const myQuery = query(userCollections)
        console.log(webListUsers)
        try{
            let QuerySnapshot = await getDocs(myQuery)
            let users = []
                QuerySnapshot.forEach((doc)=>{
                    let user = doc.data();
                        user.id = doc.id;
                        let obj = {
                            id: user.id,
                            username: user.username, 
                            image: user.image, 
                            contacts: user.contacts,
                            friend_requests: user.friend_requests
                        }
                        users.push(obj);
                  })
                  console.log(users);
                  setWebListUsers(users)
        }catch(error){
            setWebListUsers([])
            console.error("error al buscar usuarios:", error)
        }
    }
    return(
        <div className="chat-component">
            <button className='btn-close-session' onClick={closeSession}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-door-open-fill" viewBox="0 0 16 16">
                    <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                </svg>
                <span>
                    Close session
                </span>
            </button>

      {/* MODAL SEARCH USERS */}
            <input id="search-modal-activator" className='hiddenItem' type="checkbox"></input>
            <div className='modal-container'>
                <div className='modal-header'>
                    <img src={defaultImage} className='img-modal'></img>
                    <h2>Search User</h2>
                    <label htmlFor='search-modal-activator' className='btn-close-modal'> X </label>
                </div>
                <hr></hr>
                <div className='modal-body'>
                    <div className='modal-search-box'>
                        <input type='search'  onChange={writeSearch} className='search-contact' placeholder='search contacts'></input>
                        <button onClick={getAllUsers} className='btn-search-all'>All</button>
                    </div>
                    <br></br>
                    <div className='modal-list'>
                        {
                            webListUsers.map((user, index) =>(
                                <div className='web-card-body' key={index}>
                                    <img className='img-web-search' src={user.image}></img>
                                    <label className='web-username'>{user.username}</label>
                                    <button className='btn-send-request'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-add" viewBox="0 0 16 16">
                                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                        <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
                                    </svg>
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
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
                        <label className="search-new-friend" htmlFor='search-modal-activator'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe2" viewBox="0 0 16 16">
                                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/>
                            </svg>
                        </label>
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