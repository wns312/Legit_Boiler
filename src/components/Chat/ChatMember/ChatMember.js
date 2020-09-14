import React from 'react';
import styles from './ChatMember.module.css';
const ChatMember = () => {
  return (
    <div id={styles.container}>
      <header id={styles.header}>Member</header>
      <hr className={styles.hr}/>
      <ul>
        <li>body</li>
      </ul>
      
    </div>
  );
};

export default ChatMember;