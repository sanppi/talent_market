import UpdateInput from './UpdateInput';
import { useState } from 'react';

export default function UpdateBasicInput({
  register,
  handleInputChange,
  watchObj,
  nickname,
  errors,
  msg,
  handleCheck,
  email,
}) {
  // 닉네임과 이메일을 상태로 관리
  const [updatedNickname, setUpdatedNickname] = useState(
    nickname || watchObj?.nickname || ''
  );
  const [updatedEmail, setUpdatedEmail] = useState(
    watchObj?.email || email || ''
  );

  return (
    <>
      <UpdateInput
        label="닉네임"
        type="text"
        id="nickname"
        register={register}
        onChange={handleInputChange}
        value={updatedNickname}
        error={errors.nickname}
        validation={{
          required: '닉네임은 필수값입니다.',
          maxLength: {
            value: 7,
            message: '닉네임은 최대 7자까지 입력 가능합니다.',
          },
        }}
        hasButton={true}
        onButtonClick={(type) => handleCheck(type, updatedNickname)}
        msg={msg}
        isUpdate={true}
        onInfoChange={(newInfo) => setUpdatedNickname(newInfo)}
      />
      <UpdateInput
        label="이메일"
        type="email"
        id="email"
        register={register}
        onChange={handleInputChange}
        value={updatedEmail}
        placeholder="test@test.com"
        error={errors.email}
        validation={{
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: '올바른 이메일 형식을 입력하세요.',
          },
        }}
        hasButton={true}
        onButtonClick={(type) => handleCheck(type, updatedEmail)}
        msg={msg}
        isUpdate={true}
        onInfoChange={(newInfo) => setUpdatedEmail(newInfo)} // pass onInfoChange for email
      />
    </>
  );
}
