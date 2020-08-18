import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './Scheduler.module.css'
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment_timezone from "moment-timezone";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import { useSelector } from 'react-redux';

moment_timezone.tz.setDefault("Asia/Seoul");
const DragAndDropCalendar = withDragAndDrop(Calendar);

function Scheduler() {
  let { userData } = useSelector(state => state.user)
  let { currentNs, currentSchedule, nsSocket } = useSelector(state => state.chatInfo)
  let {_id, event, namespace} = currentSchedule
  
  const [Events, setEvents] = useState([]);
  const [dayLayoutAlgorithm, setdayLayoutAlgorithm] = useState("no-overlap");


  useEffect(() => {
    nsSocket.emit('joinSchedule', {_id});
    let events= event.map(ele=>{
      let { _id, start, end, desc, title, index } = ele;
      return { _id, title, desc, start: new Date(start), end: new Date(end) };
    })
    setEvents(events);
    return(()=>{
      nsSocket.emit('leaveSchedule',{_id});
    })
  }, [_id, event, nsSocket]);

  useEffect(()=>{
    nsSocket.on('updateSchedule', (event, isNew)=>{
      let {title, desc, start, end, _id} = event
      if(isNew){
        setEvents((events)=>{
          return [...events, {_id, title, desc, start: new Date(start), end: new Date(end)}]
        })
      }else { 
        setEvents((events)=>{
          return events.map((ele)=>{
            return (ele._id===_id) ? {...ele, start: new Date(start), end: new Date(end)} : ele
          })
        })
      }
    })
  }, [nsSocket])


  function addEvent({start, end}) {
    const title = window.prompt("일정을 추가하세요");
    const desc = window.prompt("내용을 추가하세요");
    if (title) {
    let newEvent = { title, start, end, desc };
    nsSocket.emit('handleEvent', newEvent, _id);
    }else{
      console.log("title이 입력되지 않았습니다");
    }
  }

  function moveEvent({ event, start, end }) {
    let newEvent = {...event, start, end}
    nsSocket.emit('handleEvent', newEvent, _id);
    }

  function resizeEvent({ event, start, end }) {
    let newEvent = {...event, start, end}
    nsSocket.emit('handleEvent', newEvent, _id);
  }

  function onSelectEvent(event) {
    console.log(event);
    const r = window.confirm("일정을 취소합니다.");
    if (r === true) {
      axios.post("/api/event/removeEvent",event)
      .then((response) => {
        let arr = response.data.event.map((ele) => {
          let { _id, start, end, desc, title, index } = ele;
          return { _id, title, desc, start: new Date(start), end: new Date(end), index};
        });
        setEvents(arr);
        console.log(arr); 
      })
    }}

  const localizer = momentLocalizer(moment_timezone);
  return (
    <>
      <h1 style={{textAlign : 'center'}}>일정관리</h1>
      <DragAndDropCalendar
        style={{ height: '70vh', width: "100%"}}
        popup={true} //+ _x_ more"링크를 클릭하면 잘린 이벤트를 오버레이에 표시합니다.
        selectable={true} //필수 ** 날짜와 범위를 선택할수 있게 만들어줌
        localizer={localizer} //moment 모듈을 이용한 로컬화
        events={Events} //이벤트 나오게 하는거
        allDayAccessor="allday"
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH} //디폴트 뷰
        scrollToTime={new Date()} //**스크롤 시작 위치를 정해줌(안해줘도 될듯)
        defaultDate={moment_timezone().toDate()} //디폴트 날짜
        onSelectSlot={addEvent} //**날짜 선택시 콜백이 발생한다 -> 위에서 만들어준 handleSelect가 실행
        dayLayoutAlgorithm={dayLayoutAlgorithm} //레이아웃 배열의 알고리즘
        onDragStart={console.log} // 드래그 시작할 떄 => 클릭시
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onDoubleClickEvent={onSelectEvent}
        components={{
          event: Event, //여기서 호버줘야함
          agenda: {
            event: EventAgenda,
          },
        }}
      />
    </>
  );
}

export default Scheduler;

function Event({ event }) {
  return (
    <>
    {event.start.getDate()} <br/> {event.title}<br></br>
    </>
  );
}
//Agenda에서 이벤트 주는거
function EventAgenda({ event }) {
  return (
    <>
      <p style={{ color: "magenta" }}>{event.title}</p>
      <p>{event.desc}</p>
    </>
  );
}
