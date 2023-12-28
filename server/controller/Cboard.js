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
exports.boardPage = (req, res) => {

}

// 게시글 검색
exports.search = (req, res) => {
    
}

// 게시글 작성 페이지
exports.writePage = (req, res) => {
    
}

// 게시글 수정
exports.updateBoard = (req, res) => {

}

// 게시글 삭제
exports.deleteBoard = (req, res) => {

}

// 게시글 추천(좋아요) 기능
exports.boardLike = (req, res) => {
    
}