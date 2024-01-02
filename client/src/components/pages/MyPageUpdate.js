import SignUpInput from '../sign/SignUpInput';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '../../styles/signform.scss';
import SignButton from '../sign/SignButton';

export default function MyPageUpdate() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpCk, setSignUpCk] = useState({ id: false, nickname: false });
  const [msg, setMsg] = useState({
    validIn: '',
    validUp: '',
    idDuplicate: '',
    nicknameDuplicate: '',
  });

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
    trigger,
  } = useForm();

  const watchObj = watch();

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

  // 수동으로 유효성 검사
  const handleInputChange = useCallback(
    async (fieldName, value) => {
      setValue(fieldName, value);
      await trigger(fieldName);
    },
    [setValue, trigger]
  );

  const onSubmit = async (data) => {
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

  // 수정할 때 필요한 state - 객체로 해야 할듯..?
  //   const [editing, setEditing] = useState('');
  //   const [editNickname, setEditNickname] = useState('');
  //   const [editText, setEditText] = useState('');

  // 1. 유저가 입력한 DB 불러오기
  // 2. 수정하고서 버튼 클릭시 update : axios patch
  // 3. 성공 응답 받으면 alert(모달) 수정되었습니다 -> 마이페이지로 useNavigate
  // 4. 실패 응답 받으면 정보 수정에 실패했습니다? 비밀번호가 일치하지 않습니다?

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="signForm">
          <div className="signInputForm">
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
                  value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
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
                onButtonClick={(type) => handleCheck(type, watchObj.nickname)}
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
                type="회원정보 수정"
                isMsg={false}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
