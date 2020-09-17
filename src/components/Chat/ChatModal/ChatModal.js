import React from 'react';
import styles from'./ChatModal.module.css';
import { useSelector } from 'react-redux';

const ChatModal = ({message, Modify, Delete}) => {
  let { _id } = useSelector(state => state.user.userData)
  let {userId} = message

  if (userId === _id) {
    return (
      <div className={styles.content_wrapper}>
        <section className={styles.content}>
          <i className={`fas fa-edit ${styles.content__body}`} onClick={Modify}></i>
          <i className={`fas fa-trash-alt ${styles.content__body}`} onClick={Delete}></i>
        </section>
      </div>
    );
  }else{
    return (<></>)
  }

};
export default ChatModal;
