const { Board } = require('../model');
const { Op } = require('sequelize'); // 추가된 부분

// 메인 화면
exports.index = async (req, res) => {
  // res.render("index");
  try {
    const boards = await Board.findAll();
    // console.log(boards);
    res.json({ products: boards });
  } catch (error) {
    console.log('에러 코드 ', error);
    res.status(500).send('홈페이지에 접근할 수 없습니다.');
  }
};

exports.search = async (req, res, next) => {
  const words = req.query.search;
  const category = req.query.category; // 카테고리를 query에서 받아옵니다.

  try {
    let conditions = [
      {
        title: { [Op.like]: '%' + words + '%' },
      },
      {
        content: { [Op.like]: '%' + words + '%' },
      },
    ];

    // 만약 카테고리가 존재한다면, conditions에 카테고리 조건을 추가합니다.
    if (category) {
      conditions.push({
        category: { [Op.eq]: category },
      });
    }

    const results = await Board.findAll({
      where: {
        [Op.or]: conditions,
      },
    });

    res.json(results);
  } catch (err) {
    next(err);
  }
};

exports.getSession = async (req, res) => {
  const user = req.session.user;
  console.log('user', req.session);
  res.send({ result: true, user: user });
};
