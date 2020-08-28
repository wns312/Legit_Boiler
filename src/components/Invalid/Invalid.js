import React, { useEffect } from "react";
import axios from "axios";

function Invalid(props) {
  useEffect(() => {
    axios.get("api/users/auth").then((response) => {
      if (response.data.isVerified) props.history.replace("/");
    });
  }, [props.history]);

  const onClickHandler = () => {
    axios.get("api/users/logout").then((response) => {
      console.log("response.data : ", response.data);
      if (response.data.success) {
        alert("로그아웃에 성공했습니다.");
        props.history.replace("/");
      } else {
        alert("로그아웃 하는데 실패 했습니다.");
      }
    });
  };

  const onResendEmail = () => {
    axios.get("/api/users/resend").then((response) => {
      (response.data.success) ? alert("이메일을 보냈습니다.") : alert("이메일 보내는데 실패 했습니다.");
    });
  };

  return (
    <div>
      <p>이메일 인증</p>
      <p> <button onClick={onClickHandler}>로그아웃</button> </p>
      <p> <button onClick={onResendEmail}>이메일 인증 재요청</button> </p>
    </div>
  );
}
export default Invalid;
