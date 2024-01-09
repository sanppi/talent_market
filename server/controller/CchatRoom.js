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

exports.getAccountNumber = (req, res) => {
  Member.findOne({
    where: {
      memberId: req.query.memberId,
    }
  })
  .then((result) => {
    console.log("result!!!!!!!!!!!!!!!", result.bankName, result.accountNum)
    if (result.bankName == "NULL" || result.accountNum == "NULL") {
      res.send(false)
    } else if (result.bankName !== "NULL" && result.accountNum !== "NULL") {
      const data = {
        bankName: result.bankName,
        accountNum: result.accountNum
      };
      res.send(data);
    }
  })
  .catch((error) => {
    console.log("Get Account Number Error", error);
    res.status(500).send("Get Account Number Error");
  });
};

exports.patchBuyerInfo = (req, res) => {
  console.log("req!!!!!!!!!!!!!!!!", req.body.roomId)
  // res.send(req)
  ChattingRoom.findOne({
    where: {
      roomId: req.body.roomId,
    },
  })
  .then((result) => {
    console.log(result.dataValues.canRedCard, result.dataValues.canReview)
    const data = {
      canRedCard: result.dataValues.canRedCard + 1,
      canReview: result.dataValues.canReview + 1,
    };
    console.log(data)
    ChattingRoom.update(data, {
      where: {
        roomId: req.body.roomId,
      },
    })
      .then((result) => {
        // SB: 업데이트 성공의 결과로 나온 result를 이용한 조건문입니다.
        if (result == 1) {
          res.send(true);
        } else if (result == 0) {
          res.send(false);
        } else {
          res.status(500).send("Patch Buyer Info Error");
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Patch Buyer Info Error");
      });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).send("Patch Buyer Info Error");
  });
};