const { upload } = require("../multer/multerConfig"); // Multer 설정 파일 import
const { Board } = require("../model");

// SB: 클라이언트 등록하기 버튼과 연결된 부분입니다.
// 미들웨어를 사용해야해서 양식이 다릅니다.
// 게시글 작성
const boardCreateHandler = async (req, res) => {
    try{
        // 클라이언트에서 전송한 데이터 확인
        const { title, price, category, content } = req.body;
        const image = req.file ? req.file.filename : null;

        await Board.create({
            title,
            price,
            category,
            content,
            image: image || null
        })
    
        res.send("Success");
        console.log("Success");
    } catch(error) {
        console.error("글 등록 오류 발생:", error);
        res.status(500).send("상품 게시글을 작성할 수 없습니다.");
    }
};

module.exports = {
    boardCreate: [upload.single("image"), boardCreateHandler],
};

// 게시글 페이지 조회
exports.boardPage = async (req, res) => {
    try{
        const boardId = req.params.boardId;
        const board = await Board.findOne({
            where: { boardId: boardId }
            // include 추가 예정
        })

        // 댓글 불러오기 추가 예정

        // 로그인 확인 추가 예정

        res.json({ board: board }) // 이 코드는 수정 가능성이 있습니다.
        console.log("show product details by boardId");
    }
    catch (error) {
        console.log("에러 코드 ", error);
        res.status(500).send("상세 페이지에 접근할 수 없습니다.")
    }
}

// 게시글 검색
exports.search = (req, res) => {
    
}

// 게시글 수정 페이지
exports.updateBoardPage = (req, res) => {
    // 로그인 확인 추가 예정

    // 사용자 추가 예정
}

// 게시글 수정
exports.updateBoard = async (req, res, next) => {
    try{
        const { title, price, category, content } = req.body;

        // 이미지는 일단 보류 했습니다.

        await Board.update(
            { title, price, category, content },
            { where: { boardId: req.params.boardId } }
        )
        res.send("update success")
    }
    catch{
        console.error("에러 메시지 ", error);
        res.status(500).send("게시글을 수정할 수 없습니다.")
    }
}

// 게시글 삭제
exports.deleteBoard = (req, res) => {
    Board.destroy({
        where: { boardId: req.params.boardId }
    }).then((result) => {
        console.log("삭제 ", result);
        res.send({ result: true });
    }).catch((error) => {
        console.log("에러 메시지 ", error);
        res.status(400).send;
    })
}

// 게시글 추천(좋아요) 기능
exports.boardLike = (req, res) => {
    
}