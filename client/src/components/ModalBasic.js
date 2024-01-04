import { useState } from 'react';
import '../styles/modalbasic.scss';

export default function ModalBasic({ type, content, onButtonClick }) {
  const [isOpen, setIsOpen] = useState(true);
  const disableModal = () => {
    setIsOpen(false);
  };
  // TODO : 결제정보, 확인(신고, 탈퇴, 수정)

  return (
    <>
      {isOpen && (
        <>
          <div className="modalContainer">
            <div className="modalExitWrapper" onClick={disableModal}>
              &times;
            </div>
            <div className="modalWrapper">
              <p>{content}</p>
              <button onClick={onButtonClick}>확인</button>
            </div>
          </div>
          <div className="modalCanvas" onClick={disableModal}></div>
        </>
      )}
    </>
  );
}
