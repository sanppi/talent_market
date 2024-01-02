const { Member } = require("../model");
const { ChattingRoom } = require("../model");
const { Board } = require("../model");

exports.getBoardInfo = (req, res) => {
  ChattingRoom.findOne({
    where: {
      roomId: req.query.roomId,
    },
    include: [
      { model: Board, attributes: ["image","title","price","starAvg"] },
    ],
  })
  .then((result) => {
    if (result != null) {
      const data = {
        sellerMemberId: result.dataValues.sellerMemberId,
        buyerMemberId: result.dataValues.buyerMemberId,
        image: result.dataValues.Board.image,
        title: result.dataValues.Board.title,
        price: result.dataValues.Board.price,
        starAvg: result.dataValues.Board.starAvg,
      };
      res.send(data);
    } else {
      res.send(false);
    }
  })
  .catch((error) => {
    console.log("Get Board Info Error", error);
    res.status(500).send("Get Board Info Error");
  });
};

exports.postChat = (req, res) => {
  console.log("?????????????????", req.body)
  const data = {
    roomId: req.body.roomId,
    type: req.body.type,
    nickname: req.body.nickname,
    chatText: req.body.chatText
  };

  // SB: data를 DB에 업로드합니다.
  Map_Database.create(data).then(() => {
    // SB: 업데이트에 성공하면 업데이트 한 내용을 찾아 사용자 정보인 닉네임과 이미지를 포함하여 응답으로 전송합니다.
    Map_Database.findOne({
      where: {
        id: req.body.id,
        storeID: req.body.storeID,
        reviewComment: req.body.reviewComment,
        rating: req.body.rating,
      },
      include: [
        { model: User, attributes: ["nickname"] },
        { model: User, attributes: ["image"] },
      ],
    })
      .then((results) => {
        res.send(results.dataValues);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Internal Server Error");
      });
  });
};


