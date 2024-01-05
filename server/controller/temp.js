// 회원정보 수정
exports.updateUserInfo = async (req, res) => {
  try {
    const targetMemberId = req.session.user;
    const { type, userData } = req.body;

    let updateField = {};
    switch (type) {
      case 'nickname':
      case 'email':
        updateField[type] = userData;
        break;
      case 'pw':
        // pw
        break;
      default:
        return res.status(400).json({ result: false });
    }

    const isDuplicate = await Member.findOne({
      where: {
        [type]: userData,
      },
    });

    if (isDuplicate) {
      return res.json({
        result: false,
        isDuplicate: true,
      });
    }

    const updatedMember = await Member.update(updateField, {
      where: { memberId: targetMemberId },
    });

    if (updatedMember[0] === 1) {
      return res.send({ result: true });
    } else {
      return res.send({ result: false });
    }

    // console.log('update', updatedMember);

    // Member에 해당 nickname을 가진 레코드가 있는지 보고
    // -> 있으면 빠꾸 / 없으면 업데이트

    // const member = await Member.findOne({
    //   where: { memberId: targetMemberId },
    // });

    // if (!member) {
    //   return res
    //     .status(404)
    //     .send({ result: false, message: "회원을 찾을 수 없습니다." });
    // }

    // // 이메일 변경
    // if (email) {
    //   // 이메일 중복 확인
    //   const existingEmailUser = await Member.findOne({
    //     where: { email: email },
    //   });

    //   if (existingEmailUser) {
    //     console.log({ error: "중복된 이메일입니다." });
    //     return res.send({ result: false, type: "이메일" });
    //   } else {
    //     member.email = email;
    //     await member.save();
    //     return res.send({ result: true, type: "이메일" });
    //   }
    // }

    // // 닉네임 변경
    // if (nickname) {
    //   // 닉네임 중복 확인
    //   const existingNicknameUser = await Member.findOne({
    //     where: { nickname: nickname },
    //   });

    //   if (existingNicknameUser) {
    //     console.log({ error: "중복된 닉네임입니다." });
    //     return res.send({ result: false, type: "닉네임" });
    //   } else {
    //     member.nickname = nickname;
    //     await member.save();
    //     return res.send({ result: true, type: "닉네임" });
    //   }
    // }
    // // 비밀번호 변경

    // if (currentPw === member.pw && newPw !== undefined) {
    //   member.pw = newPw;
    // } else {
    //   return res.send({
    //     result: false,
    //     message:
    //       currentPw !== member.pw
    //         ? "기존 비밀번호가 올바르지 않습니다."
    //         : "비밀번호를 입력해주세요.",
    //   });
    // }

    // await member.save();

    // return res.send({
    //   result: true,
    //   message: "회원 정보가 성공적으로 업데이트되었습니다.",
    // });
  } catch (error) {
    console.error('Error updating user info', error);
    return res.status(500).send('Internal Server Error');
  }
};
