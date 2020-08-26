import React from 'react';
import styles from'./ChatModal.module.css';

const ChatModal = ({modalPosition, setColor,removeColor}) => {
  let {offsetLeft, offsetWidth, offsetHeight} = modalPosition
  return (
      <section className={styles.content} style={{top:offsetHeight-10, left : offsetLeft+offsetWidth-170}} onMouseOver={setColor} onMouseLeave={removeColor}>
        <i className={`far fa-laugh ${styles.content__body}`}></i>
        <i className={`fas fa-edit ${styles.content__body}`}></i>
        <i className={`fas fa-trash-alt ${styles.content__body}`}></i>
        <i className={`fas fa-ellipsis-h ${styles.content__body}`} style={{padding : '12px 0 0 11.7px'}}></i>
      </section>
  );
};

export default ChatModal;
