import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState } from 'react';

const NavBar = () => {
  const [isClicked, setIsClicked] = useState(false);
  function handleButton() {
    setIsClicked(true);
  }
  return (
    <div style={{ height : "50px", textAlign : "right" , color : "black", padding : "10px", backgroundColor : "grey"}}>
      <button onClick={handleButton}>회원정보 수정</button>
      {isClicked && <Redirect to="/usermodify" />}
    </div>
  );
};

export default NavBar;