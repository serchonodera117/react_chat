import React from 'react';
import {useState, useEffect} from 'react';
import '../styles/main.css';
import '../styles/chat.css';

import defaultImage from '../images/default_userimg.png'
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, limit,
     getDocs,getDoc , doc, runTransaction, onSnapshot} from "firebase/firestore";
import select from "firebase/firestore"

import clock from "../images/clock.gif";
import bgIcon from "../images/background_icon.png"

function Chat({db, onSesionClose, onToast}){
    const dataBase = db;
    const [userData, setUserData] = useState("")
    const [searchWebUsers, setSearchWebUsers] = useState("")
    const [webListUsers, setWebListUsers] = useState([])
    const [contactDataID, setContactDataID] = useState([])

//---------------------------------------------Listening
listeningRequests()
listeningContacts()
//-----------------------------------------end Listening


    useEffect(()=>{
        let localUserData = JSON.parse(localStorage.getItem('user'))
        if(userData!==null){
          getUserData(localUserData.id)
        }
    },[]);
   async function getUserData(id){
        let myDB = getFirestore();
        let myDoc = doc(myDB, "users", id)
        try{
            let querySnapshot = await getDoc(myDoc) 
            if(querySnapshot.exists()){
                const data = querySnapshot.data()
                let arrayid= new Map()
                data.id = querySnapshot.id
                setUserData(data)
                data.contacts.forEach((item)=>{
                    arrayid.set(item.id,item.username)
                })
                setContactDataID(arrayid)
            }

        }   catch(error){
            console.error("no se pudieron traer los datos", error);
        }  
    }
    function closeSession(){
        localStorage.removeItem('user')
        onSesionClose()
    }
    function writeMessage(message){
        onToast(message)
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
                  setWebListUsers(users)
        }catch(error){
            setWebListUsers([])
            console.error("error al buscar usuarios:", error)
        }
    }

    async function sendRequest(id_Friend, user){
        let idFriend = id_Friend;
        let myDB = getFirestore()
        let btn = document.getElementById(idFriend);
        const userRef = doc(myDB, 'users', idFriend);

        let myUserProfile = {
            id: userData.id,
            username: userData.username, 
            image: userData.image 
        }

        try{
            await runTransaction(myDB, async(transaction) =>{
                const userSnapshot = await transaction.get(userRef);
                const friendUserData = userSnapshot.data()

                friendUserData.friend_requests.push(myUserProfile)
                transaction.update(userRef, {friend_requests: friendUserData.friend_requests})
                writeMessage(`Friend request to ${user} successfully sent`)
            })

            btn.innerHTML=`
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-gear" viewBox="0 0 16 16">
                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Zm9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
              </svg>
            `
            btn.disabled = true
        }catch(error){
            writeMessage("error sending friend request: " + error)
        }
    }


    async function deleteFriendRequest(id_user_request, accepted, deleted, clock_id){
        let btn_accept = document.getElementById(accepted)
        let btn_delete = document.getElementById(deleted)
        let clock_icon = document.getElementById(clock_id)
        btn_accept.disabled = true;
        btn_delete.disabled = true;
        btn_accept.style.backgroundColor = "#767a77"
        btn_delete.style.backgroundColor = "#767a77"
        clock_icon.style.display = "block"

        let myDB = getFirestore();
        let userRef = doc(myDB, "users", userData.id)
        try{
            await runTransaction(myDB, async(transaction)=>{
                const userSnapshot = await transaction.get(userRef);
                let myData = userSnapshot.data()
                let arrayRequests = myData.friend_requests
                let index = arrayRequests.findIndex(item => item.id == id_user_request)
                arrayRequests.splice(index,1)
                transaction.update(userRef, {friend_requests: arrayRequests})
            })
        }catch(error){
            console.error("error al enviar solicitud: " + error)
        }
    }

    async function acceptRequest(infoUser){
        const obj = {...infoUser}
        let btn_accept = document.getElementById(obj.accepted)
        let btn_delete = document.getElementById(obj.deleted)
        let clock_icon = document.getElementById(obj.clock_id)
        btn_accept.disabled = true;
        btn_delete.disabled = true;
        btn_accept.style.backgroundColor = "#767a77"
        btn_delete.style.backgroundColor = "#767a77"
        clock_icon.style.display = "block"


        let myDB = getFirestore();
        let myUserRef = doc(myDB, "users", userData.id)
        let friendRef = doc(myDB, "users", obj.id_user_request)

        try{
            deleteFriendRequest(obj.id_user_request, obj.accepted, obj.deleted, obj.clock_id)
            createChat().then(idChat =>{
                if(idChat && idChat !== null && idChat!== undefined){
                    runTransaction(myDB, async(transaction)=>{
                        writeMessage(`You have succesfully added ${obj.request_username} to your contact list`)
                        let friendInfo = {
                            chat_id: idChat,
                            id : obj.id_user_request,
                            username: obj.request_username,
                            image: obj.request_image,
                            missing_messages: 0,
                            last_messge: `New contact, say hi to ${obj.request_username}`,
                            date_time_message: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
                        }
                        let myInfo_for_friend = {
                            chat_id: idChat,
                            id : userData.id,
                            username: userData.username,
                            image: userData.image,
                            missing_messages: 0,
                            last_messge: `New contact, say hi to ${userData.username}`,
                            date_time_message: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
                        }
                        const userSnapshot = await transaction.get(myUserRef);
                        const friendSnapshot = await transaction.get(friendRef);

                        let myData = userSnapshot.data()
                        let myFriendData = friendSnapshot.data()

                        myData.contacts.push(friendInfo)
                        myFriendData.contacts.push(myInfo_for_friend)

                        transaction.update(myUserRef, {contacts: myData.contacts})
                        transaction.update(friendRef, {contacts: myFriendData.contacts})

                    })
                }
            })

        }
        catch(error){
            writeMessage("error accepting request:", error)
        }
    }

    async function createChat(){
        let myDB = getFirestore()
        let idChat =""
        let arrayMessages=[]
        try{
            const docRef =  await addDoc(collection(myDB,"chats"), {messages: arrayMessages});
            idChat = docRef.id
            return idChat;
        }catch(error){
            console.error("error creating chat:", error)
        }
    }
//------------------------------------------------listening functions 
     function listeningRequests(){
        if(userData.id && userData.friend_requests){
            let myID = userData.id;
            let myDB = getFirestore()
            let myCollection = doc(myDB, "users", myID);
            let myQuery = query(myCollection)

            const unsuscribe = onSnapshot(myCollection,(snapshot)=>{
                if(userData.friend_requests){
                        const theuserData = snapshot.data()
                        let friend_requests = theuserData.friend_requests;
                        setUserData(obj=>({...obj, friend_requests:friend_requests}))
                    }
            })
            return unsuscribe;
        }
    }
    function listeningContacts(){
        if(userData.id && userData.contacts){
            let myID = userData.id;
            let myDB = getFirestore()
            let myCollection = doc(myDB, "users", myID);
            let myQuery = query(myCollection);

            const unsuscribe = onSnapshot(myCollection, (snapshot) =>{
                const theuserData = snapshot.data()
                let contacts = theuserData.contacts;
                let arrayid= new Map()

                contacts.forEach(contact =>{
                    arrayid.set(contact.id, contact.username)
                })
                setContactDataID(arrayid)
                setUserData(obj=>({...obj, contacts: contacts}))

            })
            return unsuscribe;
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
                                    {(userData.id !== user.id && !(contactDataID.has(user.id)))?
                                    <button id={user.id}className='btn-send-request' onClick={()=>(sendRequest(user.id, user.username))}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-add" viewBox="0 0 16 16">
                                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                            <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
                                        </svg>
                                    </button>:<div></div>
                                    }
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
                        {
                        (userData.friend_requests && 
                            userData.friend_requests.length > 0) ? 
                                <small className="notification-request">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-add" viewBox="0 0 16 16">
                                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
                                    </svg>
                                    {userData.friend_requests.length}
                                </small>
                            : 
                            <div></div>
                            }
                    
                    {(userData.friend_requests && 
                    userData.friend_requests.length > 0) ? 
                        <details className="request-container">
                            <summary>Friend requests</summary><br></br>
                            {
                                (userData.friend_requests)?
                                userData.friend_requests.map((request, index) =>(
                                    <div className="element-list-contact f-request" key={request.id}>
                                        <img className='img-contact-list' src={request.image} alt={request.userame +"imb"}></img>
                                        <img id={"clock_"+request.id} className='img-contact-list clock-request_list' src={clock} alt={request.userame +"imb"}></img>
                                        
                                        <small className="element-list-request">{request.username}</small>
                                        <div className="btn-container"> 
                                            <button id={"accept_"+request.id} className="btn-request-list accept"
                                            
                                            onClick={() =>(acceptRequest({
                                                id_user_request: request.id, 
                                                accepted:"accept_"+request.id, 
                                                deleted:"delete_"+request.id, 
                                                clock_id:"clock_"+request.id,
                                                request_username: request.username,
                                                request_image: request.image
                                                }
                                            ))}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-add" viewBox="0 0 16 16">
                                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
                                            </svg>
                                            </button>
                                            <button id={"delete_"+request.id} className="btn-request-list reject" 
                                            onClick={() =>(deleteFriendRequest(
                                                request.id, 
                                                "accept_"+request.id, 
                                                "delete_"+request.id, 
                                                "clock_"+request.id))
                                                }>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-x" viewBox="0 0 16 16">
                                                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
                                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708Z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                                :
                                <div></div>
                            }
                        </details>
                        : 
                        <div></div>
                        }
                        <br></br>
                        <hr></hr>
                        {
                            (userData.contacts && userData.contacts.length > 0)?
                                userData.contacts.map((contact, index)=>(
                                    <div className="element-list-contact"  key={index}>
                                            <img className='img-contact-list' src={contact.image} alt={contact.userame +"img"}></img>
                                            <small className="element-list-username">{contact.username}</small>
                                            <small className="last-message"> {contact.last_messge}</small>
                                            <small className='last-date-contact'>{contact.date_time_message}</small>
                                            <small className="missing-messages" data-content={contact.missing_messages}>{contact.missing_messages}</small>
                                    </div>
                                ))
                                :<div>
                                    <img className='backgroud-icon' src={bgIcon} ></img>
                                    <br></br>
                                    <p className='bg-message'>You dont have contacts</p>
                                </div>
                        }
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