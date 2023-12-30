import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '../../styles/signform.scss';
import { useNavigate, Link } from 'react-router-dom';

export default function SignForm({ type }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [signUpCk, setSignUpCk] = useState({ id: null, nickname: null });
  const [msg, setMsg] = useState('');
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

  useEffect(() => {
    const isIdValid = idValue.trim() !== '';
    const isPwValid = pwValue.trim() !== '';
    const isSignInValid = isIdValid && isPwValid;

    setIsFormValid(isSignInValid);
  }, [idValue, pwValue]);

  const handleInputChange = async (fieldName, value) => {
    // 값 업데이트
    setValue(fieldName, value);

    // 유효성 검사 실행
    await trigger(fieldName);
  };

  // TODO : 중복 확인(아이디, 닉네임) 다 되어야 회원가입 버튼 abled
  // 회원가입 validate를 따로 해줘야 하나?
  // 차라리 signup, signin 컴포넌트를 따로 만드는 게 나을지도 but slide..

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
          setMsg('아이디와 비밀번호가 일치하지 않습니다.');
        }
      } catch (err) {
        console.error('signin err: ', err.message);
      }
    }
  };

  const pw = useRef();
  pw.current = watch('pw');

  const handleCheck = async (type, value) => {
    const data = { [type]: value };
    const response = await axios.post(
      'http://localhost:8000/member/checkDuplicate',
      data
    );

    if (response.data.result) {
      // type에 id nickname이 담김
      // TODO : check? ✅
      if (type === 'id') {
        setSignUpCk((prev) => ({ ...prev, id: true }));
        console.log('ck', signUpCk);
      } else {
        setSignUpCk((prev) => ({ ...prev, nickname: true }));
        console.log('ck', signUpCk);
      }
    } else {
      // 처음에 중복 -> null / 중복에서 통과로 -> true
      // TODO : 중복 메시지 표시
      // 기존 msg는 폼 validate, 중복 msg는 또 새로운 state?
      console.log(`${response.data.type} 중복입니다.`);
      console.log('ck', signUpCk);
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
                        message: '아이디는 영문자 2자리 이상 입력하세요.',
                      },
                    })}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                  />
                  {/* id가 null이면 없고, false일 때만 중복처리 */}
                  <span>
                    {signUpCk.id === false && '중복입니다.'}
                    {signUpCk.id === true && '✅'}
                  </span>

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
