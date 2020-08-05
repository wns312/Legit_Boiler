import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { registerUser } from '../../_actions/user_action';

const UserModify = () => {
  // const dispatch = useDispatch();

  const [ Email, setEmail ] = useState("");
  const [ Password, setPassword ] = useState("");
  const [ Name, setName ] = useState("");
  const [ Confirm, setConfirm ] = useState("");

  function onEmailHandler(event) {
    setEmail(event.target.value)
  }
  function onNameHandler(event) {
    setName(event.target.value)
  }
  function onPasswordHandler(event) {
    setPassword(event.target.value)
  }
  function onConfirmHandler(event) {
    setConfirm(event.target.value)
  }

  function onSubmitHandler(event) {
    event.preventDefault();

  }
  return (
    <div style={{display : "flex", justifyContent : "center", alignItems : "center"}}>
      <form id='registerform' onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler}/>
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler}/>
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler}/>
        <label>Confirm</label>
        <input type="password" value={Confirm} onChange={onConfirmHandler}/>
        <br/>
        <button>정보 수정</button>
      </form>
    </div>
  );
};

export default UserModify;