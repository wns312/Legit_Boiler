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
import { Link } from 'react-router-dom';
const Nav = () => {
  return (
    <div>
      <Menu fixed='top' inverted style={{ height : '60px', width: '100%' }}>
      <Container style={{width: '85%'}}>
          
          <Menu.Item as='a' header>
            <Image size='mini' src='/logo.png' position="center" style={{ margin : '0 15px 0 0px'}} />      
            <span className={styles.titleText}>LATEGUYS</span>        
          </Menu.Item>
        <Menu.Item as='a'><span className={styles.menu}>Main</span></Menu.Item>
        <Menu.Item as='a'><span className={styles.menu}>B</span></Menu.Item>
        
        <Menu.Item as='a' position='right' style={{ borderStyle : 'solid', borderWidth : '0 0.1px 0 0', borderColor : 'rgb(48, 48, 48)'}}>
          <Link to='/login'><span className={styles.menu}>Login</span></Link>
          </Menu.Item>
        <Menu.Item as='a' ><Link to='/register'><span className={styles.menu}>Sign Up</span></Link></Menu.Item>
      </Container>
    </Menu>
    </div>
  );
};

export default Nav;