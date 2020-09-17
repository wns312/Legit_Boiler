import React, { useState } from 'react';
import { Button, Modal, Input, Checkbox } from 'semantic-ui-react'
import {useSelector} from 'react-redux';
import styles from './CreateRoom.module.css';

const CreateRoom = ({children}) => {
  let {_id} = useSelector(state=>state.user.userData) //유저아이디
  let {nsSocket, currentNs} = useSelector(state=>state.chatInfo)
  const [Open, setOpen] = useState(false);
  const [Size, setSize] = useState();
  const [roomTitle, setRoomTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [hidden, setHidden] = useState(true);

  function show(size) {
    setSize(size);
    setOpen(true);
  }
  function close() { 
    setOpen(false); 
    setHidden(true);
    setRoomTitle("");
  }
  function handlePrivate(e) {
    setIsPrivate(value=>!value)
  }
  function handleRoomTitle(event) {
    setRoomTitle(event.target.value)
  }
  //방이름 정규표현식
  function chkRoom(){
    let isNS = /^[가-힣a-zA-Z0-9]([_]?[가-힣a-zA-Z0-9]){2,20}$/;
    return isNS.test(roomTitle) ? true : false;
  }

  function createRoom(e){
    e.preventDefault();
    setRoomTitle("");

    let room = chkRoom();
    if(room){
      if(isPrivate){
        nsSocket.emit("NewRoom", {roomTitle, isPrivate, _id, Ns_id : currentNs._id})
      }else{
        let ids = currentNs.nsMember.map(person=>person._id)
        nsSocket.emit("NewRoom", {roomTitle, isPrivate, ids, Ns_id : currentNs._id})
      }
      setOpen(false)
      setHidden(true)
    } else {
      setOpen(true)
      setRoomTitle(roomTitle)
      setHidden(false)
    }
  }

  return (
    <>
      <span onClick={() => { show('tiny') }} style={{cursor : 'pointer'}}>{children}</span>
        <Modal size={Size} open={Open} onClose={close} centered={true}>
          <Modal.Header>방 생성</Modal.Header>
          <Modal.Content>
          &emsp;생성할 방의 이름을 적으세요<hr/>
            <form onSubmit={createRoom}>
            &emsp;<Input focus value={roomTitle} onChange={handleRoomTitle} placeholder="방 이름" />
              &emsp;<Checkbox label='비밀방' checked={isPrivate} onClick={handlePrivate} toggle/>
              <br />&emsp;
              {hidden 
            ? <span className={styles.check_visible}>2~20자의 한글과 영문, 언더바(_)만 사용가능합니다.</span>
            :  <span className={styles.check_hidden}>_를 제외한 특수문자는 사용할 수 없습니다.</span>}
            </form>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={close}>닫기</Button>
            <Button
              positive
              icon='checkmark'
              labelPosition='right'
              content='생성'
              onClick={createRoom}
            />
          </Modal.Actions>
        </Modal>
    </>
  );
};

export default CreateRoom;