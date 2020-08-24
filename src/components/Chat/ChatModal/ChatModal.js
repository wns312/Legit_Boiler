import React from 'react';
import styles from'./ChatModal.module.css';
import { useRef } from 'react';

const ChatModal = () => {
  return (

      <section className={styles.content}>
        <header className={styles.content__header}></header>
        <article className={styles.content__body}></article>
      </section>

  );
};

export default ChatModal;
