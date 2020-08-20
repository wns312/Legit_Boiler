import React from 'react';
import styles from './SidebarSchedule.module.css'

const SidebarSchedule = ({currentEvent, setCurrentEvent}) => {
  let {_id, title, desc, start, end} = currentEvent
  function Close(e) {
    setCurrentEvent("");
  }
  return (
    <div id={styles.aside}>
    <section id={styles.aside_header}>
      <div id={styles.title}>일정</div>
      <svg width="1.5em" height="1.5em" className={`bi bi-x ${styles.closeicon}`} onClick={Close} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
        <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
      </svg>
    </section>
    <section id={styles.aside_body}>
      <input id={styles.event_title} placeholder="제목" defaultValue={title}></input>
      <hr/>
      <textarea id={styles.event_desc} placeholder="내용" defaultValue={desc}></textarea>
      <hr/>
      {start.getTime()} <br/>
      {end.getTime()} <br/>
      {start.toDateString()} <br/>
      {end.toTimeString()} <br/>
      {end.toString()} <br/>
    </section>
  </div>
  );
};

export default SidebarSchedule;