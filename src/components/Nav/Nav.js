import React from 'react';
import styles from './Nav.module.css'
import {Container, Image, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
const Nav = () => {
  return (
    <div>
      <Menu fixed='top' inverted style={{ height : '60px', width: '100%' }}>
      <Container style={{width: '85%'}}>
          
        <Menu.Item as={Link} to='/login' header>
          <Image size='mini' src='/logo.png' position="center" style={{ margin : '0 15px 0 0px'}} />      
          <span className={styles.titleText}>LAZYGUYS</span>        
        </Menu.Item>
        <Menu.Item as={Link} to='/login'><span className={styles.menu}>Main</span></Menu.Item>
        <Menu.Item as={Link} to='/about'><span className={styles.menu}>About</span></Menu.Item>
        
        <Menu.Item as={Link} to='/login' position='right' style={{ borderStyle : 'solid', borderWidth : '0 0.1px 0 0', borderColor : 'rgb(48, 48, 48)'}}>
          <span className={styles.menu}>Login</span>
          </Menu.Item>
        <Menu.Item as={Link} to='/register'><span className={styles.menu}>Sign Up</span></Menu.Item>
      </Container>
    </Menu>
    </div>
  );
};

export default Nav;