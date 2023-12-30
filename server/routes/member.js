const express = require("express");
const router = express.Router();
const member = require("../controller/Cmember");

// 회원가입
router.post("/signup", member.post_signup);

// 로그인
router.post("/signin", member.post_signin);

// 회원 정보 페이지 (조회, 수정, 탈퇴)
router.get("/mypage", member.userInfo);
router.post("/mypage/update/:memberId", member.updateUserInfo);
router.post("/mypage/delete/:memberId", member.deleteUserInfo);

module.exports = router;
