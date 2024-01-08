const { ChattingRoom, ChattingText, Board, Member } = require("../model");

exports.getBuyRoomList = (req, res) => {
  ChattingRoom.findAll({
    where: {
      memberId: req.query.memberId,
    },
    include: [
      { model: Board, attributes: ["title", "memberId"] },
    ],
  })
  .then((results) => {
    if (results.length > 0) {
      const promises = results.map((result) => (
        ChattingText.findOne({
          where: {
            roomId: result.dataValues.roomId,
          },
          order: [['createdAt', 'DESC']],
        })
        .then((chattingTextResult) => {
          const latestCreatedAt = chattingTextResult ? chattingTextResult.createdAt : null;
        
          return {
            roomId: result.dataValues.roomId,
            roomName: result.dataValues.roomName,
            title: result.dataValues.Board.title,
            latestCreatedAt: latestCreatedAt,
          };
        })
      ));

      Promise.all(promises)
        .then((data) => {
          res.send(data);
        })
        .catch((error) => {
          console.log("Get Latest Created At Error", error);
          res.status(500).send("Get Latest Created At Error");
        });
    } else {
      // chattingRoomList가 없는 경우에 대한 처리
      console.log("No Chatting Room Exists");
      res.status(200).send([]);
    }
  })
  .catch((error) => {
    console.log("Get Buy Room List Error", error);
    res.status(500).send("Get Room List Error");
  });
};

exports.getSellRoomList = async (req, res) => {
  try {
    const results = await Board.findAll({
      where: {
        memberId: req.query.memberId,
      },
    });

    if (results.length > 0) {
      const promises1 = results.map(async (result) => {
        const ChattingRoomResults = await ChattingRoom.findAll({
          where: {
            boardId: result.dataValues.boardId,
          },
        });

        if (ChattingRoomResults.length > 0) {
          const promises2 = ChattingRoomResults.map(async (ChattingRoomResult) => {
            const chattingTextResult = await ChattingText.findOne({
              where: {
                roomId: ChattingRoomResult.dataValues.roomId,
              },
              order: [['createdAt', 'DESC']],
            });
            
            const latestCreatedAt = chattingTextResult ? chattingTextResult.dataValues.createdAt : result.dataValues.createdAt; // 수정된 부분
            
            const promises3 = await ChattingText.findAll({
              where: {
                roomId: ChattingRoomResult.dataValues.roomId,
              },
              order: [['createdAt', 'DESC']],
            });
            
            return {
              roomId: ChattingRoomResult.dataValues.roomId,
              roomName: ChattingRoomResult.dataValues.roomName,
              title: result.dataValues.title,
              latestCreatedAt: latestCreatedAt, // 수정된 부분
            };            
          });

          const data = await Promise.all(promises2);
          return data;
        }
      });

      const finalData = await Promise.all(promises1);

      // 데이터 포맷 변환
      const formattedData = finalData.flat().filter(Boolean).map(data => ({
        roomId: data.roomId,
        roomName: data.roomName,
        title: data.title,
        latestCreatedAt: data.latestCreatedAt
      }));

      res.send(formattedData);
    } else {
      // console.log("채팅방 조회 오류");
      // res.status(500).send("채팅방 조회 오류");
       // 판매하는 상품이 없는 경우 빈 배열을 반환
       res.send([]);
    }
  } catch (error) {
    console.log("판매방 목록 조회 오류", error);
    res.status(500).send("판매방 목록 조회 오류");
  }
};

exports.deleteRoom = (req, res) => {
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