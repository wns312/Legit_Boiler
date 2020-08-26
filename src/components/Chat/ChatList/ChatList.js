import React from 'react';
import styles from './ChatList.module.css'

const ChatList = ({message, Open, index, removeColor}) => {
    let { text, type, filename, time, userName, avatar } = message;
    const convertedDate = new Date(time).toLocaleTimeString();
    const convertedMsg = convertMsg(text, type, filename);//switch문 이용해서 데이터 타입에 따라 다른 태그를 넣어줌

  return (
    <li className={styles.chatset_li} key={index} index={index} onMouseEnter={Open} onMouseLeave={removeColor}>
      <img className={styles.chatset_image} src={avatar} alt="아바타" />
      <div className={styles.chatset_message}>
        <div className={styles.chatset_name}>{userName}<small className={styles.chatset_time}>&ensp;{convertedDate}</small></div>
        {convertedMsg}
      </div>
    </li>
  );
} 

export default ChatList;


function convertMsg(text, type, filename) {
  let tag = "";
  switch (type) {
    case 'text':
      tag = <div dangerouslySetInnerHTML={{__html: text}}></div>
      break;
    case 'image/png': case 'image/jpeg': case 'image/gif':
      tag = <img src={text} alt="이미지"></img>
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