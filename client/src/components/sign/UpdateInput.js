import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useToggle from '../hook/UseToggle';
import ModalBasic from '../ModalBasic';
import { useState, useEffect } from 'react';

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
  const navigate = useNavigate();

  // useEffect를 사용하여 value prop이 변경될 때마다 inputValue를 업데이트
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleBtnClick = async () => {
    onIsEditing();
    onChange(id, inputValue);
    onInfoChange(inputValue); // Call onInfoChange to update the parent state

    // TODO : 닉네임은 글자수 제한
    // TODO : 이메일은 형식 체크
    // const response = await axios({
    //   url: `${process.env.REACT_APP_DB_HOST}member/mypage/update/${memberId}`,
    //   data: { type: id, userData: inputValue },
    //   withCredentials: true,
    // });
    // if (response.data.result) {
    //   onModal();
    //   // div에 값 업데이트
    // onIsEditing();
    // onChange(id, inputValue);
    // }
    // TODO : 서버 요청 확인 후 redux 값 업데이트
  };

  return (
    <div className="signInput">
      <label htmlFor={id}>{label}</label>
      {isEditing ? (
        <div className="editBox">
          <input
            type={type}
            id={id}
            {...register(id, validation)}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
            <button className="editButton" type="button" onClick={onIsEditing}>
              취소
            </button>
          </div>
        </div>
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
