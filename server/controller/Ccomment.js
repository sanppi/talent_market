const { Comment, ChattingRoom } = require("../model");

// 후기 작성 권한 확인
exports.checkAuthority = async (req, res) => {
  try {
    const { memberId, boardId } = req.query;

    if (!memberId) {
      return res.status(403).send("로그인하지 않았다면 리뷰를 작성할 수 없습니다.");
    }

    const chatRoom = await ChattingRoom.findOne({
      where: { boardId: boardId, memberId: memberId },
    });

    if (chatRoom && chatRoom.canReview > 0) {
      res.status(200).send("You can write a review");
    } else {
      res.status(403).send("상품을 구매하지 않았다면 리뷰를 작성할 수 없습니다.");
    }
  } catch (error) {
    console.log("글 작성 권한 확인 오류 발생:", error);
    res.status(500).send("글 작성 권한 확인에 실패했습니다.");
  }
};

// 후기 작성
exports.writeComment = async (req, res) => {
  try {
    const { review, stars, title, memberId, boardId, isAnonymous } = req.body;

     // 후기를 작성할 수 있는 권한이 있는지 확인
    const chatRoom = await ChattingRoom.findOne({
      where: { boardId: boardId, memberId: memberId },
    });

    if (chatRoom && chatRoom.canReview > 0) {
      // 권한이 있다면 후기 작성
      await Comment.create({
        review, stars, title, memberId, boardId, isAnonymous,
      });
      // 후기 작성 후 canReview 차감
      await ChattingRoom.update(
        { canReview: chatRoom.canReview - 1 },
        { where: { boardId: boardId, memberId: memberId } }
      );
      res.status(200).send("create review success");
    } else {
      res.status(403).send("상품을 구매하지 않았다면 리뷰를 작성할 수 없습니다.");
    }
  } catch (error) {
    console.log("글 등록 오류 발생:", error);
    res.status(500).send("상품 후기를 작성할 수 없습니다.");
  }
};

// 후기 수정
exports.updateComment = async (req, res) => {
  try {
    const { review, stars, title, isAnonymous } = req.body;
    await Comment.update(
      { review, stars, title, isAnonymous },
      { where: { commentId: req.params.commentId } }
    );
    res.send("update review success");
  } catch(error) {
    console.error("글 수정 오류 발생:", error);
    res.status(500).send("상품 후기를 수정할 수 없습니다.");
  }
};

// 후기 삭제
exports.deleteComment = (req, res) => {
  Comment.destroy({
    where: { commentId: req.params.commentId },
  })
  .then((result) => {
    console.log("삭제 ", result);
    res.send({ result: true });
  })
  .catch((error) => {
    console.log("에러 메시지 ", error);
    res.status(400).send;
  });
};
