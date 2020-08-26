import React from 'react';
import styles from'./ChatModal.module.css';

const ChatModal = ({message, Modify, Delete}) => {
  return (
      <section className={styles.content}>
        <i className={`far fa-laugh ${styles.content__body}` }></i>
        <i className={`fas fa-edit ${styles.content__body}`} onClick={Modify}></i>
        <i className={`fas fa-trash-alt ${styles.content__body}`} onClick={Delete}></i>
        <i className={`fas fa-ellipsis-h ${styles.content__body}`} style={{padding : '12px 0 0 11.7px'}}></i>
      </section>
  );
};

export default ChatModal;
