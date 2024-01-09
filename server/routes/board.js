const express = require("express");
const router = express.Router();
const Cboard = require("../controller/Cboard");

// 게시글 작성
router.post("/create", Cboard.boardCreate);

// 게시글 페이지 조회
router.get("/:boardId", Cboard.boardDetail);

// 게시글 값 불러오가
router.get("/like/:boardId/:memberId", Cboard.getLike);

// 게시글 추천(좋아요) 기능 추가
router.post("/like/:boardId/:memberId", Cboard.boardLike);

// 게시글 수정
router.patch("/update/:boardId", Cboard.boardUpdate);

// 게시글 삭제
router.delete("/delete/:boardId", Cboard.boardDelete);

// 채팅방 생성
router.post("/chatRoom/create", Cboard.boardChat);

module.exports = router;
