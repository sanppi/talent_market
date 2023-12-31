import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/signform.scss';

export default function SignForm({ type }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signInCk, setSignInCk] = useState(false);
  const [signUpCk, setSignUpCk] = useState({ id: false, nickname: false });
  const [msg, setMsg] = useState({
    valid: '',
    idDuplicate: '',
    nicknameDuplicate: '',
  });
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
    trigger,
  } = useForm();

  const idValue = watch('id') || '';
  const pwValue = watch('pw') || '';
  const nicknameValue = watch('nickname') || '';

  useEffect(() => {
    setIsSignUp(type === 'signup');
  }, [type]);

  // 로그인 시 빈값 확인
  useEffect(() => {
    const isIdValid = idValue.trim() !== '';
    const isPwValid = pwValue.trim() !== '';
    const isSignInValid = isIdValid && isPwValid;

    setSignInCk(isSignInValid);
  }, [idValue, pwValue]);

  // 수동으로 유효성 검사
  const handleInputChange = async (fieldName, value) => {
    setValue(fieldName, value);
    await trigger(fieldName);
  };

  const onSubmit = async (data) => {
    // 회원가입 시
    if (isSignUp) {
      // 중복 체크 통과
      if (signUpCk.id && signUpCk.nickname) {
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
        // 중복 체크 미통과
      } else {
        setMsg((prev) => ({
          ...prev,
          valid: '아이디와 닉네임 중복 확인해 주세요.',
        }));
        // TODO : 아이디나 닉네임 값이 변경되면 다시 setMsg valid 빈값으로
      }
      // 로그인 시
    } else if (!isSignUp && signInCk) {
      console.log('aaa');
      try {
        const response = await axios({
          url: 'http://localhost:8000/member/signin',
          method: 'POST',
          data: data,
        });

        // DB에 존재 -> 로그인 이동
        if (response.data.result) navigate('/');
        // DB에 없음
        else {
          setMsg((prev) => ({
            ...prev,
            valid: '아이디와 비밀번호가 일치하지 않습니다.',
          }));
        }
      } catch (err) {
        console.error('signin err: ', err.message);
      }
    }
  };

  const pw = useRef();
  pw.current = watch('pw');

  // TEMP : 중복 체크 확인용 콘솔
  // useEffect(() => {
  //   console.log('signUpCk updated:', signUpCk);
  //   console.log('msg updated:', msg);
  // }, [signUpCk, msg]);

  // 중복 체크
  const handleCheck = async (type, value) => {
    try {
      if (errors.id) {
        setMsg((prev) => ({
          ...prev,
          [`${type}Duplicate`]: '❌',
        }));
      } else {
        const data = { [type]: value };
        const response = await axios.post(
          'http://localhost:8000/member/checkDuplicate',
          data
        );

        if (response.data.result) {
          setSignUpCk((prev) => ({ ...prev, [type]: true }));
          setMsg((prev) => ({
            ...prev,
            [`${type}Duplicate`]: 'OK',
          }));
        } else {
          setSignUpCk((prev) => ({ ...prev, [type]: false }));
          setMsg((prev) => ({
            ...prev,
            [`${type}Duplicate`]: '❌',
          }));
        }
      }
    } catch (err) {
      console.error('중복 체크 에러: ', err);
    }
  };

  // 엔터키 동작
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

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
                        message:
                          '아이디는 영문자나 숫자 2자리 이상 입력하세요.',
                      },
                    })}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                  />
                  <span role="alert">{msg.idDuplicate}</span>
                  <button
                    type="button"
                    onClick={() => handleCheck('id', idValue)}
                  >
                    아이디 중복 확인
                  </button>
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
                    onChange={(e) => handleInputChange('pw', e.target.value)}
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
                      onChange={(e) =>
                        handleInputChange('pwCk', e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange('nickname', e.target.value)
                      }
                    />
                    <span role="alert">{msg.nicknameDuplicate}</span>

                    <button
                      type="button"
                      onClick={() => handleCheck('nickname', nicknameValue)}
                    >
                      닉네임 중복 확인
                    </button>
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
                        pattern: {
                          value: /^[a-zA-Z0-9]+@[a-z]+.[a-z]+$/,
                          message: '올바른 이메일 형식을 입력하세요.',
                        },
                      })}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                    />
                    {errors.email && (
                      <small role="alert">{errors.email.message}</small>
                    )}
                    <div className="signMsg">
                      {!signUpCk.id || !signUpCk.nickname ? msg.valid : ''}
                    </div>
                  </div>
                  {/* TODO : 결제 정보(은행, 계좌번호) 컴포넌트 */}
                  <div className="signButtonBox">
                    <button
                      type="submit"
                      className="signButton"
                      disabled={!isValid}
                      onKeyDown={(e) => handleEnter(e)}
                    >
                      회원가입
                    </button>
                  </div>
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
                  <div className="signMsg">{msg.valid}</div>
                </div>
                <div className="signIn">
                  <div className="signButtonBox">
                    <button
                      type="submit"
                      className="signButton"
                      disabled={!signInCk}
                      onKeyDown={(e) => handleEnter(e)}
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
