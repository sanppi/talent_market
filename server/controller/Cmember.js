const { Member } = require('../model');

exports.signUp = async (req, res) => {
  try {
    console.log(req.body);
    const result = await Member.create(req.body);
    console.log('User create:', result);
    res.send({ result: true });
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error);
    res.status(500).json({ error: '회원가입 중 오류 발생' });
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

      console.log('nick', existingNicknameUser);

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
    } else res.send({ result: false });
  });
};

// 로그아웃
exports.signOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 삭제 중 에러:', err);
      res.status(500).send('세션 삭제 중 에러 발생');
    } else {
      res.redirect('/'); // 메인 페이지로 리다이렉트
    }
  });
};

// 회원 정보 페이지 조회
exports.userInfo = (req, res) => {};

// 회원 정보 수정
exports.updateUserInfo = (req, res) => {};

// 회원 탈퇴
exports.deleteUserInfo = (req, res) => {};
