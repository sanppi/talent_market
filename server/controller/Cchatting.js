const { Op } = require('sequelize');
const { Member } = require("../model");
const { ChattingRoom } = require("../model");
const { Board } = require("../model");

exports.getSessionInfo = (req, res) => {
  // console.log("req.session", req.session)
  // 세션 정보를 확인하고 필요한 데이터를 추출합니다.
  // const isAuthenticated = req.session.isAuthenticated;
  // const user = req.session.user;

  // console.log("isAuthenticated", isAuthenticated)
  // console.log("user", user)
  // 클라이언트로 세션 정보를 응답합니다.
  // res.json({ isAuthenticated, user });
  res.json({ result: true });
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