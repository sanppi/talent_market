const { Member, Comment, Board, LikeBoardTable } = require("../model");

exports.signUp = async (req, res) => {
  try {
    // console.log(req.body);
    const result = await Member.create(req.body);
    // console.log("User create:", result);
    res.send({ result: true });
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    res.status(500).json({ error: "회원가입 중 오류 발생" });
  }
};

exports.checkDuplicate = async (req, res) => {
  try {
    const { id, nickname } = req.body;

    if (id) {
      // 아이디 중복 확인
      const existingIdUser = await Member.findOne({
        where: { id: id },
      });

      if (existingIdUser) {
        console.log({ error: "중복된 아이디입니다." });
        res.send({ result: false, type: "아이디" });
      } else {
        res.send({ result: true, type: "아이디" });
      }
    } else if (nickname) {
      // 닉네임 중복 확인
      const existingNicknameUser = await Member.findOne({
        where: { nickname: nickname },
      });

      // console.log("nick", existingNicknameUser);

      if (existingNicknameUser) {
        console.log({ error: "중복된 닉네임입니다." });
        res.send({ result: false, type: "닉네임" });
      } else {
        res.send({ result: true, type: "닉네임" });
      }
    } else {
      res.status(400).json({ error: "잘못된 요청입니다." });
    }
  } catch (error) {
    console.error("중복 확인 중 오류 발생:", error);
    res.status(500).json({ error: "중복 확인 중 오류 발생" });
  }
};

exports.signIn = (req, res) => {
  Member.findOne({
    where: { id: req.body.id, pw: req.body.pw },
  }).then((result) => {
    // console.log('User findOne:', result);
    if (result) {
      req.session.user = result.memberId;

      const userData = {
        memberId: result.memberId,
        id: result.id,
        nickname: result.nickname,
        redCard: result.redCard,
        // bankName: result.bankName,
        // accountNum: result.accountNum
      };
      res.send({ result: true, userData });
      // console.log("Logged in user ID:", req.session.user);
    } else res.send({ result: false });
  });
};

// 로그아웃
exports.signOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("세션 삭제 중 에러:", err);
      res.status(500).send("세션 삭제 중 에러 발생");
    } else {
      res.redirect("/"); // 메인 페이지로 리다이렉트
    }
  });
};

// 마이페이지 조회 -> 수정 더 필요

exports.userInfo = async (req, res) => {
  const targetMemberId = req.session.memberId;

  try {
    const member = await Member.findOne({
      where: { memberId: targetMemberId },
    });

    if (!member) {
      return res
        .status(404)
        .send({ success: false, message: "회원을 찾을 수 없습니다." });
    }

    const listItem = req.query.listItem; // 클라이언트에서 전달한 리스트 항목

    if (listItem === "favorites") {
      try {
        const favorites = await LikeBoardTable.findAll({
          where: { memberId: targetMemberId },
          include: [
            {
              model: Board,
              attributes: ["image", "title", "price"],
            },
            {
              model: Comment,
              attributes: [
                [sequelize.fn("AVG", sequelize.col("stars")), "averageStars"],
                [
                  sequelize.fn("COUNT", sequelize.col("commentId")),
                  "reviewCount",
                ],
              ],
              where: { boardId: sequelize.col("LikeBoardTable.boardId") },
              required: false, // LEFT JOIN
            },
          ],
        });

        const formattedFavorites = favorites.map((favorite) => ({
          image: favorite.Board.image,
          title: favorite.Board.title,
          price: favorite.Board.price,
          averageStars: favorite.Comments[0]?.dataValues.averageStars || 0, // 별점 평균
          reviewCount: favorite.Comments[0]?.dataValues.reviewCount || 0, // 후기 개수
        }));

        res.send({ success: true, favorites: formattedFavorites });
      } catch (error) {
        console.error("Error fetching favorites", error);
        res.status(500).send("Internal Server Error");
      }
    } else if (listItem === "reviews") {
      try {
        const reviews = await Comment.findAll({
          where: { memberId: targetMemberId },
          include: [
            {
              model: Board,
              attributes: ["title"],
            },
          ],
        });

        const formattedReviews = reviews.map((review) => ({
          reviewContent: review.review,
          productTitle: review.Board.title,
        }));

        res.send({ success: true, reviews: formattedReviews });
      } catch (error) {
        console.error("Error fetching reviews", error);
        res.status(500).send("Internal Server Error");
      }
    } else if (listItem === "sellingProducts") {
      try {
        const sellingProducts = await Board.findAll({
          where: { memberId: targetMemberId },
          include: [
            {
              model: Comment,
              attributes: [
                [sequelize.fn("AVG", sequelize.col("stars")), "averageStars"],
                [
                  sequelize.fn("COUNT", sequelize.col("commentId")),
                  "reviewCount",
                ],
              ],
            },
          ],
        });

        const formattedSellingProducts = sellingProducts
          .filter((product) => product.memberId === targetMemberId) // 판매자 여부 체크
          .map((product) => ({
            image: product.image,
            title: product.title,
            price: product.price,
            averageStars: product.Comments[0]?.dataValues.averageStars || 0,
            reviewCount: product.Comments[0]?.dataValues.reviewCount || 0,
          }));

        res.send({ success: true, sellingProducts: formattedSellingProducts });
      } catch (error) {
        console.error("Error fetching selling products", error);
        res.status(500).send("Internal Server Error");
      }
    }
  } catch (error) {
    console.error("Error fetching user info", error);
    res.status(500).send("Internal Server Error");
  }
};

// 회원 정보 수정
exports.updateUserInfo = async (req, res) => {
  try {
    const targetMemberId = req.params.memberId;

    // 클라이언트로부터 전달받은 수정된 정보
    const { nickname, email, pw } = req.body;

    // 해당 멤버 찾기
    const member = await Member.findOne({
      where: { memberId: targetMemberId },
    });

    if (member) {
      // 수정된 정보로 회원 업데이트
      member.nickname = nickname;
      member.email = email;
      member.pw = pw;

      await member.save();

      res.send({ success: true, message: "회원 정보가 업데이트되었습니다." });
    } else {
      res
        .status(404)
        .send({ success: false, message: "회원을 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("Error updating member info", error);
    res.status(500).send("Internal Server Error");
  }
};

// 회원 탈퇴
exports.deleteUserInfo = async (req, res) => {
  try {
    const targetMemberId = req.params.memberId;

    // 해당 멤버 찾기
    const member = await Member.findOne({
      where: { memberId: targetMemberId },
    });

    if (member) {
      // 회원 삭제
      await member.destroy();

      // 세션에서 사용자 정보 삭제
      // req.session.destroy();

      res.send({ success: true, message: "회원 탈퇴가 완료되었습니다." });
    } else {
      res
        .status(404)
        .send({ success: false, message: "회원을 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("Error deleting member", error);
    res.status(500).send("Internal Server Error");
  }
};
