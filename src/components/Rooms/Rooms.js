import React, { useEffect } from 'react';
import io from 'socket.io-client'
import { message } from "antd";
import CreateRoom from "../CreateRoom/CreateRoom";
import InviteNs from "../InviteNs/InviteNs";
import CreateDM from "../CreateDM/CreateDM";
import {useDispatch, useSelector} from 'react-redux';
import {inputSocket, inputCurrentNs, inputCurrentRoom, inputRoomList} from '../../_actions/chat_action'
let Socket = ''
const Rooms = () => {
  let {_id} = useSelector(state=>state.user.userData)
  let {roomList, currentNs} = useSelector(state=>state.chatInfo)
  let {nsTitle} = currentNs // nsId
  const dispatch =useDispatch();

  useEffect(()=>{ // 네임스페이스를 클릭할 때 마다 실행되어야 한다
    if (Socket)  Socket.close(); 
    if (`/${nsTitle}`!==Socket.nsp) {
      Socket = io(`http://${process.env.REACT_APP_IP_ADDRESS}:9000/${nsTitle}`, { query :  {_id} });
      dispatch(inputSocket(Socket));
    }
    // 방목록 : roomId / namespace / history ( / roomTitle / isPrivate / isDM )  
    Socket.on("nsRoomLoad", (rooms) => { // 클릭시나, 초대하고 나서 (전체룸로드)
      console.log("nsRoomLoad 실행");
      dispatch(inputRoomList(rooms));
    });
    
    Socket.on('updatecurrentNs', (ns)=>{ // 누군가 NS에 초대되면 모두에게 멤버 업데이트
      dispatch(inputCurrentNs(ns));
    })

    Socket.on('currentRoomLoad', (room)=>{ // 남을 초대하면 나는 비밀방을 보고있으므로 나에게 현재방갱신해줌
      console.log('currentRoomLoad 실행됨');
      dispatch(inputCurrentRoom(room)) // 방클릭시 리턴도 여기로 해준다
    })

    Socket.on('errorMsg', (msg)=>{
      message.error(msg);
    })
      return ()=>{ console.log(`[${nsTitle}] NS에서 나갔습니다`); }// 왜 나가지도 않았는데 실행되는가?? 함수안에서 사용하지 않았기 때문이다
  }, [nsTitle, _id, dispatch])

  function getroomList() {
    let tmproom = roomList.filter((room)=> (room.isDM === undefined) )
    const newList= tmproom.map((room, index) => {
      let isPrivateLogo = (room.isPrivate ? "lock" : "globe")
      return (
        <li className='room' key={index} onClick={()=>{handleList(room)}}> 
          <span className={`glyphicon glyphicon-${isPrivateLogo}`}></span> {room.roomTitle}
        </li> 
      )
    });
    return newList
  }

  function getdmList() {
    let tmproom = roomList.filter((room)=> room.isDM === true ) // 내가 참여한 모든 DM방 목록
    const newList= tmproom.map((room, index) => { // 내가 포함된 dm방 전체데이터를 map한다
      let dataOfOpponent = room.member.find(ele=>ele._id !==_id)
      return (dataOfOpponent) // 리스트가 하나라도 있을 경우
        ? <li className='room' key={index} onClick={()=>{handleList(room)}}> # {dataOfOpponent.name} </li> 
        : null // 리스트가 하나도 없을 경우 (dm방을 하나도 만들지 않은 상태)   
    });
      return newList
  }

  function handleList(room) {
    console.log(room); // _id , member, roomTitle, namespace(_id)
    Socket.emit('clickRoom', room._id);
    // dispatch(inputCurrentRoom(room))
  }
  
  return (
    <div className="col-sm-2 rooms"><br/>
      <h3>Rooms</h3>
      <ul className="room-list">
        {getroomList()}<br/> {/* 방데이터가 있어야 방목록을 불러온다 */}
        <CreateRoom></CreateRoom>
      </ul>
      <hr/>
      <h3>Direct Message</h3>
      <ul className="room-list">
        {getdmList()}<br/> {/* 마찬가지로 방데이터가 있어야 DM목록을 불러온다 */}
        <CreateDM></CreateDM>
      </ul>
      <hr/> <br/><br/>
      <InviteNs></InviteNs>
    </div>
  );
};
export default Rooms;
