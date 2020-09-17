import React, { useState } from 'react';
import { useDispatch } from "react-redux"
import { registerUser, loginUser } from '../../_actions/user_action'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'
import './RegisterPage.css'
const RegisterPage = (props) => {
  const dispatch = useDispatch();

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
    if(Password!==Confirm) {
      return alert("비밀번호와 비밀번호확인이 일치하지 않습니다")
    }
    // 정규 표현식
    // const idPattern = /^[A-Za-z]{1}[A-Za-z0-9]{3,19}$/; // 영어로 시작해야하고, 숫자포함가능
    // const pwPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/; //
    // const emailPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;




    let body = {email : Email, name : Name, password : Password }
    dispatch(registerUser(body))
    .then(response=>{
      //payload는 이미 {success: boolean}을 가리키므로 Success라고 하면안됨
      if(response.payload.success){
        dispatch(loginUser(body)).then((response) => {
          if (response.payload.loginSuccess) {
            props.history.replace("/invalid");
          } 
        });
      }else{
        alert("Error")
        console.log("에러메시지 : ",response.payload)
      }
    }) 
  }
  return (
<Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
  <Grid.Column style={{ maxWidth: 450 }}>
    <Header as='h2' color='blue' textAlign='center'>
      Sign-in
    </Header>
    <Form size='large' onSubmit={onSubmitHandler}>
      <Segment stacked>
        <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' value={Email} onChange={onEmailHandler}/>
        <Form.Input fluid icon='user' iconPosition='left' placeholder='Name' value={Name} onChange={onNameHandler}/>
        <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password' value={Password} onChange={onPasswordHandler}/>
        <Form.Input fluid icon='lock' iconPosition='left' placeholder='Confirm Password' type='password' value={Confirm} onChange={onConfirmHandler}/>
        <Button color='blue' fluid size='large'>
          Sign In
        </Button>
      </Segment>
    </Form>
  </Grid.Column>
</Grid>
  );
};

export default RegisterPage;