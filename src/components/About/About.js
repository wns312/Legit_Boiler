import React from 'react';
import styles from './About.module.css'
import {Container, Header, Divider, Image } from 'semantic-ui-react'

import Nav from '../Nav/Nav';

const About = () => {
    return (
        <>
            <Nav></Nav>
            <Container text style={{ marginTop: '7em' }}>
            <Header as='h1'>조원 구성</Header>
            <div>
            <Image src="/default_profile.png" size='small' floated='left' alt="oh" verticalAlign='top'/>
            <p className={`${styles.body} ${styles.name}`}>김준영</p>
      <p className={styles.body}>This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.</p>
          </div>
          <div>
          <hr style={{ marginTop : "30px", width:"4rem", border : "2px solid", backgroundColor : "rgb(80, 80, 80)", borderColor: "rgb(80, 80, 80)"}} />
          <p className={`${styles.body} ${styles.name}`}>하고싶은 말</p>
          <p className={styles.quote}>"아자아자화이팅!!"</p>
          </div>
            </Container>
            <Container style={{ margin: '5em 0em 0em'}}>
                <Divider inverted section />
            </Container>

            <Container text style={{ marginTop: '1em' }}>
            <div>
            <Image src="/default_profile.png" size='small' floated='left' alt="oh" verticalAlign='top'/>
            <p className={`${styles.body} ${styles.name}`}>김준영</p>
      <p className={styles.body}>This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.</p>
          </div>
          <div>
          <hr style={{ marginTop : "30px", width:"4rem", border : "2px solid", backgroundColor : "rgb(80, 80, 80)", borderColor: "rgb(80, 80, 80)"}} />
          <p className={`${styles.body} ${styles.name}`}>하고싶은 말</p>
          <p className={styles.quote}>"아자아자화이팅!!"</p>
          </div>
            </Container>
            <Container style={{ margin: '5em 0em 0em'}}>
                <Divider inverted section />
            </Container>

            <Container text style={{ marginTop: '1em' }}>
            <div>
            <Image src="/default_profile.png" size='small' floated='left' alt="oh" verticalAlign='top'/>
            <p className={`${styles.body} ${styles.name}`}>김준영</p>
      <p className={styles.body}>This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.</p>
          </div>
          <div>
          <hr style={{ marginTop : "30px", width:"4rem", border : "2px solid", backgroundColor : "rgb(80, 80, 80)", borderColor: "rgb(80, 80, 80)"}} />
          <p className={`${styles.body} ${styles.name}`}>하고싶은 말</p>
          <p className={styles.quote}>"아자아자화이팅!!"</p>
          </div>
            </Container>
            <Container style={{ margin: '5em 0em 0em'}}>
                <Divider inverted section />
            </Container>

            <Container text style={{ marginTop: '1em' }}>
            <div>
            <Image src="/default_profile.png" size='small' floated='left' alt="oh" verticalAlign='top'/>
            <p className={`${styles.body} ${styles.name}`}>김준영</p>
      <p className={styles.body}>This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.
          This is a basic fixed menu template using fixed size containers.</p>
          </div>
          <div>
          <hr style={{ marginTop : "30px", width:"4rem", border : "2px solid", backgroundColor : "rgb(80, 80, 80)", borderColor: "rgb(80, 80, 80)"}} />
          <p className={`${styles.body} ${styles.name}`}>하고싶은 말</p>
          <p className={styles.quote}>"아자아자화이팅!!"</p>
          </div>
            </Container>
            <br/>
            <br/>
            <br/>
            <br/>
        </>
    );
};

export default About;