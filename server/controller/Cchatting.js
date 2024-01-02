const { Op } = require('sequelize');
const { Member } = require("../model");
const { ChattingRoom } = require("../model");
const { Board } = require("../model");

exports.getSessionInfo = (req, res) => {
  const user = req.session.user;
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
      memberId: req.query.memberId,
    },
    // 리더님 검색 기능 질문있습니다
    include: [
      { model: Member, attributes: ["nickname"] },
      { model: Board, attributes: ["title", "memberId"] },
    ],
  })
  .then((results) => {
    if (results.length > 0) {
      const data = results.map((result) => ({
        roomId: result.dataValues.roomId,
        memberId: result.dataValues.memberId,
        roomName: result.dataValues.roomName,
        nickname: result.dataValues.Member.nickname,
        title: result.dataValues.Board.title,
        sellerMemberId: result.dataValues.Board.memberId,
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

exports.deleteRoom = (req, res) => {
  console.log("req.data.roomId!!!!!!!!!!!!!!!!!!", req.body.roomId);
  ChattingRoom.destroy({
    where: {
      roomId: req.body.roomId,
    },
  })
  .then((result) => {
    if (result == 1) {
      res.send("채팅방이 삭제되었습니다.");
    } else {
      res.send("이미 삭제된 채팅방입니다.");
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(500).send("Delete Room Error");
  });
};