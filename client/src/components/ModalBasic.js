import '../styles/modalbasic.scss';
import { useEffect } from 'react';

export default function ModalBasic({
  type,
  content,
  onButtonClick,
  toggleState,
  setToggleState,
}) {
  const disableModal = () => {
    setToggleState();
  };

  useEffect(() => {
    let timeoutId;

    if (type === 'confirm') {
      timeoutId = setTimeout(() => {
        disableModal();
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [toggleState]);

  return (
    <>
      {toggleState && (
        <>
          <div className="modalContainer">
            <div className="modalExitWrapper" onClick={disableModal}>
              &times;
            </div>
            <div className="modalWrapper">
              {type === 'confirm' ? (
                <>
                  <p>{content}되었습니다.</p>
                  <button onClick={disableModal}>확인</button>
                </>
              ) : (
                <>
                  <p>정말 {content} 하시겠습니까?</p>
                  <button onClick={onButtonClick}>확인</button>
                </>
              )}
            </div>
          </div>
          {/* <div className="modalCanvas" onClick={disableModal}></div> */}
        </>
      )}
    </>
  );
}
