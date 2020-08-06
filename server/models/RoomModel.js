const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  roomTitle : { type: String },
  isPrivate :{ type: Boolean },//비밀방 공개방 여부
  isDM : { type: Boolean },
  history: [// 채팅내용
    {
      text: { type: String, required: true }, // 메시지본문
      type : {type: String, required: true}, // text / image / video
      time: { type: Date, required: true }, // 전송시간 (정렬할 때 쓰일 수도 있을 것)
      userName: { type: String, required: true }, // 전송자 이름
      avatar: { type: String, required: true }, // 유저이미지
      filename : {type: String}
    },
  ],
  namespace: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Namespaces'
  },
  member : [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' 
    }
  ]
}, {timestamps: true});

const RoomModel = mongoose.model("Room", roomSchema); // (모델의 이름, 스키마)
module.exports = { RoomModel };
