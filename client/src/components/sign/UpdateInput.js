import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../module/action/authActions';
import axios from 'axios';
import useToggle from '../hook/UseToggle';
import ModalBasic from '../ModalBasic';

export default function UpdateInput({
  label,
  type,
  id,
  register,
  onChange,
  msg,
  value,
  error,
  hasButton,
  onButtonClick,
  validation,
  isUpdate,
  placeholder,
  onInfoChange,
}) {
  const [modal, onModal] = useToggle(false);
  const [isEditing, onIsEditing] = useToggle(false);
  const [inputValue, setInputValue] = useState(value);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const memberId = useSelector((state) => state.auth.memberId);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleBtnClick = async () => {
    const isValid = validateInput();

    if (isValid === '') {
      onIsEditing();
      onChange(id, inputValue);
      onInfoChange(inputValue);
      // 주석 처리한 서버와 연결
      const response = await axios({
        url: `${process.env.REACT_APP_DB_HOST}member/mypage/update/${memberId}`,
        data: { type: id, userData: inputValue },
        withCredentials: true,
      });

      console.log('response', response);
      if (response.data.result) {
        onModal();
        onIsEditing();
        onChange(id, inputValue);
      }
      dispatch(updateUser({ [id]: inputValue }));
    } else {
      setErrorMsg('유효하지 않은 값이 있습니다.');
    }
  };

  // input value 실시간 추적 후 유효성 메시지 세팅
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    const validationError = validateInput(inputValue);
    setErrorMsg(validationError);
  };

  // 유효성 검사 에러 메시지
  const validateInput = (value = inputValue) => {
    const { maxLength, pattern, required } = validation;

    if (required && value.trim() === '') {
      return '필수값을 입력하세요.';
    }

    if (maxLength && value.length > maxLength.value) {
      return `최대 ${maxLength.value}자 이내로 입력하세요.`;
    }

    if (type === 'email' && pattern && !pattern.value.test(value)) {
      return pattern.message || '올바른 이메일 형식을 입력하세요.';
    }

    return '';
  };

  return (
    <div className="signInput">
      <label htmlFor={id}>{label}</label>
      {isEditing ? (
        <>
          <div className="editBox">
            <input
              type={type}
              id={id}
              {...register(id, validation)}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
            />
            <div className="editButtonBox">
              <button
                className="editButton"
                type="button"
                onClick={handleBtnClick}
              >
                저장
              </button>
              <button
                className="editButton"
                type="button"
                onClick={onIsEditing}
              >
                취소
              </button>
            </div>
          </div>
          <small role="alert">{errorMsg}</small>
        </>
      ) : (
        <div className="profileNicknameBox">
          <div className="profileNickname">
            {!value ? '정보 없음' : inputValue}
          </div>
          <button className="editButton" onClick={onIsEditing}>
            수정
          </button>
        </div>
      )}

      {hasButton && (
        <>
          {isUpdate && (
            <>
              {modal && (
                <ModalBasic
                  type="confirm"
                  toggleState={true}
                  setToggleState={onModal}
                  content="수정"
                  onButtonClick={() => navigate('/member/mypage')}
                />
              )}
            </>
          )}
          {!isUpdate && (
            <>
              <span role="alert">{msg[`${id}Duplicate`]}</span>
              <button
                type="button"
                className="duplicateButton"
                onClick={() => onButtonClick(id)}
              >
                {label} 중복 확인
              </button>
            </>
          )}
        </>
      )}
      {error && <small role="alert">{error.message}</small>}
    </div>
  );
}
