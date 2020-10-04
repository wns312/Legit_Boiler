import React from 'react';
import styles from './ModalMenu.module.css';
import {InviteNS, LeaveNS, SettingNS, CreateNS} from "../";
const ModalMenu = ({isAdmin, nsTitle, username, Socket}) => {
  function Open() {
    let modal = document.getElementsByClassName('modal')[0]
    modal.classList.remove(styles.hidden) 
  }
  function Close() {
    let modal = document.getElementsByClassName('modal')[0]
    modal.classList.add(styles.hidden) 
  }

  return (
    <>
      <div id={styles.header_button} onClick={Open}>
        <span id={styles.header_teamname}>{nsTitle}</span>
        <span id={styles.header_username}># {username}</span>
      </div>
      <div className={`${styles.modal} ${styles.hidden} modal`} >
        <div className={styles.overlay} onClick={Close}></div>
        <div className={styles.content} >
          <p>Namespace Settings</p>
          <InviteNS Close={Close}></InviteNS>
          <LeaveNS Close={Close}></LeaveNS>
          <div><CreateNS Socket={Socket}></CreateNS></div>
          {isAdmin && <SettingNS Close={Close}></SettingNS> } 
          {/* <hr/> */}
        </div>
      </div>
      
    </>
  );
};

export default ModalMenu;