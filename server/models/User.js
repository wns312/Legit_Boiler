const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {// 이름
    type: String,
    maxlength: 50,
    required : true
  },
  email: {// 유일값으로 설정
    type: String,
    trim: true, // 앞뒤공백제거
    unique: 1, // 유일값
    required : true
  },
  password: {
    type: String,
    minLength: 5,
    required : true
  },
  role: {// 관리자와 일반사용자 구분을 위해
    type: Number, //0이면 일반, 관리자면 1  구분
    default: 0, // 따로 정하지 않으면 role을 0을 준다
    required : true
  },
  image: {// 프로필이미지
    type : String, 
    required : true,
    default : 
    "https://scontent-lax3-1.cdninstagram.com/v/t51.2885-15/e35/s320x320/109488487_711845919377281_5934331567804909908_n.jpg?_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=101&_nc_ohc=Z6gzEfBk2psAX-qM4d-&oh=c18285690e640dc381335f777695525e&oe=5F43752D"
  },
  socket : { 
    type: String 
  },
  isConnected : { 
    type: Boolean
  },
  token: {// 토큰
    type: String,
  },
  tokenExp: {// 토큰 유효시간
    type: Number,
  },
}, {timestamps: true});

userSchema.pre('save', function (next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
})


userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err)
    callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function (callback) {
  let user = this; JSON.stringify()
  let token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {

    if (err) return callback(err);
    callback(null, user);
  });
};

//객체생성 안하고 쓸거라서 statics로 생성
userSchema.statics.findByToken = function (token, callback) {
  let user = this;
  //토큰을 복호화한다.
  jwt.verify(token, "secretToken", function (err, decoded) {//복호화 메소드
    //유저아이디로 유저를 찾고, 클라이언트에서 가져온 토큰을 비교
    user.findOne({ "_id": decoded, "token": token }, (err, user) => {
      if (err) return callback(err);
      callback(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema) // (모델의 이름, 스키마)
module.exports = { User }