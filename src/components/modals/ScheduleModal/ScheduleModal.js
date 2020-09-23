import React from 'react';
import styles from'./ScheduleModal.module.css';

const ScheduleModal = ({children}) => {
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
    {/* 버튼에 onClick={Open} 달기 */}
      <div className={styles.button} onClick={Open}>{children[0]}</div>
      <section className={`${styles.modal} ${styles.hidden} modal`} >
        <section  className={styles.overlay} onClick={Close}></section>
        <section className={styles.content}>
          <header className={styles.content__header}> {children[1]} </header>
          <i className={`fas fa-times ${styles.closeicon}`} onClick={Close}></i>
          <article className={styles.content__body}> {children[2]} </article>
        </section>
      </section>
    </>
  );
};

export default ScheduleModal;

