const {
  Member,
  Comment,
  Board,
  LikeBoardTable,
  ChattingList,
  sequelize,
  ChattingRoom,
} = require('../model');

const { Op } = require('sequelize');

// 회원가입
exports.signUp = async (req, res) => {
  try {
    const result = await Member.create(req.body);
    res.send({ result: true });
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error);
    res.status(500).json({ error: '회원가입 중 오류 발생' });
  }
};

// 회원가입 id,nickname 중복체크
exports.checkDuplicate = async (req, res) => {
  try {
    const { id, nickname } = req.body;

    if (id) {
      // 아이디 중복 확인
      const existingIdUser = await Member.findOne({
        where: { id: id },
      });

      if (existingIdUser) {
        console.log({ error: '중복된 아이디입니다.' });
        res.send({ result: false, type: '아이디' });
      } else {
        res.send({ result: true, type: '아이디' });
      }
    } else if (nickname) {
      // 닉네임 중복 확인
      const existingNicknameUser = await Member.findOne({
        where: { nickname: nickname },
      });

      if (existingNicknameUser) {
        console.log({ error: '중복된 닉네임입니다.' });
        res.send({ result: false, type: '닉네임' });
      } else {
        res.send({ result: true, type: '닉네임' });
      }
    } else {
      res.status(400).json({ error: '잘못된 요청입니다.' });
    }
  } catch (error) {
    console.error('중복 확인 중 오류 발생:', error);
    res.status(500).json({ error: '중복 확인 중 오류 발생' });
  }
};

// 로그인
exports.signIn = async (req, res) => {
  try {
    const result = await Member.findOne({
      where: { id: req.body.id, pw: req.body.pw },
    });

    if (result) {
      req.session.user = result.memberId;
      console.log(req.session);

      const userData = {
        memberId: result.memberId,
        id: result.id,
        nickname: result.nickname,
        redCard: result.redCard,
        email: result.email,
      };
      res.send({ result: true, userData });
    } else {
      res.send({ result: false });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 로그아웃
exports.signOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 삭제 중 에러:', err);
      res.status(500).send('세션 삭제 중 에러 발생');
    } else {
      res.redirect('/');
    }
  });
};

async function checkUser(targetMemberId) {
  if (!targetMemberId) return false;

  try {
    const member = await Member.findOne({
      where: { memberId: targetMemberId },
    });

    if (!member) return false;
    return true;
  } catch (err) {
    console.log('err', err);
    return false;
  }
}

// 마이페이지 조회 > 찜목록
exports.getFavorites = async (req, res) => {
  console.log(req.session);
  const targetMemberId = req.session.user;

  const check = checkUser(targetMemberId);

  if (!check)
    return res
      .status(404)
      .send({ success: false, message: '회원을 찾을 수 없습니다.' });

  try {
    const favorites = await LikeBoardTable.findAll({
      where: { memberId: targetMemberId },

      attributes: [
        [sequelize.fn('AVG', sequelize.col('stars')), 'averageStars'],
        [sequelize.fn('COUNT', sequelize.col('commentId')), 'reviewCount'],
      ],
      group: ['boardId', sequelize.col('LikeBoardTable.likeId')],

      include: [
        {
          model: Board,
          attributes: ['image', 'title', 'price', 'boardId'],
          include: [
            {
              model: Comment,
              attributes: [],
            },
          ],
          where: { isDelete: false },
        },
      ],
      order: [[Board, 'createdAt', 'DESC']],

      group: [
        'LikeBoardTable.likeId',
        'Board.boardId',
        'Board.image',
        'Board.title',
        'Board.price',
        'Board->Comments.commentId',
      ],
    });

    console.log('favorites', favorites);

    const formattedFavorites = favorites.map((favorite) => {
      const formattedFavorite = {
        boardId: favorite.Board.boardId,
        image: favorite.Board.image,
        title: favorite.Board.title,
        price: favorite.Board.price,
        averageStars:
          parseFloat(favorite.dataValues.averageStars).toFixed(1) || 0,
        reviewCount: parseInt(favorite.dataValues.reviewCount) || 0,
      };

      if (favorite.Comments && favorite.Comments.length > 0) {
        formattedFavorite.averageStars =
          parseFloat(favorite.Comments[0].dataValues.averageStars).toFixed(1) ||
          0;
        formattedFavorite.reviewCount =
          favorite.Comments[0].dataValues.reviewCount || 0;
      }

      return formattedFavorite;
    });

    res.send({ result: true, userData: formattedFavorites });
  } catch (error) {
    console.error('Error fetching favorites', error);
    res.status(500).send('Internal Server Error');
  }
};

// 마이페이지 조회 > 내 판매상품
exports.getSellingProducts = async (req, res) => {
  const targetMemberId = req.session.user;
  const check = checkUser(targetMemberId);

  if (!check)
    return res
      .status(404)
      .send({ success: false, message: '회원을 찾을 수 없습니다.' });

  try {
    const sellingProducts = await Board.findAll({
      where: { memberId: targetMemberId, isDelete: false },
      attributes: [
        'boardId',
        'image',
        'title',
        'price',
        [sequelize.fn('AVG', sequelize.col('stars')), 'averageStars'],
        [sequelize.fn('COUNT', sequelize.col('commentId')), 'reviewCount'],
      ],
      include: [
        {
          model: Comment,
          attributes: [],
        },
      ],
      group: ['boardId', 'commentId'],
      order: [['createdAt', 'DESC']],
    });

    const formattedSellingProducts = sellingProducts.map((product) => ({
      boardId: product.boardId,
      image: product.image,
      title: product.title,
      price: product.price,
      averageStars: parseFloat(product.dataValues.averageStars).toFixed(1) || 0,
      reviewCount: parseInt(product.dataValues.reviewCount) || 0,
    }));

    res.send({ result: true, userData: formattedSellingProducts });
  } catch (error) {
    console.error('Error fetching sellingProducts', error);
    res.status(500).send('Internal Server Error');
  }
};

// 마이페이지 조회 > 내 리뷰
exports.getMyReviews = async (req, res) => {
  const targetMemberId = req.session.user;
  const check = checkUser(targetMemberId);

  if (!check)
    return res
      .status(404)
      .send({ success: false, message: '회원을 찾을 수 없습니다.' });

  try {
    const reviews = await Comment.findAll({
      where: { memberId: targetMemberId },
      attributes: [
        'review',
        'title',
        'isAnonymous',
        'stars',
        'createdAt',
        'updatedAt',
        'commentId',
      ],
      include: [
        {
          model: Board,
          attributes: ['boardId'],
        },
        {
          model: Member,
          attributes: ['memberId', 'nickname'],
        },
      ],
    });

    const formattedReviews = reviews.map((review) => ({
      review: review.review,
      title: review.title,
      isAnonymous: review.isAnonymous,
      stars: review.stars,
      boardId: review.Board.boardId,
      memberId: review.Member.memberId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      commentId: review.commentId,
      Member: {
        nickname: review.Member.nickname,
      },
    }));

    console.log('update', formattedReviews);

    res.send({ result: true, userData: formattedReviews });
  } catch (error) {
    console.error('Error fetching reviews', error);
    res.status(500).send('Internal Server Error');
  }
};

// 마이페이지 조회
exports.userInfo = async (req, res) => {
  const targetMemberId = req.session.user;

  try {
    const member = await Member.findOne({
      where: { memberId: targetMemberId },
    });

    if (!member) {
      return res
        .status(404)
        .send({ result: false, message: '회원을 찾을 수 없습니다.' });
    }

    res.send({ result: true });
  } catch (error) {
    console.error('Error fetching user info', error);
    res.status(500).send('Internal Server Error');
  }
};

// 회원정보 수정
exports.updateUserInfo = async (req, res) => {
  try {
    const targetMemberId = req.session.user;
    const type = req.body.type;
    const userData = req.body.userData;

    const member = await Member.findOne({
      where: { memberId: targetMemberId },
    });

    if (!member) {
      return res
        .status(404)
        .send({ result: false, message: '회원을 찾을 수 없습니다.' });
    } else {
      // 닉네임 변경
      if (type === 'nickname') {
        const existingNickname = await Member.findOne({
          where: {
            nickname: userData,
          },
        });

        if (existingNickname) {
          res.send({
            result: false,
            message: '중복!',
          });
        } else {
          const nicknameUser = await Member.update(
            {
              nickname: userData,
            },
            { where: { memberId: targetMemberId } }
          );

          if (nicknameUser) {
            return res.send({
              result: true,
              message: '닉네임 수정 완료',
            });
          }
        }
      }

      // 이메일 변경
      if (type === 'email') {
        const existingEmail = await Member.findOne({
          where: {
            email: userData,
          },
        });

        if (existingEmail) {
          res.send({
            result: false,
            message: '중복!',
          });
        } else {
          const emailUser = await Member.update(
            {
              email: userData,
            },
            { where: { memberId: targetMemberId } }
          );

          if (emailUser) {
            return res.send({
              result: true,
              message: '이메일 수정 완료',
            });
          }
        }
      }

      // 비밀번호 변경
      if (type === 'pw') {
        const existingPw = await Member.findOne({
          where: { pw: userData.oldPw },
        });

        if (existingPw) {
          const pwUser = await Member.update(
            {
              pw: userData.newPw,
            },
            { where: { memberId: targetMemberId } }
          );

          if (pwUser) {
            return res.send({ result: true, message: '비밀번호 수정 완료' });
          }
        } else {
          return res.send({
            result: false,
            message: '기존 비밀번호가 일치하지 않습니다.',
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating user info', error);
    return res.status(500).send('Internal Server Error');
  }
};

// 결제 정보 등록 기능
exports.payRegister = async (req, res) => {
  try {
    const targetMemberId = req.params.memberId;
    const { bankName, accountNum } = req.body;

    const member = await Member.findOne({
      where: { memberId: targetMemberId },
    });

    if (member) {
      await member.update({
        bankName: bankName,
        accountNum: accountNum,
      });

      res.send({ result: true, message: '결제정보 등록 완료' });
    } else {
      res.status(404).send({ result: false, message: '결제정보 등록 불가' });
    }
  } catch (error) {
    console.error('Error registering account', error);
    res.status(500).send('Internal Server Error');
  }
};

// 회원 탈퇴
exports.deleteUserInfo = async (req, res) => {
  try {
    const targetMemberId = req.params.memberId;
    const member = await Member.findOne({
      where: { memberId: targetMemberId },
    });

    if (member) {
      await member.destroy();

      res.send({ result: true, message: '회원 탈퇴가 완료되었습니다.' });
    } else {
      res
        .status(404)
        .send({ result: false, message: '회원을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('Error deleting member', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.findAccount = async (req, res) => {
  try {
    const targetMemberId = req.params.memberId;
    const member = await Member.findOne({
      where: { memberId: targetMemberId },
    });

    // 정보 없음
    if (member.accountNum === 'NULL' || member.bankName === 'NULL') {
      return res.send({
        result: false,
        userData: { accountNum: '등록 정보 없음', bankName: '등록 정보 없음' },
      });
      // 정보 전달
    } else {
      return res.send({
        result: true,
        userData: { accountNum: member.accountNum, bankName: member.bankName },
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 에러');
  }
};
