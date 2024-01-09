const { upload } = require("../multer/multerConfig"); // Multer 설정 파일 import
const { Board, LikeBoardTable, Comment, Member, ChattingRoom } = require("../model");

// 클라이언트 product, 서버 board

// SB: 클라이언트 등록하기 버튼과 연결된 부분입니다.
// 미들웨어를 사용해야해서 양식이 다릅니다.
// 게시글 작성
const boardCreateHandler = async (req, res) => {
  try {
    // 클라이언트에서 전송한 데이터 확인
    const { title, price, category, content, memberId } = req.body;
    const image = req.file ? req.file.filename : null;

    const newBoard = await Board.create({
      title, price, category, content, memberId,
      image: image || null,
    });

    res.send({ message: "Success", boardId: newBoard.boardId });
    console.log("Success");
  } catch (error) {
    console.error("글 등록 오류 발생:", error);
    res.status(500).send("상품 게시글을 작성할 수 없습니다.");
  }
};

// 게시글 페이지 조회
const boardDetailPage = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const product = await Board.findOne({
      where: { boardId: boardId },
      include: [{ model: Member, attributes: ["nickname"] }],
    });

    const reviews = await Comment.findAll({
      where: { boardId: boardId },
      include: [{ model: Member, attributes: ["nickname"] }],
    });

    if (product) {
      product.views += 1;
      await product.save();
      res.json({ product: product, reviews: reviews });
    } else {
      res.status(404).send("상품 정보를 조회할 수 없습니다.");
    }
  } catch (error) {
    console.error("에러 발생: ", error);
    res.status(500).send("상세 페이지에 접근할 수 없습니다.");
  }
};

// 찜 개수 불러오기
const getLikeStatus = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const memberId = req.params.memberId;

    const like = await LikeBoardTable.findOne({
      where: { boardId: boardId, memberId: memberId },
    });

    res.json({ success: true, isLike: !!like });
  } catch (error) {
    console.log("찜 상태 확인 에러:", error);
    res.status(500).send("찜 상태를 확인할 수 없습니다.");
  }
};

// 게시글 찜하기 (좋아요) 기능
const toggleLike = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const memberId = req.params.memberId;

    // 해당 상품 게시글에 대한 찜 정보 확인
    const like = await LikeBoardTable.findOne({
      where: { boardId: boardId, memberId: memberId },
    });

    if (like) {
      // 이미 찜한 상품이 있다면 찜하기 취소
      await like.destroy();
    } else {
      // 찜하지 않았다면 찜하기
      await LikeBoardTable.create({
        boardId: boardId,
        memberId: memberId,
      });
    }

    const likeCount = await LikeBoardTable.count({
      where: { boardId: boardId },
    });
    await Board.update({ likeNum: likeCount }, { where: { boardId: boardId } });

    res.json({ success: true, likeNum: likeCount });
  } catch (error) {
    console.log("찜하기 에러:", error);
    res.status(500).send("상품을 찜할 수 없습니다.");
  }
};

// 상세 페이지 수정
const boardUpdateProcess = async (req, res) => {
  try {
    const { title, price, category, content, isOnMarket } = req.body;
    const image = req.file ? req.file.filename : null;

    // 이미지를 변경하는 경우에만 image 필드를 업데이트
    const imageUpdate = req.file ? { image } : {};

    await Board.update(
      { title, price, category, content, isOnMarket, ...imageUpdate },
      { where: { boardId: req.params.boardId } }
    );
    
    res.send({ message: "update Success" });
  } catch (error) {
    console.error("에러 메시지 ", error);
    res.status(500).send("게시글을 수정할 수 없습니다.");
  }
};

// 게시글 삭제 처리
const boardIsDeleted = async (req, res) => {
  try{
    const { isDelete } = req.body;

    await Board.update({
        isDelete
      }, { 
        where: { boardId: req.params.boardId } 
      }
    );    
    res.send({ message: "delete Success" });
  }
  catch(error){
    console.error("에러 메시지 ", error);
    res.status(500).send("게시글을 삭제할 수 없습니다.");
  }
}

// 게시글 데이터 삭제
const boardDeleteProcess = (req, res) => {
  Board.destroy({
    where: { boardId: req.params.boardId },
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

// 채팅방 생성
const createChatRoom = async (req, res) => {
  try {
    const { memberId, boardId } = req.body;

    const nickname = await Member.findOne({
      where: { memberId: req.body.memberId },
    });

    const title = await Board.findOne({
      where: { boardId: req.body.boardId },
    });

    const chattingRoomName = `${title.title}/${nickname.nickname}`

    // 이미 존재하는 채팅방인지 확인
    const existingRoom = await ChattingRoom.findOne({ where: { roomName: chattingRoomName, boardId: boardId } });
    if (existingRoom) {
      return res.send({ message: "채팅방이 이미 존재합니다.", roomId: existingRoom.roomId });
    }

    const newChatRoom = await ChattingRoom.create({
      memberId,
      boardId,
      roomName: chattingRoomName
    });

    res.send({ message: "채팅방이 생성되었습니다.", roomId: newChatRoom.roomId });
    console.log("ChatRoom created successfully");
  } catch (error) {
    console.error("ChatRoom creation error:", error);
    res.status(500).send("Cannot create chat room.");
  }
};

module.exports = {
  boardCreate: [upload.single("image"), boardCreateHandler],
  boardDetail: boardDetailPage,
  getLike: getLikeStatus,
  boardLike: toggleLike,
  boardUpdate: [upload.single("image"), boardUpdateProcess],
  boardDelete: boardIsDeleted,
  boardChat: createChatRoom,
};