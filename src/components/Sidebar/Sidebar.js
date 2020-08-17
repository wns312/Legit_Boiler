import React from 'react';
import styles from './Sidebar.module.css';
import {InviteRoom, LeaveRoom} from "../modals";
import { useSelector } from 'react-redux';

const Sidebar = ({Close}) => {
  let {currentRoom} = useSelector(state => state.chatInfo)
// member, _id,  namespace, nsEndpoint 도 있음
let {isDM } = currentRoom; //roomindex를 버릴경우 여기서 에러남
  return (
      <>
      <section id={styles.header}>
        <div>Details</div>
        <i className={`fas fa-times ${styles.closeicon}`} onClick={Close}></i>
      </section>
      <section id={styles.body}>
      {isDM ||<InviteRoom></InviteRoom>}
        <LeaveRoom></LeaveRoom>
      </section>
    </>
  );
};

export default Sidebar;