import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '../../styles/signform.scss';
import { useNavigate, Link } from 'react-router-dom';

export default function SignForm({ type }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm();

  const idValue = watch('id') || '';
  const pwValue = watch('pw') || '';

  useEffect(() => {
    if (type === 'signup') {
      setIsSignUp(true);
    }
  }, []);

  useEffect(() => {
    const isIdValid = idValue.trim() !== '';
    const isPwValid = pwValue.trim() !== '';
    const isSignInValid = isIdValid && isPwValid;

    setIsFormValid(isSignInValid);
  }, [idValue, pwValue]);

  useEffect(() => {}, [msg]);

  const onSubmit = async (data) => {
    // 회원가입 시
    if (isSignUp) {
      const { pwCk, ...signUpData } = data;
      try {
        const response = await axios({
          url: 'http://localhost:8000/member/signup',
          method: 'POST',
          data: signUpData,
        });

        if (response.data.result) {
          setIsSignUp(false);
        }
      } catch (err) {
        console.error('signup err: ', err.message);
      }
    } else {
      // 로그인 시
      try {
        const response = await axios({
          url: 'http://localhost:8000/member/signin',
          method: 'POST',
          data: data,
        });

        if (response.data.result) navigate('/');
        else {
          // console.error('로그인 실패!');
          setMsg('아이디와 비밀번호가 일치하지 않습니다.');
        }
      } catch (err) {
        console.error('signin err: ', err.message);
      }
    }
  };

  const pw = useRef();
  pw.current = watch('pw');

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="signForm">
          <div className="signInputForm">
            {isSignUp ? (
              <>
                <div className="signInput">
                  <label htmlFor="id">아이디</label>
                  <input
                    type="text"
                    id="id"
                    {...register('id', {
                      required: '아이디는 필수값입니다.',
                      pattern: {
                        value: /^[a-zA-Z0-9]{2,20}$/,
                        message: '아이디는 영소문자 2자리 이상 입력하세요.',
                      },
                    })}
                  />
                  <button type="submit">아이디 중복 확인</button>
                  {errors.id && <small role="alert">{errors.id.message}</small>}
                </div>
                <div className="signInput">
                  <label htmlFor="pw">비밀번호</label>
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
                <div className="signUp">
                  <div className="signInput">
                    <label htmlFor="pwCk">비밀번호 확인</label>
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
                  <div className="signInput">
                    <label htmlFor="nickname">닉네임</label>
                    <input
                      type="text"
                      id="nickname"
                      {...register('nickname', {
                        required: '닉네임은 필수값입니다.',
                      })}
                    />
                    <button type="submit">닉네임 중복 확인</button>
                    {errors.nickname && (
                      <small role="alert">{errors.nickname.message}</small>
                    )}
                  </div>
                  <div className="signInput">
                    <label htmlFor="email">이메일</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="test@email.com"
                      {...register('email', {
                        required: '이메일은 필수값입니다.',
                        pattern: {
                          value: /^[a-zA-Z0-9]+@[a-z]+.[a-z]+$/,
                          message: '올바른 이메일 형식을 입력하세요.',
                        },
                      })}
                    />
                    {errors.email && (
                      <small role="alert">{errors.email.message}</small>
                    )}
                  </div>
                  {/* TODO : 결제 정보(은행, 계좌번호) 컴포넌트 */}
                  <button
                    type="submit"
                    className="signButton"
                    disabled={!isValid}
                  >
                    회원가입
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="signInput">
                  <label htmlFor="id">아이디</label>
                  <input type="text" id="id" {...register('id')} />
                </div>
                <div className="signInput">
                  <label htmlFor="pw">비밀번호</label>
                  <input type="password" id="pw" ref={pw} {...register('pw')} />
                  <div className="signInMsg">{msg}</div>
                </div>
                <div className="signIn">
                  <div className="signInButtonBox">
                    <button
                      type="submit"
                      className="signButton"
                      disabled={!isFormValid}
                    >
                      로그인
                    </button>
                    <div>
                      <Link to="/member/signup">계정이 없으신가요?</Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
