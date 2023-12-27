import { useRef } from 'react';
import { useForm } from 'react-hook-form';

export default function SignForm({ type }) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = (data) => {
    console.log(data);
    // POST 요청
    fetch('');
  };

  const pw = useRef();
  pw.current = watch('pw');

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="signUpForm">
          <div className="signUpInputForm">
            <div className="signUpInput">
              <label htmlFor="id">아이디 *</label>
              <input
                type="text"
                id="id"
                {...register('id', {
                  required: '아이디는 필수값입니다.',
                  pattern: {
                    value: /^[a-zA-Z]{2,20}$/,
                    message: '아이디는 영소문자 2자리 이상 입력하세요.',
                  },
                })}
              />
              {errors.id && <small role="alert">{errors.id.message}</small>}
            </div>
            <div className="signUpInput">
              <label htmlFor="pw">비밀번호 *</label>
              <input
                type="password"
                id="pw"
                ref={pw}
                {...register('pw', {
                  required: '비밀번호는 필수값입니다.',
                  pattern: {
                    value:
                      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
                    message:
                      '비밀번호는 숫자, 영소문자, 영대문자, 특수기호 포함 8자 이상 입력하세요.',
                  },
                })}
              />
              {errors.pw && <small role="alert">{errors.pw.message}</small>}
            </div>
            {type === 'signup' && (
              <>
                <div className="signUpInput">
                  <label htmlFor="pwCk">비밀번호 확인 *</label>
                  <input
                    id="pwCk"
                    type="password"
                    {...register('pwCk', {
                      required: '비밀번호를 다시 입력해 주세요.',
                      validate: {
                        check: (val) => {
                          if (pw.current !== val)
                            return '비밀번호가 일치하지 않습니다.';
                        },
                      },
                    })}
                  />
                  {errors.pwCk && (
                    <small role="alert">{errors.pwCk.message}</small>
                  )}
                </div>
                <div className="signUpInput">
                  <label htmlFor="nickname">닉네임 *</label>
                  <input
                    type="text"
                    id="nickname"
                    {...register('nickname', {
                      required: '닉네임은 필수값입니다.',
                    })}
                  />
                  {errors.nickname && (
                    <small role="alert">{errors.nickname.message}</small>
                  )}
                </div>
                <div className="signUpInput">
                  <label htmlFor="email">이메일 *</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="test@email.com"
                    {...register('email', {
                      required: '이메일은 필수값입니다.',
                      pattern: {
                        value: /^[a-z]+@[a-z]+.[a-z]+$/,
                        message: '올바른 이메일 형식을 입력하세요.',
                      },
                    })}
                  />
                  {errors.email && (
                    <small role="alert">{errors.email.message}</small>
                  )}
                </div>
                <div className="signUpInput">
                  <label htmlFor="accountNum">계좌번호</label>
                  <input
                    type="number"
                    id="accountNum"
                    name="accountNum"
                    placeholder="(option) 판매글 등록시 필요한 정보입니다."
                    // {...register("accountNum", {})}
                  />
                </div>
                {/* <div>로그인하러 가기</div> */}
              </>
            )}
          </div>
          <button type="submit" className="signUpButton" disabled={!isValid}>
            회원가입
          </button>
          {/* <Link to=""/> */}
        </div>
      </form>
    </>
  );
}
