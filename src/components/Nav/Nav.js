import React from 'react';
import styles from './Nav.module.css'
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
} from 'semantic-ui-react'
const Nav = () => {
  return (
    <div>
      <Menu fixed='top' inverted style={{ height : '60px', width: '100%' }}>
      <Container style={{width: '85%'}}>
          <Menu.Item as='a' header style={{padding : '0 5px'}}>
            <Image size='mini' src='/logo.png' position="center" style={{ margin : '0 0 0 17px'}} />      
          </Menu.Item>
          <Menu.Item as='a' header>
            <span className={styles.titleText}>Legit</span>        
          </Menu.Item>
        <Menu.Item as='a' >A</Menu.Item>
        <Menu.Item as='a' >B</Menu.Item>
        
        <Menu.Item as='a' position='right' style={{ borderStyle : 'solid', borderWidth : '0 0.1px 0 0', borderColor : 'rgb(48, 48, 48)'}}>로그인</Menu.Item>
        <Menu.Item as='a' >회원가입</Menu.Item>
      </Container>
    </Menu>
    </div>
  );
};

export default Nav;