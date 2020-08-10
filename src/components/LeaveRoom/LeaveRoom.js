import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react'
import { useSelector } from 'react-redux';


const LeaveRoom = () => {
  let {userData} = useSelector(state=>state.user)
  let { currentNs, currentRoom, nsSocket } = useSelector(state => state.chatInfo)
  let {roomTitle} = currentRoom
  let userId = userData._id
  let {_id} = currentNs
  const [Open, setOpen] = useState(false);
  const [Size, setSize] = useState();

  function show(size) {
    setSize(()=>size);
    setOpen(true);
  }

  function close() { setOpen(false) }

  function leave() {
    nsSocket.emit('leaveRoom', {userId, _id});
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => { show('small') }}>Leave Room</Button>
      <Modal size={Size} open={Open} onClose={close} centered={true}>
        <Modal.Header>{roomTitle} 에서 나가시겠습니까?</Modal.Header>
          {/* <Modal.Content>
            <br/>
          </Modal.Content> */}
          <Modal.Actions>
            <Button negative onClick={close}>취소</Button>
            <Button
              positive
              icon='checkmark'
              labelPosition='right'
              content='나가기'
              onClick={leave}
            />
          </Modal.Actions>
        </Modal>
    </>
  );
};

export default LeaveRoom;