const mongoose = require("mongoose");

const nsSchema = mongoose.Schema({
  nsTitle: { // 이 값을 유저에게도 넣어서 참조할 때 쓸 것
    type: String,
    trim: true,
    required: true,
    unique : true
  },
  img: { // 이미지는 당연히 필요
    type: String,
    required: true,
  },
  rooms: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Room' 
    }
  ],
  nsMember : [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ]
}, {timestamps: true});

const NsModel = mongoose.model("Namespaces", nsSchema); // (모델의 이름, 스키마)
module.exports = { NsModel };