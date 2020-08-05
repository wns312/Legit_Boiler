import React, { useState } from 'react';
import { Button, Modal, Checkbox } from 'semantic-ui-react'
import {useSelector} from 'react-redux';

const CreateRoom = () => {
  let {_id} = useSelector(state=>state.user.userData) //유저아이디
  let {nsSocket, currentNs} = useSelector(state=>state.chatInfo)
  let {nsTitle} = currentNs // nsId
  const [Open, setOpen] = useState(false);
  const [Size, setSize] = useState();
  const [RoomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  function show(size) {
    setSize(()=>size);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function createRoom(e){
    e.preventDefault();
    //여기서 받아온 데이터로 REST요청을 보내서 방을 생성할 것 (중복검사도 해야됨)
    //+ 네임스페이스 이름을 알아야 조회해서 push하고 업데이트 할 것
    //isPrivate여부에 따라서 data를 다르게 emit할 것?
    if(isPrivate){
      nsSocket.emit("NewRoom", {RoomName, nsTitle, isPrivate, _id})
    }else{
      let ids = currentNs.nsMember.map(person=>person._id)
      nsSocket.emit("NewRoom", {RoomName, nsTitle, isPrivate, ids})
    }
    

    
    setOpen(false);
    setRoomName("");
  }
  function handlePrivate(e) {
    setIsPrivate(bool=>!bool)
  }

  return (
    <>
      <Button onClick={() => { show('small') }}>방 생성</Button>
        <Modal size={Size} open={Open} onClose={close} centered={true}>
          <Modal.Header>방 생성</Modal.Header>
          <Modal.Content>
            <p style={{color : "black"}}>방 이름을 적으세요</p>
            <form onSubmit={createRoom}>
              <input type="text" value={RoomName} onChange={(event)=>{setRoomName(event.target.value)}} placeholder="방 이름 입력"/>
              <Checkbox label='비밀방' checked={isPrivate} onClick={handlePrivate} toggle/>
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