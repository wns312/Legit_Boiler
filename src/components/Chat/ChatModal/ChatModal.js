import React from 'react';
import styles from'./ChatModal.module.css';

const ChatModal = ({modalPosition, setColor,removeColor}) => {
  let {offsetLeft, offsetWidth, offsetHeight} = modalPosition
  return (
      <section className={styles.content} style={{top:offsetHeight-10, left : offsetLeft+offsetWidth-170}} onMouseOver={setColor} onMouseLeave={removeColor}>
        <article className={styles.content__body}></article>
        <article className={styles.content__body}></article>
        <article className={styles.content__body}></article>
        <article className={styles.content__body}></article>
      </section>
  );
};

export default ChatModal;
