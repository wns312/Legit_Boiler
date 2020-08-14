import React from 'react';
import './Modal.css';
import { useRef } from 'react';
const Modal = () => {
  let modal = useRef();
  let overlay = useRef();
  

  function Open() {
    console.log(modal.current.classList);
    modal.current.classList.remove("hidden") // 클래스리스트에서 특정 클래스네임제거
  }
  function Close() {
    console.log(modal.current.classList.value);
    modal.current.classList.add("hidden")
  }

  return (
    <>
      <div id='list_header_button' onClick={Open}>
        <span id='list_header_teamname'>Legit</span>
        <span id='list_header_username'># 김준영</span>
      </div>
      <div ref={modal} className="modal hidden" onClick={Close}>
        <div ref={overlay} className="modal__overlay"></div>
        <div className="modal__content">
        </div>
      </div>
      
    </>
  );
};

export default Modal;