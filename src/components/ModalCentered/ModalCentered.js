import React from 'react';
import styles from'./ModalCentered.module.css';
import { useRef } from 'react';

const ModalCentered = ({children}) => {
  let modal = useRef();
  function Open() { modal.current.classList.remove(styles.hidden) }
  function Close() { modal.current.classList.add(styles.hidden) }

  return (
    <>
    {/* 버튼에 onClick={Open} 달기 */}
      <div onClick={Open}>{children[0]}</div>
      <section ref={modal} className={`${styles.modal} ${styles.hidden}`} >
        <section  className={styles.overlay} onClick={Close}></section>
        <section className={styles.content}>
          <header className={styles.content__header}> {children[1]} </header>
          <CloseIcon Close={Close}></CloseIcon>
          <article className={styles.content__body}> {children[2]} </article>
        </section>
      </section>
    </>
  );
};

export default ModalCentered;


const CloseIcon = ({Close}) => {
  return (
    <svg width="2em" height="2em" viewBox="0 0 16 16" className={`bi bi-x ${styles.closeicon}`} onClick={Close} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
      <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
    </svg>
  );
};
