import React from 'react';
import styles from './Sidebar.module.css';
const Sidebar = ({Close}) => {
  return (
      <>
      <section id={styles.header}>
        <div>Details</div>
        <i className={`fas fa-times ${styles.closeicon}`} onClick={Close}></i>
      </section>
      <section id={styles.body}>
      </section>
    </>
  );
};

export default Sidebar;