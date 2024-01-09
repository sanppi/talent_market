import SignUpInput from './SignUpInput';
import SignButton from './SignButton';
import axios from 'axios';
import { useState } from 'react';
import useToggle from '../hook/UseToggle';
import ModalBasic from '../ModalBasic';

export default function UpdatePwInput({
  register,
  handleInputChange,
  watchObj,
  errors,
}) {
  const [msg, setMsg] = useState('');
  const [modal, onModal] = useToggle(false);
  const handlePwChange = async () => {
    const userData = { oldPw: watchObj.oldPw, newPw: watchObj.newPw };
    console.log(userData);
    const response = await axios({
      url: `${process.env.REACT_APP_DB_HOST}`,
      method: 'post',
      data: userData,
    });
    console.log('pw res', response);
    // onModal();

    if (response.data.result) {
      // 비밀번호 변경 로직 :
      // const { oldPw, newPw } = req.body.userData;
      // oldPw와 같은 pw가 Member 테이블에 있는지 확인
      // 있으면 {result: false, message: 기존 비밀번호가 일치하지 않습니다.} 보내기
      // 없으면 newPw로 업데이트하고 {result: true} 보내기
      onModal();
    } else {
      // setMsg(response.data.message);
    }
  };

  return (
    <>
      <SignUpInput
        label="기존 비밀번호"
        type="password"
        id="oldPw"
        register={register}
        onChange={handleInputChange}
        value={watchObj?.oldPw || ''}
        validation={{
          required: true,
        }}
        isUpdate={true}
      />
      <SignUpInput
        label="새 비밀번호"
        type="password"
        id="newPw"
        register={register}
        onChange={handleInputChange}
        value={watchObj?.newPw || ''}
        validation={{
          required: '비밀번호는 필수값입니다.',
          pattern: {
            value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
            message:
              '비밀번호는 숫자, 영소문자, 영대문자, 특수기호 포함 8자 이상 입력하세요.',
          },
        }}
        error={errors.newPw}
        isUpdate={true}
      />
      <SignUpInput
        label="비밀번호 확인"
        type="password"
        id="pwCk"
        register={register}
        onChange={(id, value) => handleInputChange(id, value)}
        value={watchObj?.pwCk || ''}
        validation={{
          required: '비밀번호를 다시 입력해 주세요.',
          validate: {
            check: (val) => {
              if (watchObj.newPw !== val)
                return '비밀번호가 일치하지 않습니다.';
            },
          },
        }}
        error={errors.pwCk}
        isUpdate={true}
      />
      {modal && (
        <ModalBasic
          type="confirm"
          content="수정"
          toggleState={true}
          setToggleState={onModal}
        />
      )}
      <div>{msg}</div>
      <SignButton
        disabled={
          !watchObj.oldPw ||
          !watchObj.newPw ||
          !watchObj.pwCk ||
          errors.newPw ||
          errors.pwCk
        }
        onClick={handlePwChange}
        type="비밀번호 수정"
      />
    </>
  );
}
