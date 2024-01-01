const { Member } = require("../model");
const { ChattingRoom } = require("../model");
const { Board } = require("../model");

exports.getBoardInfo = (req, res) => {
  ChattingRoom.findOne({
    where: {
      roomId: req.query.roomId,
    },
    include: [
      { model: Board, attributes: ["image"] },
      { model: Board, attributes: ["title"] },
      { model: Board, attributes: ["price"] },
      { model: Board, attributes: ["starAvg"] },
      // 리더님 FK를 Member에서 두 개(sellerMemberId, buyerMemberId) 걸어서
      // include로 가져올 때 어떻게 해야 할 지 모르겠습니다.
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