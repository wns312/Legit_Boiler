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
           <br/> <div>
            <Image src="/2.jpg" size='small' floated='left' alt="oh" verticalAlign='middle' circular className={styles.img} />
            <p className={`${styles.body} ${styles.name}`}>김준영</p>
      <p className={styles.body}>
            전반적인 개발일정 총괄과 전반적인 개발을 담당했습니다.
React, Redux, MongoDB, Socket.io, Express, Node.js를 다루어 보았습니다.
특히 프로젝트에서 Socket.io와 데이터베이스를 중점적으로 다루었습니다.</p><br/>
          </div>
          <div>
          <hr style={{ marginTop : "30px", width:"4rem", border : "2px solid", backgroundColor : "rgb(80, 80, 80)", borderColor: "rgb(80, 80, 80)"}} />
          <p className={`${styles.body} ${styles.name}`}>하고싶은 말</p>
          <p className={styles.quote}>"많은 것을 배울 수 있었고, 시간 관계상 구현하지 못한 부분이 많은 점이 아쉽습니다"</p>
          </div>
            </Container>
            <Container style={{ margin: '5em 0em 0em'}}>
                <Divider inverted section />
            </Container>

            <Container text style={{ marginTop: '1em' }}>
            <br/><div>
            <Image src="/1.jpg" size='small' floated='left' alt="oh" verticalAlign='top' circular className={styles.img}/>
            <p className={`${styles.body} ${styles.name}`}>김준호</p>
      <p className={styles.body}>
            이메일 인증과, 유저 인증에 중점을 두었습니다.
오픈 API를 이용한 일정관리, MongoDB를 이용한 DB설계를 중점적으로 다루었습니다.
React, Node.js, MongoDB, Express를 다루어보았습니다.</p><br/>
          </div>
          <div>
          <hr style={{ marginTop : "30px", width:"4rem", border : "2px solid", backgroundColor : "rgb(80, 80, 80)", borderColor: "rgb(80, 80, 80)"}} />
          <p className={`${styles.body} ${styles.name}`}>하고싶은 말</p>
          <p className={styles.quote}>"어려운 점도 많고 아쉬운 점도 있지만, 많은 것을 배울 수 있는 유익한 시간이었습니다"</p>
          </div>
            </Container>
            <Container style={{ margin: '5em 0em 0em'}}>
                <Divider inverted section />
            </Container>

            <Container text style={{ marginTop: '1em' }}>
            <br/><div>
            <Image src="/3.jpg" size='small' floated='left' alt="oh" verticalAlign='top' circular className={styles.img}/>
            <p className={`${styles.body} ${styles.name}`}>김태인</p>
      <p className={styles.body}>
            오픈 api를 이용해서 소셜로그인을 구현하였고 입력창에 대한 유효성 검사를 적용하였습니다.
또한 UI/UX 수정을 담당했습니다.
React, MongoDB, Express, Node.js를 다룰 수 있습니다.</p><br/>
          </div>
          <div>
          <hr style={{ marginTop : "30px", width:"4rem", border : "2px solid", backgroundColor : "rgb(80, 80, 80)", borderColor: "rgb(80, 80, 80)"}} />
          <p className={`${styles.body} ${styles.name}`}>하고싶은 말</p>
          <p className={styles.quote}>"React, Node.js, MongoDB에 관련 많은 것을 배울 수 있었고, 시간 분배를 잘 하지 못한 점이 아쉽습니다."</p>
          </div>
            </Container>
            <Container style={{ margin: '5em 0em 0em'}}>
                <Divider inverted section />
            </Container>

            <Container text style={{ marginTop: '1em' }}>
            <br/><div>
            <Image src="/4.jpg" size='small' floated='left' alt="oh" verticalAlign='top' circular className={styles.img}/>
            <p className={`${styles.body} ${styles.name}`}>황승빈</p>
      <p className={styles.body}>
            소켓을 이용한 채팅 구현에 중점을 두었습니다.
git과 github를 이용한 버전관리와 UX/UI를 중점적으로 다루었습니다.
React, Git, Github, Socket.io, Node.js를 다루어 보았습니다.</p><br/>
          </div>
          <div>
          <hr style={{ marginTop : "30px", width:"4rem", border : "2px solid", backgroundColor : "rgb(80, 80, 80)", borderColor: "rgb(80, 80, 80)"}} />
          <p className={`${styles.body} ${styles.name}`}>하고싶은 말</p>
          <p className={styles.quote}>"프로젝트가 마무리 되어 속이 후련하고, 더 많이 배우고 싶습니다"</p>
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
