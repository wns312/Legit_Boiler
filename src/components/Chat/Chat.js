import React, { useEffect, useRef } from 'react';
import styles from './Chat.module.css'
import axios from 'axios';
import ChatInput from "../ChatInput/ChatInput"
import ChatModal from './ChatModal/ChatModal'
import Dropzone from 'react-dropzone';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ChatList from './ChatList/ChatList';

const Chat = ({handleAside}) => {
  //방정보를 store에 넣어서 가져올 필요가 있어보임
  let { userData } = useSelector(state => state.user)
  let { currentNs, currentRoom, nsSocket } = useSelector(state => state.chatInfo)
  // member, _id,  namespace, nsEndpoint 도 있음
  let { roomTitle, _id} = currentRoom; //roomindex를 버릴경우 여기서 에러남
  let NS_id = currentNs._id
  const [messages, setMessages] = useState([]);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [Index, setIndex] = useState(false);

  const [modalPosition, setModalPosition] = useState();
  let chat_messages = useRef();
  let ulTag = useRef();
  
  useEffect(() => {
    console.log(`[${_id}]에 입장했습니다`);
    nsSocket.emit('joinRoom', NS_id, _id);
    setTimeout(()=>{ chat_messages.current.scrollTo(0,chat_messages.current.scrollHeight) }, 70)
    return () => { 
      console.log(`[${_id}]에서 나갔습니다`);
      nsSocket.emit('leaveRoom', {_id})
    }
  }, [nsSocket, _id, NS_id])

  useEffect(() => {
    //히스토리 추가 : 방 변경시 socket.on중복실행방지로 새 effect로정의
    nsSocket.on('historyCatchUp', (history) => {
      setMessages(history)
    });
    //메시지 수신
    nsSocket.on('messageToClients', (message) => {
      setMessages(messages => [...messages, message]);
      //스크롤부분 넣어주어야한다
      let {scrollTop, offsetHeight, scrollHeight} = chat_messages.current
      scrollTop+offsetHeight >(scrollHeight-200) && chat_messages.current.scrollTo(0,scrollHeight)
    });
  }, [nsSocket]);

  function onDrop(files) {
    let formData = new FormData();
    formData.append('file', files[0]);
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    }
    axios.post('/api/chat/uploadfiles', formData, config)
      .then((res) => {
        let { url, mimetype, filename, success } = res.data
        let { name, image } = userData
        if(success){
          nsSocket.emit('newMessageToServer', { NS_id : currentNs._id, roomId:_id, text: url, type: mimetype, filename, userName: name, userImg: image })
          setTimeout(()=>{scrollBottom()}, 300);
        }else{
          console.log(res)
        }
      })
  }
  function roomTitleLoad() {
    if (currentRoom.isDM === undefined) { // dm이 아니면
      return (roomTitle)
    } else { // dm이면
      let dataOfOpponent = currentRoom.member.find(ele => {
        return (ele._id !== userData._id)
      })
      return (dataOfOpponent ? dataOfOpponent.name : "나간상대")
    }
  }
  function scrollBottom() {
    // scrollIntoView는 true일시 자신의 맨 위, false일시 자신의 맨 아래를 보여주게된다
    // ulTag.current.scrollIntoView(false)
    chat_messages.current.scrollTo(0,chat_messages.current.scrollHeight)
  }
  function Open(e) {
    e.stopPropagation();
    e.currentTarget.style.backgroundColor = "rgb(245, 245, 245)"
    setIndex(e.currentTarget.getAttribute('index'))
    let {scrollTop} = chat_messages.current
    let {offsetTop, offsetLeft, offsetWidth} = e.currentTarget
    setModalPosition({offsetLeft, offsetWidth, offsetHeight : offsetTop-scrollTop})
    setIsMouseOver(true)
  }
  function setColor() {
    ulTag.current.childNodes[Index].style.backgroundColor = "rgb(245, 245, 245)"
  }
  function removeColor() {
    ulTag.current.childNodes[Index].style.backgroundColor = "rgb(255, 255, 255)"
  }

  function Close(e) { setIsMouseOver(false) }
  return (
    <>
      <div id={styles.chat_header}>
        <div id={styles.roomtitle}>
          {roomTitleLoad()}
        </div>
        <i 
          onClick={handleAside}
          className={`large info circle icon ${styles.aside_icon}`}
        ></i>
      </div>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps }) => (
          <section className={styles.dropzone}>
            <div {...getRootProps()} className={styles.dropzone}>
              <div ref={chat_messages} id={styles.chat_messages} >
                <ul ref={ulTag} id={styles.chatset_ul} onMouseLeave={Close}>
                  {newChatList(messages, Open, removeColor)} {/* 채팅목록 */}
                  {isMouseOver && <ChatModal modalPosition={modalPosition} setColor={setColor} removeColor={removeColor}></ChatModal>}
                </ul>
              </div>
            </div>
          </section>
        )}
      </Dropzone>
      <ChatInput scrollBottom={scrollBottom} roomId={_id}></ChatInput>
    </>
  );
}
export default React.memo(Chat);

function newChatList(messages, Open, removeColor) {
  return messages.map((message, index) => {
    return (
      <ChatList message={message} index={index} Open={Open} removeColor={removeColor}/>
    )
  })
}


// joinRoom마지막에 검색창 기능추가 
// <input type="text" id="search-box" placeholder="Search" onchange={handleSearch}/>
//     Array.from(messages).forEach((message) => {
//       // 검색값과 채팅값의 비교 ? 검색값이 채팅내용에 있을 경우 : 없을경우
//       message.textContent.indexOf(event.target.value) === -1
//         ? (message.style.display = "none")
//         : (message.style.display = "block");
//     });
// let {scrollTop, offsetHeight, scrollHeight} = chat_messages.current
// console.log(scrollTop); // 현재 스크롤 위치(위 높이)
// console.log(offsetHeight); // 눈에보이는 스크롤 높이 (고정)
// console.log(scrollTop+offsetHeight); // 아래높이
// console.log(scrollHeight); // 전체높이 (안보이는거 포함) (채팅이 늘어나면 같이늘어남)

