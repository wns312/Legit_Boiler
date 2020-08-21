import React, { useState } from 'react';
import styles from './ChatInput.module.css';
import { useSelector } from 'react-redux';

const ChatInput = ({scrollBottom, roomId}) => { 
  let {userData} = useSelector(state=>state.user) 
  let {currentNs, nsSocket} = useSelector(state=>state.chatInfo)
  const [InputText, setInputText] = useState(""); // 얘는 메모해주어야 할 것 같다

  //메시지를 state에 저장
  function handleInput(e) {
    setInputText(e.target.value);
  }

  //메시지발신
  function handleForm(event) {
    event.preventDefault();
    let inputTag = event.currentTarget.childNodes[0]
    inputTag.setAttribute('disabled', true);
    if(InputText!=="") {
      let {name, image} = userData
      nsSocket.emit("newMessageToServer", { NS_id : currentNs._id, roomId ,text: InputText, type : "text", userName : name, userImg : image, filename : ""});
      setInputText("");
    }
    inputTag.removeAttribute('disabled')
    
    setTimeout(()=>{scrollBottom()}, 50);
    setTimeout(()=>{inputTag.focus()}, 100);
  }
  
  return (
    <> 
      <form id={styles.input} onSubmit={handleForm}>
        <input id={styles.message} placeholder='Message' value={InputText} onSubmit={handleForm} onChange={handleInput} autoComplete="off"></input>
        <div id={styles.etc}><button>전송</button></div>
      </form>
    </>
  );
};


export default ChatInput;