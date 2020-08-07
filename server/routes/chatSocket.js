const express = require('express');
// const redis = require('redis');
const { NsModel } = require('../models/NsModel');
const { RoomModel } = require("../models/RoomModel");
const { User } = require("../models/User");

module.exports = function (io) {
  const router = express.Router();
  let nsTitleList;
  //Ns, Room 세팅        
  io.on("connection", (socket) => {
    let {handshake : {query : {_id}}} = socket // 유저 DB의 _id : 여기서 받은 _id로 db를 검색해 소켓id를 저장

    NsModel.find({nsMember : _id}).select('nsTitle img')//접속시 nsList전송
    .exec((err, nsArray) => {
      if(err) console.log(err);
      socket.emit("nsList", nsArray);
    });

    User.findOneAndUpdate({_id}, {socket : socket.id}, {new : true}).exec() // 접속시 유저의 socket id를 db에 저장

    socket.on('disconnect', ()=>{//접속해제시 socket을 파기
      User.findOneAndUpdate({_id}, {socket : ""}, {new : true}).select('socket').exec() // 접속 종료시 socket id를 db에서 제거
    })

    socket.on('clickNs', (data)=>{
      //클릭한 ns목록과 그에 맞는 방을 전송
      let {nsTitle, NS_id}= data
      NsModel.findOne({nsTitle}).populate('nsMember', 'email name socket image').select('nsTitle nsMember')
      .exec()
      .then((doc)=>{
        //본인한테 맞는 방을 가져왔다
        RoomModel.find({namespace : NS_id, member : _id})
        .populate('member', "name")
        .select("-history -createdAt -updatedAt -__v")
        .exec((err, rooms) => {
          socket.emit('currentNs', {doc, rooms}) // rooms도 보내야하는데 어캐보내지
        });
        console.log("클릭한 네임스페이스 : "+doc);
      })
      .catch((err)=>{
        console.log(err);
      })
    })
    

    socket.on("NewNs", (data) => { //새 ns요청이 왔을 시 생성 후 새 리스트 전송, 각종 ns.on 켜주기
      let {nsTitle}= data
      let result= nsTitleList.find( element=>(element ===nsTitle) )
      let img = "https://scontent-lax3-1.cdninstagram.com/v/t51.2885-15/e35/s320x320/109488487_711845919377281_5934331567804909908_n.jpg?_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=101&_nc_ohc=Z6gzEfBk2psAX-qM4d-&oh=c18285690e640dc381335f777695525e&oe=5F43752D"
      let newNs = new NsModel({ nsMember : [_id], nsTitle, img });
      
      newNs.save()
      .then((ns) => { // 새 NS를 DB에 추가
        console.log(ns);
        
        NsModel.find({nsMember : _id}).select('nsTitle img')
        .exec((err, nsArray) => {
          if(err) console.log(err);
          socket.emit("nsList", nsArray);
        });
        if(!result) { //만약 서버에서 생성한 ns의 on이 켜져있다면 if문은 실행되지 않는다
          let NS_io = io.of(`/${nsTitle}`) //새 네임스페이스와 방에 on 추가
          NS_io.on('connection', (nsSocket) => { //여기에서 DB요청을 하고 추가해야 실시간 데이터를 받아올 수 있다
            nsSettings(io, NS_io, nsSocket, ns);
          });
        }
      })
      .catch((err)=>{
        socket.emit('errorMsg', `네임스페이스가 이미 존재합니다 : ${err}`) // if (err || ns===undefined)
      })
    });

  });
  //애초에 서버가 켜지는 시점이므로 각 유저 접속시마다 켜면 안된다. 따라서 서버켜질 때 조회가 맞고, 추가되는 Ns는 추가로 켜주는게 맞는 것 같다
  NsModel.find({}) // 최소한의 정보로 ns 소켓서버만 켜주고 안에서는 연결시 다시 ns를 받아와야 맞는거 아닌가?
  .select('nsTitle')
  .exec((err, docs) => {
    nsTitleList = docs.map((element)=>element.nsTitle) 

    docs.forEach((ns) => { 
      let NS_io = io.of(`/${ns.nsTitle}`)
      NS_io.on('connection', (nsSocket) => {
        nsSettings(io, NS_io, nsSocket, ns)
      });
    });
  })
  return router
} 
  //---------------메소드들-----------------------
  function nsSettings(io, NS_io, nsSocket, ns) {
    let {handshake : {query : {_id}}}= nsSocket
    console.log(ns); // _id, nsTitle

    nsSocket.on('clickRoom', (_id)=>{
      console.log("클릭한 방 id : "+_id);
      //여기서 db접근해서 data로 방 상세정보 찾아오고 추후 history도 합쳐준다?(이건생각해보기)
      RoomModel.findOne({_id})
      .populate('member', "email name image")
      .select("-history -createdAt -updatedAt -__v")
      .exec((err, room) => {
        nsSocket.emit('currentRoomLoad', room)
      });
    })

    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      joinRoomInNs(NS_io, nsSocket,  ns, roomToJoin, numberOfUsersCallback)
    });

    nsSocket.on("NewRoom", (data)=>{
      createRoomInNs(NS_io, nsSocket, ns, data)
    })
    
    nsSocket.on("inviteToNs", (data)=>{
      inviteNS(io, NS_io, nsSocket, ns, data);
    });

    nsSocket.on("NewDM", (data)=>{
      createDM(NS_io, nsSocket, ns, data)
    })

    nsSocket.on('inviteToRoom', (data)=>{
      inviteRoom(NS_io, nsSocket, ns, data);
    })

    nsSocket.on('newMessageToServer', (data) => {//방에서 메시지를 받아서 '그 방으로' 메시지 보내기
    sendMessageToClients(NS_io, nsSocket, ns, data)
    })
  }

  // joinRoomInNs는 내부에서 updateUsersInRoom을 호출한다 (이건 그냥 참여이므로 수정할 것 없어보임)
  function joinRoomInNs(NS_io, nsSocket,  ns, roomToJoin, numberOfUsersCallback) {
    let roomToLeave = Object.keys(nsSocket.rooms)[1];
    console.log("참여하려는 방 이름 : "+roomToJoin);
    if (roomToLeave !== roomToJoin) {   // if문에 전체 명령을 넣어서 조건이 안맞을시 아무 코드도 실행 x
      nsSocket.leave(roomToLeave); //같은방 두번클릭시 leave만 되고 join이 안됨
      (roomToLeave !== undefined) && updateUsersInRoom(NS_io, roomToLeave); // 나갈때 적용
      nsSocket.join(roomToJoin);
      
      NS_io.to(roomToJoin).clients((err, client) => { //방인원 받아오기
        numberOfUsersCallback(client.length);
      });
      
      RoomModel.findOne({namespace : ns._id, _id : roomToJoin})
      .select('history -_id')
      .exec((err, doc)=>{ //history를 방채팅에 적용
        if(err) console.error(err);
        nsSocket.emit('historyCatchUp', doc.history);
        updateUsersInRoom(NS_io, roomToJoin);
      })
    }
  }

  //방을 만들때 방유저목록에 생성한 유저를 추가
  function createRoomInNs(NS_io, nsSocket, ns, data) {
    //공개방일 경우 모든 멤버를 방에 추가. (따라서 nsMember를받아와야함? 모름)
    let {roomTitle, isPrivate} = data; // _id와 ids
    let member;
    data.isPrivate ? (member = [data._id]) : (member = data.ids) // 비밀방 ? 비밀방일때 : 공개방일때
    let room = new RoomModel({roomTitle, isPrivate, namespace : ns._id, member});
    //방이름이 중복되지 않으면 save하기? 혹은 조건부저장방법찾아보기
    // find-save-find?? 극혐
    RoomModel.countDocuments({roomTitle, namespace : ns._id}).exec()
    .then((count)=>{
      console.log(`중복된 방 갯수 : ${count}`);
      if(!count) return room.save()
      nsSocket.emit('errorMsg', `중복된 방 이름이 존재합니다`);
    })
    .then(()=>{
      return RoomModel.find({namespace : ns._id}) // 모든방을 추가하면 안되고, 조건에 맞는방만 보내주어야 한다 (멤버에게는??)
        .populate('member', "email name image").select("-history").exec();
    })
    .then((rooms) => {
      (data.isPrivate) ? nsSocket.emit('nsRoomLoad', rooms) : NS_io.emit('nsRoomLoad', rooms) // 비밀방 ? 나한테만 / NS멤버 전부에게
    })
    .catch((err)=>{
      nsSocket.emit('errorMsg', `오류가 발생했습니다 : ${err}`);
    })
  }

  function inviteNS(io, NS_io, nsSocket, ns, data) {
    let {email, nsId} = data //이메일을 입력하면, nsMember에 당연히 없으므로 DB에서 검색 먼저 해야한다
    let {_id} = ns
    //(이건 진짜로 라우터로 먼저 유저 찾고나서 그다음 socket.emit 해도 될거같은데..)
    User.findOne({email}).select('email name socket').exec()
    .then((doc)=>{ //공개방 유저목록에 초대받은 유저 추가
      RoomModel.updateMany({ namespace: nsId, isPrivate:false }, { $addToSet : { member : doc._id} }) 
      .exec((err, res)=>{
        console.log(`검색된 공개방 갯수 : ${res.n} / 수정된 공개방 갯수 : ${res.nModified}`);
      })
      return doc
    })
    .then((doc)=>{//네임스페이스의 유저목록에 신규유저 추가하고 접속중인 ns유저들에게 새 목록을 보내준다
      NsModel.findOneAndUpdate({_id}, {$addToSet : {nsMember : doc._id}}, {new : true} )
      .populate('nsMember', 'email name socket image').select('nsTitle nsMember')
      .exec((err, ns)=>{
        NS_io.emit('updatecurrentNs', ns); //정상임 (얘는 네임스페이스목록만 업데이트 해줘야 하므로 루트io는 안됨)

        NsModel.find({nsMember : doc._id}).select('nsTitle img').exec((err, nsArray)=>{
          console.log("NS초대 시 조회가 제대로 되었는가? : "+nsArray[nsArray.length-1]);
          console.log("NS초대시 보내려는 socket id : "+doc.socket);
          if(doc.socket) io.to(doc.socket).emit("nsList", nsArray);
        });
      })
    })
    .catch((err)=>{
      nsSocket.emit('errorMsg', `오류가 발생했습니다 : ${err}`);
    })
  }

  //상대와 나에게만 추가하면된다 (상대에겐 아직 추가안함, 이것도 data해서 나중에 여기서 sort해서 내id와 상대id 구분해서 상대에게도 emit보내주어야함)
  function createDM(NS_io, nsSocket, ns, data) { // dm방 생성임
    let {invitedId} = data; // 상대의 _id(초대받은사람)
    let {nsTitle} = ns
    let {handshake : {query : {_id}}}= nsSocket // 만든 사람의 _id(본인)
    let member= [invitedId, _id].sort() // sort한 멤버목록
    console.log(ns); // 서버 구동 시점의 ns의 정보들 : nsMember / rooms / _id / nstitle / img
    //여기서도 nsSocket에 내 유저_id가 있으므로 상대member꺼만 가져와서 sort해주어서 배열을 만들어주면 된다
    let room = new RoomModel({roomTitle : (member[0]+member[1]) ,namespace: ns._id, member, isDM : true});
    room.save()
    .then(()=>{
      RoomModel.find({namespace : ns._id, member : _id}) //내아이디로 방검색해서 뿌려줌
      .populate('member', "email name image socket").select("-history -createdAt -updatedAt -__v")
      .exec((err, res)=>{
        nsSocket.emit('nsRoomLoad', res);
      });
      
      return RoomModel.find({namespace : ns._id, member : invitedId}) //상대아이디로 방검색해서 프로미스전달
      .populate('member', "email name image socket").select("-history -createdAt -updatedAt -__v")
      .exec();
    })
    .then((doc)=>{ // 상대아이디 방검색 결과를 뿌려줌
      User.findOne({_id : invitedId})
      .exec((err, user)=>{
        console.log(`네임스페이스의 엔드포인트 : /${nsTitle}#${user.socket}`);
        NS_io.to(`/${nsTitle}#${user.socket}`).emit('nsRoomLoad', doc) // 된다
      })
    })
    .catch((err)=>{
      console.log(" DM생성에러 : "+ err);
    })
  }

  function inviteRoom(NS_io, nsSocket, ns, data) {
    let {roomId, invitedUserId} = data
    let {nsTitle} = ns
    RoomModel.findOneAndUpdate({_id : roomId}, { $addToSet : {member : invitedUserId}}, { new : true})
    .select('-history -__v -createdAt -updatedAt').exec()
    .then((data)=>{
      nsSocket.emit('currentRoomLoad', data) // 나는 비밀방에 있으므로 나에게 방 업데이트를 적용해준다 (멤버정보는 클릭시 보도록 바꿀거니까 이정도만하기)
    })
    .then(()=>{
      return User.findOne({_id: invitedUserId}).select('socket').exec()
    })
    .then((doc)=>{
      if(doc.socket){    
        RoomModel.find({namespace : ns._id, member : invitedUserId}) // 엔드포인트가없잖아
        .populate('member', "email name image")
        .select("-history -createdAt -updatedAt -__v")
        .exec((err, rooms) => {

          NS_io.to(`/${nsTitle}#${doc.socket}`).emit('nsRoomLoad', rooms) // 된다
        });
      }
    })
    .catch((err)=>{
      nsSocket.emit('errorMsg', `오류가 발생했습니다 : ${err}`);
    })
  }

  function sendMessageToClients(NS_io, nsSocket, ns, data) {    
    let {text, type, userName, filename, userImg } = data
    const fullMsg = { //메시지 객체
      text, type, userName, filename,
      time: Date.now(),
      avatar: userImg
    };
    let roomTitle = Object.keys(nsSocket.rooms)[1]; //방엔드포인트 찾아서 할당

    RoomModel.findOneAndUpdate({ namespace : ns._id, _id: roomTitle },  { $push: { history: fullMsg } }, { new: true })
    .exec()
    .then((doc) => {
      if(doc!==null){
        console.log(doc.history[doc.history.length-1]);
        NS_io.to(roomTitle).emit("messageToClients", fullMsg); //방이름을 to에 넣어서 전송. 이때 io인 thisNs로 전송
      }else{
        nsSocket.emit('errorMsg', `메시지 전송에 실패했습니다 : ${userName} : ${text}`);
      }
    })
    .catch((err)=>{
      nsSocket.emit('errorMsg', `오류가 발생했습니다 : ${err}`);
    })
    
  }

  function updateUsersInRoom(NS_io, roomToJoin) {   // 인원수 업데이트 메소드를 따로 빼는이유는 나갈때도 적용시키기 위해
    NS_io.to(roomToJoin).clients((err, clients) => {
      console.log("접속중인 클라이언트 목록 : " + clients);
      console.log(`There are ${clients.length} people in the [${roomToJoin}] room`);
      NS_io.to(roomToJoin).emit('updateMembers', clients.length);
    })
  }
// const client = redis.createClient(6379, '3.15.39.170', { auth_pass: "tiger" });
// client.on("error", (error) => {
//   console.error(error);
// })