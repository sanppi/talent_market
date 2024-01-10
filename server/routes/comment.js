const express = require("express");
const router = express.Router();
const comment = require("../controller/Ccomment");

// 댓글 권한 확인
router.get("/check_authority", comment.checkAuthority);

// 댓글 작성
router.post("/create", comment.writeComment);

// 댓글 수정
router.patch("/update/:commentId", comment.updateComment);

// 댓글 삭제
router.delete("/delete/:commentId", comment.deleteComment);

module.exports = router;
