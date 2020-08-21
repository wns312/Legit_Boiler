import React, { useState, useRef } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import './ConverTed.css'
import { useSelector } from 'react-redux';
const ConverTed = ({scrollBottom, roomId}) => {
  let {userData} = useSelector(state=>state.user) 
  let {currentNs, nsSocket} = useSelector(state=>state.chatInfo)
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  let editor = useRef();

  function focus() {
    editor.current.focus();
  }
  function onChange (e) { setEditorState(e) }
  function handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  }

  function onTab(e) {
    const maxDepth = 4;
    onChange(RichUtils.onTab(e, editorState, maxDepth));
  }
  
  function toggleBlockType(blockType) {
    onChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    );
  }
  
  function toggleInlineStyle(inlineStyle) {
    onChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    );
  }
  
  let className = 'RichEditor-editor';
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  //메시지발신
  function Submit(event) {
    event.preventDefault();
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
    <div className="RichEditor-root">
    <div className={className} onClick={focus}>
      <Editor
        blockStyleFn={getBlockStyle}
        customStyleMap={styleMap}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={onChange}
        onTab={onTab}
        placeholder="Message"
        ref={editor}
        spellCheck={true}
      />
    </div>
  </div>
      <div id ='etc'>
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <button onClick={Submit}>전송</button>
    </div>
    
    </>
  );
};

export default ConverTed;

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}


// {key, active, label, onToggle, style}
const StyleButton = (props) => { 
  function onToggle(e){
    e.preventDefault();
    props.onToggle(props.style);
  };
  let className = 'RichEditor-styleButton';
  if (props.active) {
    className += ' RichEditor-activeButton';
  }
  return (
    <span className={className} onMouseDown={onToggle}>
    {props.label}&nbsp;&nbsp;
  </span>
  );
};

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </>
  );
};


const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

var INLINE_STYLES = [
  { label: 'B', style: 'BOLD' },
  { label: 'I', style: 'ITALIC' },
  { label: 'U', style: 'UNDERLINE' },
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};