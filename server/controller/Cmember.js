const { Member } = require("../model");

// 회원 가입
exports.signup = (req, res) => {
  res.render("signup");
};
exports.post_signup = (req, res) => {
  console.log(req.body);
  Member.create(req.body).then((result) => {
    console.log("User create:", result);
    res.send({ result: true });
  });
};

// 로그인
exports.signin = async (req, res) => {
  res.render("signin");
};
exports.post_signin = (req, res) => {
  Member.findOne({
    where: { id: req.body.id, pw: req.body.pw },
  }).then((result) => {
    console.log("User findOne:", result);
    if (result) res.send({ result: true, id: result.id });
    else res.send({ result: false });
  });
};

// 로그아웃
exports.signout = (req, res) => {};

// 회원 정보 페이지 조회
exports.userInfo = (req, res) => {};

// 회원 정보 수정
exports.updateUserInfo = (req, res) => {};

// 회원 탈퇴
exports.deleteUserInfo = (req, res) => {};
