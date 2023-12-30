const { Member } = require("../model");

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
        // console.log(data)
      } else {
        res.send(false);
      }
    })
    .catch((error) => {
      console.log("User Check Error", error);
      res.status(500).send("User Check Error");
    });
  };

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