import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { message } from "antd";
import Rooms from '../Rooms/Rooms'
import Chat from '../Chat/Chat'
import CreateNS from "../CreateNS/CreateNS"
// import NavBar from "../NavBar/NavBar" 푸시테스트
import {useSelector, useDispatch} from 'react-redux';
import {inputCurrentNs, inputNsList, inputCurrentRoom} from '../../_actions/chat_action'
let Socket=""
const Namespaces = () => {
  let {nsList, currentNs, currentRoom} = useSelector(state=>state.chatInfo); // state.루트리듀서에 지정한 이름
  let {_id} = useSelector(state=>state.user.userData); //유저아이디
  const dispatch =useDispatch();
  const [Title, setTitle] = useState(); //네임스페이스 이름

  useEffect(()=>{
    Socket = io(`http://${process.env.REACT_APP_IP_ADDRESS}:9000`, { query :  {_id} } );

    Socket.on("nsList", (nsArray)=>{ //접속시 리스트 로드
      dispatch(inputNsList(nsArray));  // 변하는 정보가 없어지면 리덕스에서 삭제
    })//완성⭐

    Socket.on('currentNs', (ns)=>{ // 아래의 handleNsList에서 보낸 clicktNs이벤트를 보내면 서버에서 clickedNs 이벤트를 보낸다
      dispatch(inputCurrentNs(ns)); // 전체방로드는 클릭시 Rooms.js에서 해주므로 신경쓰지 않는다
      // dispatch(inputCurrentRoom("")); // 클릭시 바로 이거 실행되게 해서 주석잡았음
    })

    Socket.on('errorMsg', (msg)=>{ // 에러출력
      message.error(msg);
    })

  }, [dispatch, _id]);                
  
  function getnsList(){
    let list = nsList.map((element,index)=>{
      let {nsTitle} = element;
      return (
        <div className="namespace" key={index} title={nsTitle} onClick={()=>{handleNsList(element)}}>
          <img src={element.img} alt="namespace"/>
        </div>
      )
    })
    return list
  }

  function handleNsList(element){ // 2. 만약에 클릭시 정보를 받아온다고 했을때, 여기서 각 ns에 대한 emit이나 post요청을 해야한다
    let {nsTitle} = element;
    if(Title !== nsTitle) {
      console.log("새로운 ns로드 실행");
      dispatch(inputCurrentRoom(""));
      setTitle(nsTitle);
      Socket.emit('clickNs', {nsTitle}); // 현재NS 갱신을 위한 요청
      console.log(`[${nsTitle}] NS에 입장했습니다`);
    }
    // console.log(`[${Title}] / [${title}]`);
  }
  return (
    <>
      {/* <NavBar></NavBar> */}
      <div className="col-sm-1 namespaces">
        {nsList && getnsList() /* 네임스페이스 데이터가 있어야 nsList를 가져온다 (당연함) */}
        <br/>
        <CreateNS Socket={Socket}></CreateNS>  {/* _id=유저아이디 : 유저아이디를 알아야 생성자를 추가함 (Socket은 axios로 대체 후 삭제가능) */}
      </div>
      { currentNs && <Rooms></Rooms> } {/* 엔드포인트 설정되면 방 컴포넌트 로드 */}
      <div className="container-fluid">
        <div className="row">
          { currentRoom ? <Chat></Chat> : null } {/* 방이름이 설정되면 채팅 컴포넌트 로드 */}
        </div>
      </div>
    </>
  );
};
export default Namespaces;