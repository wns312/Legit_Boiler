import React, { useState } from 'react';
import './LoginPage.css'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { useDispatch } from "react-redux"
import {loginUser} from '../../_actions/user_action'
import { Link } from 'react-router-dom';

const LoginPage = (props) => {
  const dispatch = useDispatch();

  const [ Email, setEmail ] = useState("");
  const [ Password, setPassword ] = useState("");

  function onEmailHandler(event) {
    setEmail(event.target.value)
  }
  function onPasswordHandler(event) {
    setPassword(event.target.value)
  }
  function onSubmitHandler(event) {
    event.preventDefault();
    let body = {
      email : Email,
      password : Password
    }
    dispatch(loginUser(body))
    .then(response=>{
      if(response.payload.loginSuccess){
        props.history.push('/')
      }else{
        alert("Error")
      }
    }) 
  }
  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='blue' textAlign='center'>
        Log-in to your account
      </Header>
      <Form size='large' onSubmit={onSubmitHandler}>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' value={Email} onChange={onEmailHandler}/>
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
            value={Password} 
            onChange={onPasswordHandler}
          />

          <Button color='blue' fluid size='large'>
            Login
          </Button>
        </Segment>
      </Form>
      <Message>
        계정이 없나요? <Link to='/register'>Sign Up</Link>
      </Message>
    </Grid.Column>
    </Grid>
  );
};

export default LoginPage;