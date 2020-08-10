import React from 'react';
import { useState } from 'react';
import {Dropdown, Menu, Container, Button} from 'semantic-ui-react'
import axios from 'axios';

const NavBar = (props) => {
  const [isClicked, setIsClicked] = useState(false);
  function handleButton() {
    setIsClicked(true);
  }

  function onClickHandler(event) {
    axios.get(`api/users/logout`)
    .then(response=>{
      if(response.data.success){
        props.history.replace('/login')
      }else{
        alert("로그아웃 실패")
      }
    })
    
  }
  return (
    <div style={{ height : "50px"}}>
      <Menu fixed='top' inverted style={{ height : "50px"}}>
      <Container>
        <Menu.Item as='a' header>
          Project Name
        </Menu.Item>
        <Menu.Item as='a'>Home</Menu.Item>
        <Dropdown item simple text='Dropdown'>
          <Dropdown.Menu>
            <Dropdown.Item>List Item</Dropdown.Item>
            <Dropdown.Item>List Item</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Header Item</Dropdown.Header>
            <Dropdown.Item>
              <i className='dropdown icon' />
              <span className='text'>Submenu</span>
              <Dropdown.Menu>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Item>List Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
      <Button onClick={handleButton}>회원정보 수정</Button>
      <Button onClick={onClickHandler}>로그아웃</Button>
    </Menu>
      {isClicked && props.history.push("/usermodify")}
    </div>
  );
};

export default NavBar;