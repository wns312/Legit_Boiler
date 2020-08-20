import React, { useState, useEffect } from "react";
import styles from './Scheduler.module.css'
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from 'moment'
import 'moment/locale/ko'
import "./react-big-calendar.css"
import {useSelector, useDispatch} from 'react-redux';
import {inputCurrentSchedule} from '../../_actions/chat_action'
const localizer = momentLocalizer(moment)
moment.locale('ko')



function Scheduler() {
  let { userData } = useSelector(state => state.user)
  let { currentNs, currentSchedule, nsSocket } = useSelector(state => state.chatInfo)
  let {_id, event, namespace} = currentSchedule
  const dispatch =useDispatch();
  const [Events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState();
  const [dayLayoutAlgorithm, setdayLayoutAlgorithm] = useState("no-overlap");

  useEffect(() => {
    nsSocket.emit('joinSchedule', {_id});
    let events= event.map(ele=>{
      let { _id, start, end, desc, title } = ele;
      return { _id, title, desc, start: new Date(start), end: new Date(end) };
    })
    console.log(events);
    setEvents(events);
    return(()=>{
      nsSocket.emit('leaveSchedule',{_id});
    })
  }, [_id, event, nsSocket]);

  useEffect(()=>{
    nsSocket.on('updateSchedule', (events)=>{ // 추가 변경
      let newEvents = events.map(ele=>{
        let { _id, start, end, desc, title } = ele;
        return { _id, title, desc, start: new Date(start), end: new Date(end) };
      })
      setEvents(newEvents)
    })

    nsSocket.on('deleteSchedule', (events)=>{ // 삭제
      let newEvents = events.map(ele=>{
        let { _id, start, end, desc, title } = ele;
        return { _id, title, desc, start: new Date(start), end: new Date(end) };
      })
      setEvents(newEvents)
    }) 
  }, [nsSocket])

  function addEvent({start, end, box}) {
    // console.log(box.clientX);
    // console.log(box.clientY);
    const title = window.prompt("일정을 추가하세요");
    const desc = window.prompt("내용을 추가하세요");
    console.log(window.clientX);
    if (title) {
    let newEvent = { title, start, end, desc };
    nsSocket.emit('createEvent', newEvent, _id); 
    }else{
      console.log("title이 입력되지 않았습니다");
    }
  }

  function moveEvent({ event, start, end }) {
    console.log("move : "+event._id);
    let newEvent = {...event, start, end}
    nsSocket.emit('handleEvent', newEvent, _id);
    }

  function resizeEvent({ event, start, end }) {
    console.log("resize : "+event._id);
    let newEvent = {...event, start, end}
    nsSocket.emit('handleEvent', newEvent, _id);
  }

  function removeEvent(e, event) {
    e.stopPropagation();
    console.log(event);
    console.log("delete : "+event._id);
    const result = window.confirm("일정을 취소합니다.");
    result && nsSocket.emit('removeEvent', event, _id);
  }

  function Event({ event }) {
    return (
        <div className={styles.event} title="">
          <span>{event.title}</span>
          <i className={`fas fa-times ${styles.removebutton}`} onClick={(e)=>{removeEvent(e, event)}} title=""></i>
        </div>
    );
  }

  function Close(event) {
    dispatch(inputCurrentSchedule(""))
  }
  function modifyEvent(e) {
    console.log(e);
    setCurrentEvent(e)
    
  }

  return (
    <>
      <section id={styles.header}>
        <div id={styles.roomtitle}>
          {(currentSchedule.room===undefined) ? currentNs.nsTitle : currentSchedule.room.roomTitle }
        </div>
        <svg width="2em" height="2em" viewBox="0 0 16 16" className={`bi bi-x ${styles.closeicon}`}  fill="currentColor" onClick={Close} xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
          <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
        </svg>
      </section>
      <section id={styles.body}>
        <div id={styles.calendar}>
        <Calendar
          style={{ height: "95%", width: "99%"}}
          popup={true} //+ _x_ more"링크를 클릭하면 잘린 이벤트를 오버레이에 표시합니다.
          selectable={true} //필수 ** 날짜와 범위를 선택할수 있게 만들어줌
          onSelectEvent={(e)=>{modifyEvent(e)}}
          localizer={localizer} //moment 모듈을 이용한 로컬화
          events={Events} //이벤트 나오게 하는거
          allDayAccessor="allday"
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.MONTH} //디폴트 뷰
          scrollToTime={new Date()} //**스크롤 시작 위치를 정해줌(안해줘도 될듯)
          defaultDate={moment().toDate()} //디폴트 날짜
          onSelectSlot={addEvent} //**날짜 선택시 콜백이 발생한다 -> 위에서 만들어준 handleSelect가 실행
          dayLayoutAlgorithm={dayLayoutAlgorithm} //레이아웃 배열의 알고리즘
          // onDragStart={console.log} // 드래그 시작할 떄 => 클릭시
          components={{
            event: Event, //여기서 호버줘야함
            agenda: {
              event: EventAgenda,
            },
          }}
        />
        </div>
        {currentEvent &&
          <div id={styles.aside}>
            <div id={styles.aside_header}></div>
            <div id={styles.aside_body}></div>
          </div>}
      </section>

    </>
  );
}

export default Scheduler;

//Agenda에서 이벤트 주는거
function EventAgenda({ event }) {
  return (
    <>
      <span style={{ color: "black", fontWeight:600, fontSize:'20px' }}>{event.title}</span><hr/>
      <div style={{ padding : '5px'}}>{event.desc}</div>
    </>
  );
}
