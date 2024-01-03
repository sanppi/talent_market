const { Member } = require("../model");
const { Board } = require("../model");
const { ChattingRoom } = require("../model");
const { ChattingtText } = require("../model");

exports.getBoardInfo = (req, res) => {
  ChattingRoom.findOne({
    where: {
      roomId: req.query.roomId,
    },
    include: [
      { model: Board, attributes: ["memberId", "image", "title", "price"] },
    ],
  })
    .then((result) => {
      if (result != null) {
        const buyerMemberId = result.dataValues.memberId;
        const sellerMemberId = result.dataValues.Board.memberId;

        Member.findOne({
          where: {
            memberId: buyerMemberId, // buyerMemberId로 검색합니다.
          },
        })
          .then((buyerResult) => {
            if (buyerResult != null) {
              // 리더님 이 코드 약간 비효율적이어 보이는데 최선일까요?
              Member.findOne({
                where: {
                  memberId: sellerMemberId,
                },
              })
                .then((sellerResult) => {
                  if (sellerResult != null) {
                    const data = {
                      buyerMemberId: buyerMemberId,
                      sellerMemberId: sellerMemberId,
                      image: result.dataValues.Board.image,
                      title: result.dataValues.Board.title,
                      price: result.dataValues.Board.price,
                      sellerNickname: sellerResult.dataValues.nickname,
                      buyerNickname: buyerResult.dataValues.nickname, // buyerNickname을 추가합니다.
                    };
                    res.send(data);
                  } else {
                    res.send(false);
                  }
                })
                .catch((error) => {
                  console.log("Seller Member findOne Error", error);
                  res.status(500).send("Seller Member findOne Server Error");
                });
            } else {
              res.send(false);
            }
          })
          .catch((error) => {
            console.log("Buyer Member findOne Error", error);
            res.status(500).send("Buyer Member findOne Server Error");
          });
      } else {
        res.send(false);
      }
    })
    .catch((error) => {
      console.log("Get Board Info Error", error);
      res.status(500).send("Get Board Info Server Error");
    });
};

exports.getChatText = (req, res) => {
  // 리더님 이거 같은 검색조건인데 위 함수와 합치는게 나을까요 나눠두는게 나을까요?
  console.log("req.query!!!!!!!!!!!!!!!!!!!", req.query.roomId)
  // ChattingtText.findAll({
  //   where: {
  //     roomId: req.query.roomId,
  //   },
  //   include: [
  //     { model: Board, attributes: ["memberId", "image", "title", "price"] },
  //   ],
  // })
  //   .then((result) => {})

  //   .catch((error) => {
  //     console.log("Get Board Info Error", error);
  //     res.status(500).send("Get Board Info Server Error");
  //   });
};


exports.postChat = (req, res) => {
  const data = {
    roomId: req.body.roomId,
    type: req.body.type,
    nickname: req.body.nickname,
    chatText: req.body.chatText
  };
  // SB: data를 DB에 업로드합니다.
  ChattingtText.create(data).then(() => {
    console.log("Post Chat Success")
    res.send(true);
  }).catch((error) => {
    console.log(error);
    res.status(500).send("Post Chat Server Error");
  });
};


