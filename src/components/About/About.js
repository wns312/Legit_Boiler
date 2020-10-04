import React from 'react';
// import styles from './About.module.css'
import {Container, Header, Divider } from 'semantic-ui-react'

import Nav from '../Nav/Nav';

const About = () => {
    return (
        <>
            <Nav></Nav>
            <Container text style={{ marginTop: '7em' }}>
            <Header as='h1'>Semantic UI React Fixed Template</Header>
      <p>This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.</p>
            </Container>
            <Container style={{ margin: '5em 0em 0em'}}>
                <Divider inverted section />
            </Container>
        </>
    );
};

export default About;