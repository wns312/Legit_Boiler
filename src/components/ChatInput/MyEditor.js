import React, { useState, useRef } from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import { convertToHTML } from 'draft-convert';
import 'draft-js/dist/Draft.css';
import "./MyEditor.css"
import { useSelector } from 'react-redux';
function MyEditor({roomId, scrollBottom}) {
  let {userData} = useSelector(state=>state.user) 
  let {currentNs, nsSocket} = useSelector(state=>state.chatInfo)
  const [editorState, setEditorState] = useState(EditorState.createEmpty()
  );

  let editor = useRef();
  function focus() { editor.current.focus(); }
  function onChange (e) {
    setEditorState(e)
  }

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  function _onBlockClick(style) {
    onChange(RichUtils.toggleBlockType(editorState, style));
    setTimeout(() => { focus() }, 20);
    
  }

  function _onInlineClick(style) {
    onChange(RichUtils.toggleInlineStyle(editorState, style));
    setTimeout(() => { focus() }, 20);
  }

  function Send(e) {
    e.preventDefault();
    let text = convertToHTML(editorState.getCurrentContent())
    if(text!=="<p></p>") {
      let {name, image} = userData
      nsSocket.emit("newMessageToServer", { NS_id : currentNs._id, roomId ,text, type : "text", userName : name, userImg : image, filename : ""});
      setEditorState(EditorState.createEmpty())
    }
    setTimeout(()=>{scrollBottom()}, 50);
    setTimeout(()=>{focus()}, 100);
  }

  return (
    <>
    <div className="editor-wrapper">
      <Editor 
        editorState={editorState} 
        onChange={(e)=>{onChange(e)}}
        handleKeyCommand={handleKeyCommand}
        ref={editor}
      />
    </div>
    <div className='editor-control'>
    <button onClick={()=>{_onBlockClick('header-one')}}>H1</button>
    <button onClick={()=>{_onBlockClick('header-two')}}>H2</button>
    <button onClick={()=>{_onBlockClick('header-three')}}>H3</button>
    <button onClick={()=>{_onBlockClick('header-four')}}>H4</button>
    <button onClick={()=>{_onBlockClick('header-five')}}>H5</button>
    <button onClick={()=>{_onBlockClick('header-six')}}>H6</button>
    <button onClick={()=>{_onBlockClick('blockquote')}}>Blockquote</button>
    <button onClick={()=>{_onBlockClick('unordered-list-item')}}>UL</button>
    <button onClick={()=>{_onBlockClick('ordered-list-item')}}>OL</button>
    <button onClick={()=>{_onInlineClick('BOLD')}}>B</button>
    <button onClick={()=>{_onInlineClick('ITALIC')}}>I</button>
    <button onClick={()=>{_onInlineClick('UNDERLINE')}}>U</button>
    <button onClick={()=>{_onInlineClick('CODE')}}>M</button>
    <button className="submit" onClick={Send}>전송</button>
    </div>
    </>
  );
}
export default MyEditor;

// function onTab(e) {
//   e.preventDefault();
//   const maxDepth = 4;
//   onChange(RichUtils.onTab(e, editorState, maxDepth));
// }