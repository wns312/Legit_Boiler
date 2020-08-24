import React from 'react';
import styles from'./ChatModal.module.css';
import { useRef } from 'react';

const ChatModal = ({modalPosition}) => {
  let {offsetTop, offsetLeft, offsetWidth} = modalPosition
  return (
      <section className={styles.content} style={{top:offsetTop-10, left : offsetLeft+offsetWidth-170}} >
        <header className={styles.content__header}></header>
        <article className={styles.content__body}></article>
      </section>
  );
};

export default ChatModal;
