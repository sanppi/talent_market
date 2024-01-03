const express = require("express");
const router = express.Router();
const member = require("../controller/Cmember");

// 회원가입
router.post("/signup", member.signUp);

// 로그인
router.post("/signin", member.signIn);

// 로그아웃
router.post("/signout", member.signOut);

// 회원가입 중복 검사 (id, nickname)
router.post("/checkDuplicate", member.checkDuplicate);

// 회원 정보 페이지 (조회, 수정, 탈퇴)
router.get("/mypage", member.userInfo);
router.post("/mypage/update/:memberId", member.updateUserInfo);
router.delete("/mypage/delete/:memberId", member.deleteUserInfo);

module.exports = router;
