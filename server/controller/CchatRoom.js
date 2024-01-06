const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Member } = require("../model");
const { Board } = require("../model");
const { ChattingRoom } = require("../model");
const { ChattingText } = require("../model");

exports.getBoardInfo = async (req, res) => {
  const chattingroom = await ChattingRoom.findOne({
    where: {
      roomId: req.query.roomId,
    }, 
    include: [
      { model: Member, attributes: ["nickname"] },
      { model: Board, attributes: ["memberId", "image", "title", "price"], include: [
        { model: Member, attributes: ["nickname"] },
      ]},
    ],
    raw: true
  }).catch((error) => {
    console.log("Get Board Info Error", error);
    res.status(500).send("Get Board Info Server Error");
  });
  const data = {
    buyerMemberId: chattingroom.memberId,
    sellerMemberId: chattingroom['Board.memberId'],
    image: chattingroom['Board.image'],
    title: chattingroom['Board.title'],
    price: chattingroom['Board.price'],
    sellerNickname: chattingroom['Board.Member.nickname'],
    buyerNickname: chattingroom['Member.nickname'],
  };
  res.send(data)
};

exports.getChatText = (req, res) => {
  ChattingText.findAll({
    where: {
      roomId: req.query.roomId,
      [Op.or]: [
        { memberId: req.query.myMemberId },
        { memberId: req.query.otherMemberId }
      ]
    }
  })
  .then((results) => {
    if (results.length > 0) {
      const data = results.map((result) => (
        {
        memberId: result.dataValues.memberId,
        chatText: result.dataValues.chatText,
        createdAt: result.dataValues.createdAt,
      }
      ));
      res.send(data);
    } else {
      res.send(false);
    }
  })
  .catch((error) => {
    console.log("Get Room List Error", error);
    res.status(500).send("Get Room List Error");
  });
};


exports.postChat = (req, res) => {
  const data = {
    roomId: req.body.roomId,
    memberId: req.body.memberId,
    chatText: req.body.chatText
  };
  // SB: data를 DB에 업로드합니다.
  ChattingText.create(data).then(() => {
    console.log("Post Chat Success")
    res.send(true);
  }).catch((error) => {
    console.log(error);
    res.status(500).send("Post Chat Server Error");
  });
};


