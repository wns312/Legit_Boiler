import React, { useState, useRef } from 'react';
import {Editor, EditorState, RichUtils, getDefaultKeyBinding} from 'draft-js';
import { convertToHTML } from 'draft-convert';
import 'draft-js/dist/Draft.css';
import "./ChatModify.css"
import { useSelector } from 'react-redux';

let currentEditorState;
function ChatModify({roomId}) {
  let {userData} = useSelector(state=>state.user) 
  let {currentNs, nsSocket} = useSelector(state=>state.chatInfo)
  const [editorState, setEditorState] = useState(EditorState.createEmpty()
  );
  let editor = useRef();
  function focus() { editor.current.focus() }
  function onChange (e) {
    currentEditorState = e
    setEditorState(e)
  }

  function _onBlockClick(style) {
    onChange(RichUtils.toggleBlockType(editorState, style));
    setTimeout(() => { focus() }, 20);
    
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
      let {name, image} = userData
      nsSocket.emit("newMessageToServer", { NS_id : currentNs._id, roomId ,text, type : "text", userName : name, userImg : image, filename : ""});
      setEditorState(EditorState.createEmpty())
    }
  }


  return (
    <>
    <div className="modify-wrapper">
      <Editor 
        editorState={editorState} 
        onChange={(e)=>{onChange(e)}}
        handleKeyCommand={handleKeyCommand}
        ref={editor}
        keyBindingFn={keyBindingFn}
      />
    </div>
    <div className='modify-control'>
      <button onClick={() => { _onInlineClick('BOLD') }}>B</button>
      <button onClick={() => { _onInlineClick('ITALIC') }}>I</button>
      <button onClick={() => { _onInlineClick('UNDERLINE') }}>U</button>
      <button className="submit" onClick={Send}>전송</button>
    </div>
    </>
  );
}
export default ChatModify;