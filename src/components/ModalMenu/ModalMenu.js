import React from 'react';
import styles from './ModalMenu.module.css';
import { useRef } from 'react';
import InviteNs from "../InviteNs/InviteNs";
import NsSettings from "../NsSettings/NsSettings";
import LeaveNS from "../LeaveNS/LeaveNS";
import CreateRoom from "../CreateRoom/CreateRoom";
import CreateDM from "../CreateDM/CreateDM";

const ModalMenu = ({isAdmin}) => {
  let modal = useRef();
  let overlay = useRef();
  

  function Open() {
    console.log(modal.current.classList);
    modal.current.classList.remove(styles.hidden) // 클래스리스트에서 특정 클래스네임제거
  }
  function Close() {
    console.log(modal.current.classList.value);
    modal.current.classList.add(styles.hidden)
  }

  return (
    <>
      <div id='list_header_button' onClick={Open}>
        <span id='list_header_teamname'>Legit</span>
        <span id='list_header_username'># 김준영</span>
      </div>
      <div ref={modal} className={`${styles.modal} ${styles.hidden}`} >
        <div ref={overlay} className={styles.overlay} onClick={Close}></div>
        <div className={styles.content} >
          <CreateRoom></CreateRoom>
          <CreateDM></CreateDM> 
          <InviteNs></InviteNs>
          <LeaveNS></LeaveNS><br/><br/>
          {isAdmin && <NsSettings></NsSettings> } 
        </div>
      </div>
      
    </>
  );
};

export default ModalMenu;