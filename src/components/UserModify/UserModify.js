import React, { useState, useEffect } from 'react';
import axios from 'axios'
import DropZone from 'react-dropzone'

const UserModify = (props) => {
  const [updatePasswordConfirm, setUpdatePasswordConfirm] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [currentName, setCurrentName] = useState("");
  const [UpdateName, setUpdateName] = useState("");

  const [currentImage, setCurrentImage] = useState("");

  const [filePath, setFilePath] = useState("");


  useEffect(() => {
    axios.get("api/users/auth").then((response) => {
      let {name, image, password} = response.data
        if(response.data.isAuth){
          setCurrentName(name)
          setCurrentImage(image)
          setCurrentPassword(password)
        } else {
          alert("유저정보를 가져오는데 실패했습니다.")
          props.history.push("")
        }
    });
  }, [props.history]);
  const onNameHandler = (event) => {
    setUpdateName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setUpdatePassword(event.currentTarget.value);
  }

  const onConfirmPasswordHandler = (event) => {
    setUpdatePasswordConfirm(event.currentTarget.value);
  }


  const onDrop = files => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    console.log(files);
    formData.append("file", files[0]);

    axios.post("/api/users/uploadImage", formData, config)
    .then((response) => {
      if(response.data.success) {
      console.log("업로드이미지",response.data)

      setFilePath(response.data.filePath)
    }
  })
}

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(updatePassword !== updatePasswordConfirm){
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }
    // console.log("커렌트 패스워드",currentPassword)
    //비크립트 떄문에 무조건 다를수밖에 없음
    console.log("패스워드", updatePassword)

    let body = {
      newName: UpdateName !== "" ? UpdateName : currentName,
      // password: currentPassword,
      newPassword: updatePassword !== "" ? updatePassword : currentPassword,
      newImage: filePath !== "" ? filePath : currentImage,
    };  
    
    if(updatePassword !== ""){
    axios.post('/api/users/modify',body)
    .then((response) => console.log("mypage",response.data.user))
    alert("회원정보가 수정되었습니다.");
    props.history.push("/"); //auth에서 먼저임
    } 
    else if(updatePassword === ""){
      axios.post("/api/users/nopassmodify", body)
      .then((response) => console.log("mypage",response.data.user))
      alert("회원정보가 수정되었습니다.");
      props.history.push("/"); //auth에서 먼저임
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems:'center'
      ,width: '100%', height: '100vh'
    }}>

  <DropZone onDrop={onDrop} multiple={false} maxSize={10000000}>
      {({ getRootProps, getInputProps }) => (
        <div
          style={{
            width: "300px",
            height: "240px",
            border: "1px solid lightgray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
            {...getRootProps()}
        >
      <input {...getInputProps()} />
    </div>
    )}
  </DropZone>
  <div>
    {currentImage && <img src={
        currentImage 
          ? `http://${process.env.REACT_APP_IP_ADDRESS}:9000/${currentImage}`
          : `http://${process.env.REACT_APP_IP_ADDRESS}:9000/${filePath}`
      }
      alt="haha" 
      style={{width : '300px', height:"300px"}}
      />}

  </div>
    <form style={{display:'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>

      <label>Name</label>
      <input type="text" value={UpdateName} onChange={onNameHandler}></input>

      <label>New PassWord</label>
      <input type="password" value={updatePassword} onChange={onPasswordHandler} placeholder=""/>
      <label>Confirm PassWord</label>
      <input type="password" value={updatePasswordConfirm} onChange={onConfirmPasswordHandler}/>
      <br/>
      <button type = "submit">
        회원 수정
      </button>
    </form>
  </div>
  )
};

export default UserModify;