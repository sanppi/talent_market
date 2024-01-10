import SignUpInput from './SignUpInput';
import SignButton from './SignButton';
import axios from 'axios';
import { useState } from 'react';
import useToggle from '../hook/UseToggle';
import ModalBasic from '../ModalBasic';
import { useSelector } from 'react-redux';

export default function UpdatePwInput({
  register,
  handleInputChange,
  watchObj,
  errors,
  setValue,
  onPwToggle,
}) {
  const [msg, setMsg] = useState('');
  const [modal, onModal] = useToggle(false);
  const memberId = useSelector((state) => state.auth.memberId);
  const [doneMsg, setDoneMsg] = useState('');

  const handlePwChange = async () => {
    const userData = {
      oldPw: watchObj.oldPw,
      newPw: watchObj.newPw,
    };

    const response = await axios({
      url: `${process.env.REACT_APP_DB_HOST}member/mypage/update/${memberId}`,
      method: 'post',
      data: { type: 'pw', userData: userData },
      withCredentials: true,
    });

    if (response.data.result) {
      onModal();
      setDoneMsg(response.data.message);
      setValue('oldPw', '');
      setValue('newPw', '');
      setValue('pwCk', '');
      setTimeout(() => {
        onPwToggle();
      }, 3000);
    } else {
      setMsg(response.data.message);
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
          content={doneMsg}
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
