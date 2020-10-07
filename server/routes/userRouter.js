const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

let storage = multer.diskStorage({
  // 파일이 저장될 스토리지경로와 저장될 파일명 지정
  destination: (req, file, callback) => {
    // 경로설정
    callback(null, `uploads/`); // 루트경로.uploads를 경로로 지정하겠다
  },
  filename: (req, file, callback) => {
    //파일이름설정 : 현재시_원래이름 으로 하였음
    callback(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    console.log(ext);
    if (ext !== ".jpg" || ext !== ".png") {
      return callback(new Error("only jpg, png is allowed"));
    }
    callback(null, true);
  },
});
const upload = multer({ storage: storage }).single("file"); // 지정된 storage로 upload함수 생성

//여기는 유저
router.post("/register", (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
      userInfo,
    }); // ??
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다",
      });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 일치하지 않습니다",
        });
      user.generateToken((err, user) => {
        let { _id, name, image, role, email, token } = user;
        res
          .cookie("x_auth", token)
          .status(200)
          .json({ loginSuccess: true, _id, name, image, role, email });
      });
    });
    if (!user.isVerified) {
      if (err) res.json({ success: false, err });
      else {
        sendingEmail(user);
      }
    }
  }).catch((err) => {
    return res.status(400).send(err);
  });
});

router.get("/auth", auth, (req, res) => {
  let { _id, role, email, name, image, password, isVerified, isSns } = req.user;
  res.status(200).json({
    _id,
    email,
    name,
    image,
    password,
    isVerified,
    isSns,
    isAdmin: role === 0 ? false : true,
    isAuth: true,
  });
});
//로그아웃
router.get("/logout", auth, (req, res) => {
  //유저를 찾아왔을테니 업데이트 해주어야 한다
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

router.get("/getValidation", auth, (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { isVerified: true },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({ success: true });
    }
  );
});

router.get("/resend", auth, (req, res) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    sendingEmail(user);
    return res.status(200).send({ success: true });
  }).catch((err) => {
    res.json({ success: false, err });
  });
});

router.post("/modify", auth, (req, res) => {
  let { user, body } = req;
  let { password, image, name } = body;
  User.findOne({ _id: user.id }, (err, user) => {
    if (err) return res.json({ success: false, err });
    User.updateOne(
      { _id: user._id },
      { $set: { password, image, name } },
      (err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({ success: true, user: userInfo });
      }
    );
  });
});

router.post("/uploadImage", (req, res) => {
  console.log("uploadImage");
  upload(req, res, (err) => {
    if (err) {
      console.log("업로드 에러 : " + err);
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/nopassmodify", auth, (req, res) => {
  console.log("auth 노패스 모디파이", req.user);
  User.findOne({ _id: req.user.id }, (err, user) => {
    console.log("파인드원", user);
    if (err) return res.json({ success: false, err });
    // console.log("user._id 아이디아이디", user._id)
    console.log("req.user 유저유저", req.user);
    console.log("req.body 바디바디", req.body);
    //req.body를 확인하기
    User.updateOne(
      { _id: user._id },
      {
        //$set을 해야 해당 필드만 바뀝니다. https://www.zerocho.com/category/MongoDB/post/579e2821c097d015000404dc
        $set: {
          //req.body => body로 보내고
          image: req.body.newImage,
          name: req.body.newName,
        },
      },
      console.log("req바디 패스워드", req.body.newPassword),
      (err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
          success: true,
          user: userInfo,
        });
      }
    );
  });
});

module.exports = router;

function sendingEmail(user) {
  const Verifiedtoken = jwt.sign(user._id.toHexString(), "registerToken");
  const url2 = `http://localhost:3000/valid/${Verifiedtoken}`;
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bitbitlegit@gmail.com",
      pass: "bhcyuadpcxxfibkw",
    },
  });

  const mailOptions = {
    from: "bitbitlegit@gmail.com",
    to: user.email,
    subject: "안녕하세요, 이메일 인증을 해주세요.",
    html: `Please, confirm your email by clicking the following link: <a href=${url2}>${url2}</a>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {});
}
