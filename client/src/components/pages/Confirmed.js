// SB: 삭제 예정 파일입니다.
export default function Confirmed({ chat }) {
  return (
    <>
      <div className={`chattingText Chat`}>
        <div className="content">
          {chat.content}
        </div>
      </div>
    </>
  );
}
