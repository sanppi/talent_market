import SignUpInput from '../../sign/SignUpInput';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '../../../styles/signform.scss';
import '../../../styles/mypageupdate.scss';
import SignButton from '../../sign/SignButton';
import { connect } from 'react-redux';
import ModalBasic from '../../ModalBasic';
import useToggle from '../../hook/UseToggle';

function MyPageUpdate({ user }) {
  const { memberId, nickname, email } = user;
  const [signUpCk, setSignUpCk] = useState({ id: false, nickname: false });
  const [msg, setMsg] = useState({
    validIn: '',
    validUp: '',
    idDuplicate: '',
    nicknameDuplicate: '',
  });
  const [toggle, onToggle] = useToggle(false);

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
    if (!signUpCk.id || !signUpCk.nickname) {
      setMsg((prev) => ({
        ...prev,
        validUp: '',
      }));
    }
  }, [signUpCk.id, signUpCk.nickname]);

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

  // TODO : 유효성 검사 마친 후, 서버에 요청 잘 갔으면 해당 값으로 redux도 업데이트
  // 초기화
  // useEffect(() => {
  //   setValue('nickname', user.nickname);
  //   setValue('email', user.email);
  // }, [user]);

  const onSubmit = async (data) => {
    // 중복 체크 통과
    if (signUpCk.nickname) {
      try {
        const response = await axios({
          url: `${process.env.REACT_APP_DB_HOST}member/mypage/update/${memberId}`,
          method: 'POST',
          data: data,
        });

        if (response.data.result) {
          // TODO : action이랑 reducer 만들기 : dispatch(updateUser(data));
        }
      } catch (err) {
        console.error('signup err: ', err.message);
      }
      // 중복 체크 미통과
    } else {
      setMsg((prev) => ({
        ...prev,
        validUp: '닉네임 중복 확인해 주세요.',
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

  return (
    <>
      <ModalBasic />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="signForm">
          <div className="signInputForm">
            <SignUpInput
              label="닉네임"
              type="text"
              id="nickname"
              register={register}
              onChange={handleInputChange}
              // TODO : 유효성 검사 통과한 값을 일괄 입력해서 서버 전송 + redux에도 업데이트
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
            />
            {/* TODO : 비밀번호는 기존 / 새 / 새 확인 - 모달? */}
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
              />
              {/* TODO : 결제 정보(은행, 계좌번호) 컴포넌트 */}
              <div className="myAccount" onClick={onToggle}>
                결제정보 입력
              </div>
              {toggle && <ModalBasic />}
              <div className="signMsg">{msg.validUp}</div>
              <SignButton
                disabled={!isValid}
                onKeyDown={(e) => handleEnter(e)}
                type="회원정보 수정"
              />
              <div className="userDelete">회원 탈퇴</div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedMyPageUpdate = connect(mapStateToProps)(MyPageUpdate);

export default ConnectedMyPageUpdate;
