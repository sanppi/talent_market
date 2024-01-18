// SB: 공지 내용이 뜨는 컴포넌트 파일입니다.
export default function Notice({ chat }) {
  return <div className="chattingText chattingNotice">{chat.content}</div>;
}
