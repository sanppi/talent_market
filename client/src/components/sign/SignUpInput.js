import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import useToggle from '../hook/UseToggle';
import ModalBasic from '../ModalBasic';

export default function SignUpInput({
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
}) {
  const [modal, onModal] = useToggle(false);
  const memberId = useSelector((state) => state.auth.memberId);
  const navigate = useNavigate();
  const handleBtnClick = async () => {
    const response = await axios({
      url: `${process.env.REACT_APP_DB_HOST}member/mypage/update/${memberId}`,
      data: { type: 'nickname', userData: value },
      withCredentials: true,
    });
    console.log('엥', response.data);
    if (response.data.result) {
      console.log('??');
      onModal();
    }
  };

  return (
    <div className="signInput">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        {...register(id, validation)}
        onChange={(e) => onChange(id, e.target.value)}
        value={value}
        placeholder={placeholder}
      />
      {hasButton ? (
        <>
          {isUpdate ? (
            <>
              <button
                className="updateButton"
                type="button"
                // axios 요청
                onClick={handleBtnClick}
              >
                변경하기
              </button>
              {modal && (
                <ModalBasic
                  type="confirm"
                  toggleState={true}
                  setToggleState={onModal}
                  content="수정"
                  onButtonClick={navigate('/member/mypage')}
                />
              )}
            </>
          ) : (
            <>
              <span role="alert">{msg[`${id}Duplicate`]}</span>
              <button type="button" onClick={() => onButtonClick(id)}>
                {label} 중복 확인
              </button>
            </>
          )}
        </>
      ) : (
        ''
      )}
      {error && <small role="alert">{error.message}</small>}
    </div>
  );
}
