import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/signform.scss';
import SignUpInput from './SignUpInput';
import SignButton from './SignButton';
import SignInInput from './SignInInput';

import { connect } from 'react-redux';
import { loginSuccess, logout } from '../../module/action/authActions';

export function SignForm({ type, loginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signInCk, setSignInCk] = useState(false);
  const [signUpCk, setSignUpCk] = useState({ id: false, nickname: false });
  const [msg, setMsg] = useState({
    validIn: '',
    validUp: '',
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

  const watchObj = watch();

  useEffect(() => {
    setIsSignUp(type === 'signup');
  }, [type]);

  // 중복 체크 미통과 시 메시지 초기화
  useEffect(() => {
    if (isSignUp && (!signUpCk.id || !signUpCk.nickname)) {
      setMsg((prev) => ({
        ...prev,
        validUp: '',
      }));
    }
  }, [signUpCk.id, signUpCk.nickname, isSignUp]);

  // 사용자가 폼 필드 값을 변경할 때 메시지 초기화
  useEffect(() => {
    setMsg((prev) => ({
      ...prev,
      validUp: '',
    }));
  }, [watchObj.id, watchObj.nickname]);

  // 로그인 시 빈값 확인
  useEffect(() => {
    const isIdValid = (watchObj.id || '').trim() !== '';
    const isPwValid = (watchObj.pw || '').trim() !== '';
    const isSignInValid = isIdValid && isPwValid;

    setSignInCk(isSignInValid);

    // id나 pw가 바뀌면 해당 메시지 초기화
    setMsg((prev) => ({
      ...prev,
      validIn: '',
    }));
  }, [watchObj.id, watchObj.pw]);

  // 수동으로 유효성 검사
  const handleInputChange = useCallback(
    async (fieldName, value) => {
      setValue(fieldName, value);
      await trigger(fieldName);
    },
    [setValue, trigger]
  );

  const onSubmit = async (data) => {
    // 회원가입 시
    if (isSignUp) {
      // 중복 체크 통과
      if (signUpCk.id && signUpCk.nickname) {
        const { pwCk, ...signUpData } = data;
        try {
          const response = await axios({
            url: `${process.env.REACT_APP_DB_HOST}member/signup`,
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
          validUp: '아이디와 닉네임 중복 확인해 주세요.',
        }));
      }
      // 로그인 시
    } else if (!isSignUp && signInCk) {
      try {
        const response = await axios({
          url: `${process.env.REACT_APP_DB_HOST}member/signin`,
          method: 'POST',
          data: data,
          withCredentials: true,
        });

        // DB에 존재 -> 로그인 이동
        if (response.data.result) {
          // loginSuccess 함수를 호출할 때 액션 생성자 함수로 호출
          loginSuccess(response.data.userData);
          navigate('/');
        }
        // DB에 없음
        else {
          setMsg((prev) => ({
            ...prev,
            validIn: '아이디와 비밀번호가 일치하지 않습니다.',
          }));
        }
      } catch (err) {
        console.error('signin err: ', err.message);
      }
    }
  };

  // 중복 체크
  const handleCheck = useCallback(
    async (type, value) => {
      try {
        if (errors.id) {
          setMsg((prev) => ({
            ...prev,
            [`${type}Duplicate`]: '❌',
          }));
        } else {
          const data = { [type]: value };
          const response = await axios.post(
            `${process.env.REACT_APP_DB_HOST}member/checkDuplicate`,
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
    },
    [setSignUpCk, setMsg, errors.id]
  );

  // 엔터키 동작
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit);
    }
  };

  // redux 꺼내오기
  // const user1 = useSelector((state) => state.auth.user);
  // useEffect(() => {
  //   console.log('auth user', user1);
  // }, [user1]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="signForm">
          <div className="signInputForm">
            {isSignUp ? (
              <>
                <SignUpInput
                  label="아이디"
                  type="text"
                  id="id"
                  register={register}
                  onChange={(id, value) => handleInputChange(id, value)}
                  value={watchObj?.id || ''}
                  validation={{
                    required: '아이디는 필수값입니다.',
                    pattern: {
                      value: /^[a-zA-Z0-9]{2,20}$/,
                      message: '아이디는 영문자나 숫자 2자리 이상 입력하세요.',
                    },
                  }}
                  error={errors.id}
                  hasButton={true}
                  onButtonClick={(type) => handleCheck(type, watchObj.id)}
                  msg={msg}
                />
                <SignUpInput
                  label="비밀번호"
                  type="password"
                  id="pw"
                  register={register}
                  onChange={handleInputChange}
                  value={watchObj?.pw || ''}
                  validation={{
                    required: '비밀번호는 필수값입니다.',
                    pattern: {
                      value:
                        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
                      message:
                        '비밀번호는 숫자, 영소문자, 영대문자, 특수기호 포함 8자 이상 입력하세요.',
                    },
                  }}
                  error={errors.pw}
                  hasButton={false}
                />
                <div className="signUp">
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
                          if (watchObj.pw !== val)
                            return '비밀번호가 일치하지 않습니다.';
                        },
                      },
                    }}
                    error={errors.pwCk}
                    hasButton={false}
                  />
                  <SignUpInput
                    label="닉네임"
                    type="text"
                    id="nickname"
                    register={register}
                    onChange={handleInputChange}
                    value={watchObj?.nickname || ''}
                    error={errors.nickname}
                    validation={{
                      required: '닉네임은 필수값입니다.',
                    }}
                    hasButton={true}
                    onButtonClick={(type) =>
                      handleCheck(type, watchObj.nickname)
                    }
                    msg={msg}
                  />
                  <SignUpInput
                    label="이메일"
                    type="email"
                    id="email"
                    register={register}
                    onChange={handleInputChange}
                    value={watchObj?.email || ''}
                    validation={{
                      pattern: {
                        value: /^[a-zA-Z0-9]+@[a-z]+.[a-z]+$/,
                        message: '올바른 이메일 형식을 입력하세요.',
                      },
                    }}
                    error={errors.email}
                    hasButton={false}
                  />
                  <div className="signMsg">{msg.validUp}</div>
                  {/* TODO : 결제 정보(은행, 계좌번호) 컴포넌트 */}
                  <SignButton
                    disabled={!isValid}
                    onKeyDown={(e) => handleEnter(e)}
                    type="회원가입"
                    isMsg={false}
                  />
                </div>
              </>
            ) : (
              <>
                <SignInInput
                  id="id"
                  register={register}
                  type="text"
                  label="아이디"
                  value={watchObj?.id || ''}
                  isMsg={false}
                />
                <SignInInput
                  id="pw"
                  register={register}
                  type="password"
                  label="비밀번호"
                  value={watchObj?.pw || ''}
                  isMsg={true}
                  msg={msg.validIn}
                />
                <div className="signMsg">{msg.validIn}</div>
                <div className="signIn">
                  <SignButton
                    disabled={!signInCk}
                    onKeyDown={(e) => handleEnter(e)}
                    type="로그인"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

// 위에서 정의한 SignForm 컴포넌트에 connect 적용
const ConnectedSignForm = connect(
  // mapStateToProps 함수 - state에서 필요한 데이터를 props로 매핑
  (state) => ({
    user: state.auth.user,
  }),
  // mapDispatchToProps 객체 - 액션 생성자 함수를 props로 매핑
  {
    loginSuccess,
    logout,
  }
)(SignForm);

export default ConnectedSignForm;
