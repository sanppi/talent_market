const { Board } = require('../model');
const { Op } = require('sequelize'); // 추가된 부분

// 메인 화면
exports.index = async (req, res) => {
  try {
    const boards = await Board.findAll();
    res.json({ products: boards });
  } catch (error) {
    console.log('에러 코드 ', error);
    res.status(500).send('홈페이지에 접근할 수 없습니다.');
  }
};

// 검색 기능
exports.search = async (req, res, next) => {
  const words = req.query.search;

  try {
    let conditions = [
      {
        title: { [Op.like]: '%' + words + '%' },
      },
      {
        content: { [Op.like]: '%' + words + '%' },
      },
    ];

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

// 카테고리 별로 분류
exports.categories = async (req, res) => {
  try {
    const category = req.query.category;
    const boards = await Board.findAll({
      where: {category: category}
    })

    res.json({ products: boards });
  } catch (error) {
    console.log('에러 코드 ', error);
    res.status(500).send('홈페이지에 접근할 수 없습니다.');
  }
}

exports.getSession = async (req, res) => {
  const user = req.session.user;
  console.log('user', req.session);
  res.send({ result: true, user: user });
};
