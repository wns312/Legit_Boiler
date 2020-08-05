import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ChatInput = () => { 
  let {userData} = useSelector(state=>state.user) 
  let {nsSocket} = useSelector(state=>state.chatInfo)
  const [InputText, setInputText] = useState(""); // 얘는 메모해주어야 할 것 같다

  //메시지를 state에 저장
  function handleInput(e) {
    setInputText(e.target.value);
  }
  //메시지발신
  function handleForm(event) {
    let inputTag = event.currentTarget.childNodes[0].childNodes[0]
    event.preventDefault();
    inputTag.setAttribute('disabled', true);
    if(InputText!=="") {
      let {name, image} = userData
      nsSocket.emit("newMessageToServer", { text: InputText, type : "text", userName : name, userImg : image, filename : ""});
      setInputText("");
    }
    inputTag.removeAttribute('disabled')
    setTimeout(()=>{inputTag.focus()}, 100);
  }
  return (
  <div className="message-form">
    <form id="user-input" onSubmit={handleForm} >
      <div className="col-sm-12">
        <input id="user-message" type="text" onChange={handleInput} value={InputText} placeholder="Enter your message" />
      </div>
    </form>
  </div>
  );
};

export default ChatInput;