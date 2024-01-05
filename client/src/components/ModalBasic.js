import '../styles/modalbasic.scss';

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

  // TODO : 결제정보, 확인(신고, 탈퇴, 수정)

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
                <p>{content}되었습니다.</p>
              ) : (
                <p>정말 {content} 하시겠습니까?</p>
              )}
              <button onClick={onButtonClick}>확인</button>
            </div>
          </div>
          {/* <div className="modalCanvas" onClick={disableModal}></div> */}
        </>
      )}
    </>
  );
}
