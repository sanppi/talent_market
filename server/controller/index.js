const { Board } = require("../model");

// 메인 화면
exports.index = async(req, res) => {
  // res.render("index");
  try{
    const boards = await Board.findAll();
    console.log(boards);
    res.json({ products: boards })
  }
  catch(error){
    console.log("에러 코드 ", error);
    res.status(500).send("홈페이지에 접근할 수 없습니다.")
  }
};