import React from 'react';
import styles from './EmptyChat.module.css'

const EmptyChat = () => {
  return (
    <div id={styles.emptychat}>
      <h1>It's empty now</h1>
    </div>
  );
};

export default EmptyChat;