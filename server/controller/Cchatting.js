const { Member } = require("../model");

exports.userCheck = (req, res) => {
  Member.findOne({
    where: {
        id: req.query.id,
    },
  })
    .then((results) => {
      console.log(results)
      if (results != null) {
        const data = { nickname: results.dataValues.nickname };
        res.send(data);
        console.log(data)
      } else {
        res.send(false);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
  };