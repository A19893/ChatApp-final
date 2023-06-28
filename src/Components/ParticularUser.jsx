import React, { useEffect, useState } from "react";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Message from "./Message";
import Input from "./Input";
import OwnerMessage from "./OwnerMessage";
import { useSelector } from "react-redux";
import {collection,doc,updateDoc,arrayUnion,onSnapshot } from "firebase/firestore";
import { db } from "../config/Firebase";
import { Timestamp } from "firebase/firestore";
const ParticularUser = () => {
  const DocRef=collection(db,"Chats")
  const chatRoomId = useSelector(
    (state) => state.userdetails.CurrentChatRoomId
  );
  const senderid = useSelector(
    (state) => state.userdetails.UserDetail.senderid
  );
  console.log(senderid)
  const[msg,setMsg]=useState("");
  const[updatedid,setupdateid]=useState("");
  const[text,setText]=useState([]);
  const[typing,setTyping]=useState(null) 
  console.log(chatRoomId)
  useEffect(() => {
    if(chatRoomId){
  const unsub = onSnapshot(doc(db,"Typing", chatRoomId), (doc) => {
      setTyping(doc.data().typing);});}
  const unsubscribe = onSnapshot(DocRef, (QuerySnapshot) => {
    let messages = [];
    QuerySnapshot.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id });
    });
    setText(messages.filter(item=>item.chatRoomId === chatRoomId));
  });
  return () => unsubscribe;
  },[chatRoomId]);
  const clickHandler=async()=>{
    console.log(updatedid);
    const date=new Date();
    console.log(date.getDate());
   const dRef = doc(db, "Chats", text[0].id);
   await updateDoc(dRef,{messages: arrayUnion({
    message:msg,
    senderid:senderid,
    date:Timestamp.now()
   })});
   setMsg(" ");
  }
  const particularUser = useSelector((state) => state.userdetails?.ParticularUser);
  console.log("my particular user",particularUser)
  const typeHandler=(e)=>{
    setTimeout(()=>{
      if(chatRoomId){
      updateDoc(doc(db,"Typing",chatRoomId),{
        typing:false
      })}
    },2000)
    if(chatRoomId){
    updateDoc(doc(db,"Typing",chatRoomId),{
      typing:true
    })}
    setMsg(e.target.value);
  }
  return (
    <>
      <div className="chat-container">
        <div className="user-name">
          <div className="user-status">
          <h3
            style={{
              fontWeight: "lighter",
              margin: "0px",
              paddingTop: "20px",
              fontSize: "22px",
              paddingLeft: "10px",
              color: "lightgray",
            }}
          >
            {particularUser?.name}
          </h3>
          <span
          style={{
            fontWeight: "lighter",
            margin: "0px",
            fontSize: "12px",
            color: "lightgray",
          }}>
            {/* {console.log("senderid",senderid,"recieverid",chatRoomId.substr(13,26))} */}
          {chatRoomId?.substr(13,26)!=senderid&&typing?"type ho rha hai":""}
          {/* {chatRoomId.substr(0,13)!=senderid&&typing?"type ho rha hai":""} */}
          {console.log(typing,"tdg",chatRoomId?.substr(13,26),"fuirst",chatRoomId?.substr(0,13 ),"sender yeh hai",senderid)}
          </span>
          <span>
            {particularUser?.status?<span style={{
              fontWeight: "lighter",
              margin: "0px",
              paddingTop: "5px",
              fontSize: "22px",
              paddingLeft: "10px",
              color: "green",
            }}>Online</span>:<span style={{fontWeight: "lighter",
            margin: "0px",
            paddingTop: "5px",
            fontSize: "14px",
            paddingLeft: "10px",
            color: "red",}}>Offline</span>}
          </span>
          </div>
          <div>
            <VideoCallIcon fontSize="large" className="videoicon" />
            <PersonAddAlt1Icon fontSize="large" className="videoicon" />
            <MoreHorizIcon fontSize="large" className="videoicon" />
          </div>
        </div>
            <div className="chatBox">
            {
            // currentUser[0]?.
            text[0]?.messages?.map((item)=>{
            return(
                <>
                {console.log("aagya",item.senderid,"jisne likha",senderid,"date",item.date)}
                {item.senderid===senderid ?<OwnerMessage msg={item.message} timestamp={item.date?.seconds}/>:<Message msg={item.message} timestamp={item.date?.seconds}/>}
                </>
            )
            })
        }
        </div>
        <Input msg={msg} clickHandler={clickHandler} typeHandler={typeHandler}/>
      </div>
    </>
  );
};

export default ParticularUser;
