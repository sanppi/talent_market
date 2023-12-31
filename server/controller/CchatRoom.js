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
      { model: Member, attributes: ["nickname"] },
    ],
  })
  .then((result) => {
    if (result != null) {
      const data = {
        image: result.dataValues.Board.image,
        title: result.dataValues.Board.title,
        price: result.dataValues.Board.price,
        starAvg: result.dataValues.Board.starAvg,
        nickname: result.dataValues.Member.nickname,
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