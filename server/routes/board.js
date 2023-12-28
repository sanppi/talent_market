const express = require("express");
const router = express.Router();
const Cboard = require("../controller/Cboard");

router.post("/create", Cboard.boardCreate);



// 게시글 페이지 조회
// router.get("/:boardId", Cboard.boardPage);

// 게시글 검색
// router.get("/search", Cboard.search);

// 게시글 작성 페이지
// router.get("/create", Cboard.writePage);

// 게시글 작성
// router.update("/create", Cboard.createBoard);

// 게시글 수정
// router.patch("/update/:boardId", Cboard.updateBoard);

// 게시글 삭제
// router.delete("/delete/:boardId", Cboard.deleteBoard);

// 게시글 추천(좋아요) 기능
// router.patch("board/like/:boardId", Cboard.boardLike);

module.exports = router;