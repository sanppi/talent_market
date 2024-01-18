// SB: 채팅 메세지를 보여주는 파일입니다.
export default function Chat({ chat }) {
  return (
    <>
      <div className={`chattingText ${chat.type}Chat`}>
        <div>{chat.nickname}</div>
        <div className="chatContent">{chat.content}</div>
      </div>
    </>
  );
}
