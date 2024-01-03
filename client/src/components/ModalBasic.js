import { useState } from 'react';
import '../styles/modalbasic.scss';

export default function ModalBasic() {
  const [isOpen, setIsOpen] = useState(true);
  const disableModal = () => {
    setIsOpen(false);
  };
  // TODO : 결제정보, 확인(신고, 탈퇴, 수정)
  // ERROR : 두번 눌러야 동작

  return (
    <>
      {isOpen && (
        <>
          <div className="modalContainer">
            <div className="modalExitWrapper">&times;</div>
            <div className="modalWrapper">
              <p>내용은 props로 넣어야겠씁니다?</p>
              <button>확인</button>
            </div>
          </div>
          <div className="modalCanvas" onClick={disableModal}></div>
        </>
      )}
    </>
  );
}
