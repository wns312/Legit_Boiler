import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import InviteRoom from "../InviteRoom/InviteRoom"
import ChatInput from "../ChatInput/ChatInput"
import Dropzone from 'react-dropzone';
import axios from 'axios';

const Chat = () => {
  //방정보를 store에 넣어서 가져올 필요가 있어보임
  let {userData} = useSelector(state=>state.user) 
  let {currentRoom, nsSocket} = useSelector(state=>state.chatInfo)
  // member, _id,  namespace, nsEndpoint 도 있음
  let {roomTitle, isPrivate, _id} = currentRoom; //roomindex를 버릴경우 여기서 에러남

  const [amountOfUsers, setAmountOfUsers] = useState(0);
  const [messages, setMessages] = useState([]);
  
  useEffect(()=>{     
    console.log(`[${_id}]에 입장했습니다`);
    nsSocket.emit('joinRoom', _id, (numberOfMembers)=>{
      setAmountOfUsers(numberOfMembers);
    });    

    return ()=>{console.log(`[${_id}]에서 나갔습니다`);}
  }, [nsSocket, _id])
  
  useEffect(()=>{
    //히스토리 추가 : 방 변경시 socket.on중복실행방지로 새 effect로정의
    nsSocket.on('historyCatchUp', (history) => {
      setMessages(history)
    });
    //메시지 수신
    nsSocket.on('messageToClients', (message) => {
        setMessages(messages=>[...messages, message]);
    //스크롤부분 넣어주어야한다
    });
    //인원수 추가
    nsSocket.on('updateMembers', numberOfMembers =>{
      setAmountOfUsers(numberOfMembers);
    });
  }, [nsSocket]);

  //검색 : 어려움
  function handleSearch(event) {
  }

  function onDrop(files){
    let formData = new FormData();
    formData.append('file', files[0]);

    const config = {
      header : {'content-type' : 'multipart/form-data'}
    }
    
    axios.post('/api/chat/uploadfiles', formData, config)
    .then((res)=>{
      let {url, mimetype, filename, success} = res.data
      let {name, image} = userData
      success 
        ? nsSocket.emit('newMessageToServer', { text: url, type : mimetype, filename, userName : name, userImg : image})
        : console.log(res)
    })
  }

  function roomTitleLoad() {
    if (currentRoom.isDM===undefined) { // dm이 아니면
      return (
      <div className="col-sm-3">
        <span className="curr-room-text">{roomTitle}</span>
        <span className="curr-room-num-users"> {amountOfUsers} <span className="glyphicon glyphicon-user"></span></span>&emsp;
        {isPrivate && <InviteRoom></InviteRoom>} 
      </div>
      )
    }else{ // dm이면
      let dataOfOpponent = currentRoom.member.find(ele=> {
        return(ele._id !==userData._id)
      } )
      return (<div className="col-sm-3"><span className="curr-room-text">{dataOfOpponent.name}</span></div>)
    }
  }
  return (
    <Dropzone onDrop={onDrop}>
      {({getRootProps}) => (
        <section>
          <div {...getRootProps()}>
            <div className="chat-panel col-sm-9">
              <div className="room-header row col-6"> {/* 방이름, 인원수 자리 */}
                {roomTitleLoad()}
                <div className="col-sm-3 search pull-right"> {/* 검색창 자리 */}
                  <span className="glyphicon glyphicon-search"></span>
                  <input type="text" id="search-box" onChange={handleSearch} placeholder="Search" />
                </div>
              </div>
              <ul id="messages" className="col-sm-12" style={{height:'800px'}}>
                {newChatList(messages)} {/* 채팅목록 */}
              </ul>
              <ChatInput></ChatInput> {/* 메시지 전송 자리 */}
            </div>
          </div>
        </section>
      )}
    </Dropzone>
  );
}
export default React.memo(Chat);

function newChatList(messages) {
  let newChatList = messages.map((message, index)=>{
    let {text, type, filename, time, userName, avatar} = message;
    const convertedDate = new Date(time).toLocaleTimeString();
    
    const convertedMsg = convertMsg(text, type, filename);//switch문 이용해서 데이터 타입에 따라 다른 태그를 넣어줌
    return (
      <li className="user-chat-set" key={index}>
        <div className="user-image"><img src={avatar} alt="아바타"/></div>
        <div className="user-message">
          <div className="user-name-time">{userName}<span> {convertedDate}</span></div>
          {convertedMsg}
        </div>
      </li>
    )
  })
  return newChatList
}

function convertMsg(text, type, filename) {
  let tag = "";
  switch (type) {
    case 'text':
      tag = <div className="message-text">{text}</div>
      break;

    case 'image/png': case 'image/jpeg': case 'image/gif':
      tag = <img src={text} alt={text}></img>
      break;

    case 'video/mp4':
      tag = <video src={text} width='400' controls></video>
      break;
      
    default:
      tag = <a href={text} download>{filename}</a>
      break;
  }
  return tag;
}

// joinRoom마지막에 검색창 기능추가 
// <input type="text" id="search-box" placeholder="Search" onchange={handleSearch}/>
//     Array.from(messages).forEach((message) => {
//       // 검색값과 채팅값의 비교 ? 검색값이 채팅내용에 있을 경우 : 없을경우
//       message.textContent.indexOf(event.target.value) === -1
//         ? (message.style.display = "none")
//         : (message.style.display = "block");
//     });
