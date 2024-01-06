import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import ModalBasic from '../../ModalBasic';
import useToggle from '../../hook/UseToggle';
import { deleteSuccess } from '../../../module/action/authActions';
import '../../../styles/signform.scss';
import '../../../styles/mypageupdate.scss';
import axios from 'axios';
import UpdateBasicInput from '../../sign/UpdateBasicInput';
import UpdatePwInput from '../../sign/UpdatePwInput';
import ModalAccount from '../../ModalAccount';

export function MyPageUpdate({ user, deleteSuccess }) {
  const { memberId, nickname, email } = user;
  const [signUpCk, setSignUpCk] = useState({ id: false, nickname: false });
  const [msg, setMsg] = useState({
    validPw: '',
    validUp: '',
    idDuplicate: '',
    nicknameDuplicate: '',
  });
  const [accountToggle, onAccountToggle] = useToggle(false);
  const [deleteToggle, onDeleteToggle] = useToggle(false);
  const [pwToggle, onPwToggle] = useToggle(false);
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm();

  const watchObj = watch();

  // 중복 체크 미통과 시 메시지 초기화
  // useEffect(() => {
  //   if (!signUpCk.id || !signUpCk.nickname) {
  //     setMsg((prev) => ({
  //       ...prev,
  //       validPw: '',
  //     }));
  //   }
  // }, [signUpCk.id, signUpCk.nickname]);

  // 사용자가 폼 필드 값을 변경할 때 메시지 초기화
  useEffect(() => {
    setMsg((prev) => ({
      ...prev,
      validUp: '',
    }));
  }, [watchObj.id, watchObj.nickname]);

  useEffect(() => {
    if (!memberId) {
      navigate('/member/signin');
    }
  }, [memberId]);

  // 수동으로 유효성 검사
  const handleInputChange = useCallback(
    async (fieldName, value) => {
      setValue(fieldName, value);
      await trigger(fieldName);
    },
    [setValue, trigger]
  );

  // 비밀번호 변경
  const onSubmit = async (data) => {
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_DB_HOST}member/mypage/update/${memberId}`,
        method: 'POST',
        data: data,
        withCredentials: true,
      });
      if (response.data.result) {
        // TODO : 성공하면..
      }
    } catch (err) {
      console.error('비번 수정 err: ', err.message);
    }
    // 중복 체크 미통과
    setMsg((prev) => ({
      ...prev,
      validPw: '기존 비밀번호와 일치하지 않습니다.',
    }));
  };

  // 중복 체크 안 해도?
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

  // 회원 탈퇴
  const deleteUser = async () => {
    const response = await axios({
      url: `${process.env.REACT_APP_DB_HOST}member/mypage/delete/${memberId}`,
      method: 'DELETE',
    });
    if (response.data.success) {
      deleteSuccess();
      navigate('/');
    }
  };

  return (
    <>
      {memberId && (
        <form name="myPageForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="signForm">
            <div className="signInputForm">
              <div>기본정보</div>
              <UpdateBasicInput
                register={register}
                handleInputChange={handleInputChange}
                watchObj={watchObj}
                nickname={nickname}
                errors={errors}
                handleCheck={handleCheck}
                email={email}
              />
              <div className="myPw" onClick={onPwToggle}>
                비밀번호 변경 {pwToggle ? '' : '>'}
              </div>
              {pwToggle && (
                <>
                  <div className="slideIn">
                    <UpdatePwInput
                      register={register}
                      handleInputChange={handleInputChange}
                      watchObj={watchObj}
                      errors={errors}
                    />
                  </div>
                </>
              )}
              <div
                className={`myAccount ${
                  accountToggle ? 'slideIn' : 'slideOut'
                }`}
                onClick={onAccountToggle}
              >
                결제정보 등록 >
              </div>
              {accountToggle && (
                <ModalAccount setToggleState={onAccountToggle} />
              )}
              <div className="userDelete" onClick={onDeleteToggle}>
                회원 탈퇴
              </div>
              {deleteToggle && (
                <ModalBasic
                  content="탈퇴"
                  onButtonClick={deleteUser}
                  toggleState={true}
                  setToggleState={onDeleteToggle}
                />
              )}
            </div>
          </div>
        </form>
      )}
    </>
  );
}

const ConnectedMyPageUpdate = connect(
  (state) => ({
    user: state.auth,
  }),
  { deleteSuccess }
)(MyPageUpdate);

export default ConnectedMyPageUpdate;
