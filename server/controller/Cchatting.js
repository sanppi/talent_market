const { Op } = require('sequelize');
const { Member } = require("../model");
const { ChattingRoom } = require("../model");
const { Board } = require("../model");

exports.getSessionInfo = (req, res) => {
  console.log("req.session", req.session.id)
  console.log("req.session", req.session.user)
  const user = req.session.user;
  console.log("user", user)
  // 클라이언트로 세션 정보를 응답합니다.
  // res.json({ isAuthenticated, user });
  res.json(user);
};

exports.userCheck = (req, res) => {
  Member.findOne({
    where: {
      memberId: req.query.memberId,
    },
  })
  .then((results) => {
    if (results != null) {
      const data = {
        nickname: results.dataValues.nickname
      };
      res.send(data);
    } else {
      res.send(false);
    }
  })
  .catch((error) => {
    console.log("User Check Error", error);
    res.status(500).send("User Check Error");
  });
};

exports.getRoomList = (req, res) => {
  ChattingRoom.findAll({
    where: {
      [Op.or]: [
        { sellerMemberId: req.query.memberId },
        { buyerMemberId: req.query.memberId }
      ]
    },
    include: [
      { model: Board, attributes: ["title"] },
    ],
  })
  .then((results) => {
    if (results.length > 0) {
      const data = results.map((result) => ({
        roomId: result.dataValues.roomId,
        sellerMemberId: result.dataValues.sellerMemberId,
        buyerMemberId: result.dataValues.buyerMemberId,
        roomName: result.dataValues.roomName,
        title: result.dataValues.Board.title,
      }));
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