import React, { useState } from 'react';
import './LandingPage.css'
import Namespaces from '../Namespaces/Namespaces'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Dimmer, Loader} from 'semantic-ui-react'

const LandingPage = () => {
  let {userData}= useSelector((state)=>state.user)
  const [isStoreLoaded, setStoreLoad] = useState(false);

  useEffect(()=>{
    if(userData) setStoreLoad(true);
  }, [userData])
  return (
    <>
      {isStoreLoaded 
      ? <Namespaces></Namespaces>
      : <Dimmer active> <Loader /> </Dimmer>
      }
    </>
  );
};

export default LandingPage