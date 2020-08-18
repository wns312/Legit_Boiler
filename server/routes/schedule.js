const express = require('express');
const { Event } = require("../models/Event");
const { Schedule } = require("../models/Schedule");
const { NsModel } = require('../models/NsModel');
const { RoomModel } = require("../models/RoomModel");
const { User } = require("../models/User");
const fs = require('fs');
module.exports = function (io, mongoose) {
  const router = express.Router();

  router.get("/getEvent", (req, res)=>{
    getEventList(res)
  })
  
  //클라이언트에서 받아서 db로 넣는거
  router.post("/", (req, res) => {
    let { title, end, start, desc, _id } = req.body; 
    console.log(_id);  //아이디가 없으면 undefined가 뜬다.
    if (_id === undefined) {
      _id = new mongoose.Types.ObjectId();  //undefined이면 오브젝트 아이디를 만드러줌
    } // _id가 없으면 만들어준다
    console.log("modified : " + _id);
    Event.findOneAndUpdate(
      { _id }, // 검색조건
      { title, start, end, desc}, //바꾸는 값들
      { upsert: true }).exec()   
      .then((eventInfo) => {       
        getEventList(res);
      })
      // .catch((err)=>{           //에러를 잡는데 위에 함수에서 대신 해줌
      //   return res.json({ success: false, err });
      // })
  });
  
  router.post("/moveEvent", (req, res) => {
    let { _id, start, end } = req.body; // 객체 // 오브젝트로 묶어줘야한다.
    console.log(_id, start, end);
    Event.findOneAndUpdate({ _id }, { start, end }, { new: true })
      .exec() //exec를 통해서 실행시켜준다 => 비동기를 동기식으로 처리한다.
      .then(() => {
        // => 비동기식이였기 때문에 순서의 상관없어서 데이터가 바로 넣어질때랑 딜레이가 잇었을떄가 있었음
        getEventList(res);
      });
  });

  router.post("/resizeEvent", (req, res) => {
    console.log(req.body);
    let { _id, start, end } = req.body; // 오브젝트 // 오브젝트로 묶어줘야한다.
    console.log(_id, start, end);                       //https://www.zerocho.com/category/MongoDB/post/579e2821c097d015000404dc
                                                      //new를 쓰는 이유는?? 수정 이후의 다큐먼트를 반환할 지 결정하는 부분입니다. { new: true }를 넣으면 수정 이후의 다큐먼트를 반환합니다.
    Event.findOneAndUpdate({ _id }, { start, end }, { new: true })
      .exec()           //exec를 통해서 실행시켜준다 => 비동기를 동기식으로 처리한다.
      .then(() => {     // => 비동기식이였기 때문에 순서의 상관없어서 데이터가 바로 넣어질때랑 딜레이가 잇었을떄가 있었음
        getEventList(res);
      });
  });
  
  router.post("/removeEvent", (req,res)=>{
      let { _id } = req.body; // 오브젝트로 묶어줘야한다.
      console.log(req.body)   //{req.body._id}는 안됨
      Event.deleteOne({_id})
      .exec()           //exec를 통해서 실행시켜준다 => 비동기를 동기식으로 처리한다.
      .then(() => {     // => 비동기식이였기 때문에 순서의 상관없어서 데이터가 바로 넣어질때랑 딜레이가 잇었을떄가 있었음
        getEventList(res);
      });
  });
  
  
  
  function getEventList(res) {
    Event.find({}).exec()
    .then((db)=>{
      // console.log(db)
      return res.status(200).json({
        success : true,
        event: db //event라는 이름으로 db 내용을 가져온다.
      })
    })
    .catch((err)=>{
      return res.json({ success: false, err });
    })
  }
  return router
} 
