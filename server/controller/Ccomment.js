const { Comment } = require("../model");

// 클라이언트 review, 서버 comment

// 후기 작성
exports.writeComment = async (req, res) => {
    try{
        const { review, stars } = req.body;
        await Comment.create({
            review, stars
        })
        res.send("create review success");
    }
    catch{
        console.error("글 등록 오류 발생:", error);
        res.status(500).send("상품 후기를 작성할 수 없습니다.");
    }
}

// 후기 수정
exports.updateComment = async (req, res) => {
    try{
        const { review, stars } = req.body;
        await Comment.update(
            { review, stars},
            { where: { commentId: req.params.commentId } }    
        )
        res.send("update review success");
    }
    catch{
        console.error("글 수정 오류 발생:", error);
        res.status(500).send("상품 후기를 수정할 수 없습니다.");
    }
}

// 후기 삭제
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