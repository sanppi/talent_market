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
    } else if (type === 'confirmFast') {
      timeoutId = setTimeout(() => {
        disableModal();
      }, 1500);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [setToggleState, toggleState]);

  return (
    <>
      {toggleState && (
        <>
          <div className="modalContainer slideIn">
            <div className="modalExitWrapper" onClick={disableModal}>
              &times;
            </div>
            <div className="modalWrapper">
              {type === 'confirm' || type === 'confirmFast' ? (
                <>
                  <p>{content}</p>
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
          <div className="modalCanvas" onClick={disableModal}></div>
        </>
      )}
    </>
  );
}
