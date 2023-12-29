const { Comment } = require("../model");

// 댓글 작성
exports.writeComment = (req, res) => {

}

// 댓글 수정
exports.updateComment = (req, res) => {
    
}

// 댓글 삭제
exports.deleteComment = (req, res) => {
    Comment.destroy({
        where: { commentId: req.params.commentId }
    }).then((result) => {
        console.log("삭제 ", result);
        res.send({ result: true });
    }).catch((error) => {
        console.log("에러 메시지 ", error);
        res.status(400).send;
    })
}