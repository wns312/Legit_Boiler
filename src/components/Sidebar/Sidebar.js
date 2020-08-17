import React from 'react';
import styles from './Sidebar.module.css';
const Sidebar = ({setIsSidebarLoad}) => {

  function Close() {
    setIsSidebarLoad(false)
  }
  return (
    <aside>
      <section id={styles.header}>
        <div>Details</div>
        <i className={`fas fa-times ${styles.closeicon}`} onClick={Close}></i>
      </section>
      <section id={styles.body}>

      </section>
    </aside>
  );
};

export default Sidebar;