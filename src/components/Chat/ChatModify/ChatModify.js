import React, { useState, useRef } from 'react';
import {Editor, EditorState, RichUtils, getDefaultKeyBinding} from 'draft-js';
import { convertToHTML } from 'draft-convert';
import 'draft-js/dist/Draft.css';
import './Draft.css';
import styles from "./ChatModify.module.css"
import { useSelector } from 'react-redux';

let currentEditorState;
function ChatModify({message, roomId, Close}) {
  let {nsSocket} = useSelector(state=>state.chatInfo)
  const [editorState, setEditorState] = useState(EditorState.createEmpty()
  );
  let editor = useRef();
  function focus() { editor.current.focus() }
  function onChange (e) {
    currentEditorState = e
    setEditorState(e)
  }

  function _onInlineClick(style) {
    onChange(RichUtils.toggleInlineStyle(editorState, style));
    setTimeout(() => { focus() }, 20);
  }
  
  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  function keyBindingFn(e) {//tab키는 9 엔터는 13
    if (e.ctrlKey && e.keyCode === 13) {
      return 'split-block' 
    }
    if (e.keyCode === 13) {
      Send()
      return
    }
    return getDefaultKeyBinding(e);
  }

  function Send() {
    let text = convertToHTML(currentEditorState.getCurrentContent())
    if(text!=="<p></p>") {
      nsSocket.emit("newMessageToServer", {...message, text : text, type : "text/modified" ,roomId: roomId});
      setEditorState(EditorState.createEmpty())
      Close()
    }
  }
  


  return (
    <>
    <div className={styles.modify_wrapper}>
      <Editor 
        editorState={editorState} 
        onChange={(e)=>{onChange(e)}}
        handleKeyCommand={handleKeyCommand}
        ref={editor}
        keyBindingFn={keyBindingFn}
      />

    </div>
    <div className={styles.modify_control}>
      <span onClick={() => { _onInlineClick('BOLD') }}>B</span>
      <span onClick={() => { _onInlineClick('ITALIC') }}>I</span>
      <span onClick={() => { _onInlineClick('UNDERLINE') }}>U</span>
      <span className="submit" onClick={Close} >취소</span>
      <span className="submit" onClick={Send} >전송</span>
    </div>

    </>
  );
}
export default ChatModify;