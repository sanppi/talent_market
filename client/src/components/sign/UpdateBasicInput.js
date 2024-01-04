import SignUpInput from './SignUpInput';

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
  return (
    <>
      <SignUpInput
        label="닉네임"
        type="text"
        id="nickname"
        register={register}
        onChange={handleInputChange}
        value={watchObj?.nickname || nickname || ''}
        error={errors.nickname}
        validation={{
          required: '닉네임은 필수값입니다.',
        }}
        hasButton={true}
        onButtonClick={(type) => handleCheck(type, watchObj.nickname)}
        msg={msg}
        isUpdate={true}
      />
      <SignUpInput
        label="이메일"
        type="email"
        id="email"
        register={register}
        onChange={handleInputChange}
        value={watchObj?.email || email || ''}
        placeholder="test@test.com"
        error={errors.email}
        validation={{
          pattern: {
            value: /^[a-zA-Z0-9]+@[a-z]+.[a-z]+$/,
            message: '올바른 이메일 형식을 입력하세요.',
          },
        }}
        hasButton={true}
        onButtonClick={(type) => handleCheck(type, watchObj.email)}
        msg={msg}
        isUpdate={true}
      />
    </>
  );
}
